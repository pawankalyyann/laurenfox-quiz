import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import Participant from '#models/participant'
import OtpChallenge from '#models/otp_challenge'
import env from '#start/env'
import { registerParticipantValidator } from '#validators/participant'
import { generateOtpCode, hashOtpCode, verifyOtpCode } from '#services/otp_code'
import { allowRequest } from '#services/request_limit'

export default class ParticipantsController {
  async create({ inertia }: HttpContext) {
    return inertia.render('register', {})
  }

  private async issue(ctx: HttpContext, participant: Participant) {
    if (!(await allowRequest('otp-minute', String(participant.id), 1, 60))) {
      ctx.session.flash('error', 'Please wait one minute before requesting another code.')
      return
    }
    if (!(await allowRequest('otp-hour', String(participant.id), 5, 3600))) {
      ctx.session.flash(
        'error',
        'You have reached the limit of five codes this hour. Please try again next hour.'
      )
      return
    }
    const latest = await OtpChallenge.query()
      .where('participantId', participant.id)
      .orderBy('id', 'desc')
      .first()
    if (latest && DateTime.utc().diff(latest.lastSentAt, 'seconds').seconds < 60) {
      ctx.session.flash('error', 'Please wait one minute before requesting another code.')
      return
    }
    const code = generateOtpCode()
    const now = DateTime.utc()
    // Invalidate earlier challenges, including challenges in other browser sessions.
    await OtpChallenge.query()
      .where('participantId', participant.id)
      .whereNull('usedAt')
      .update({ usedAt: now.toSQL() })
    const challenge = await OtpChallenge.create({
      participantId: participant.id,
      codeHash: hashOtpCode(code, participant.id, env.get('OTP_SECRET').release()),
      expiresAt: now.plus({ minutes: 10 }),
      lastSentAt: now,
      failedAttempts: 0,
      usedAt: null,
    })
    ctx.session.put('otpChallengeId', challenge.id)
    try {
      await mail.send((message) => {
        message
          .to(participant.email)
          .subject('Your Lauren Fox Quiz verification code')
          .text(
            `Your verification code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`
          )
      })
      ctx.session.flash('success', 'Verification code sent. Check your inbox and spam folder.')
    } catch {
      challenge.usedAt = DateTime.utc()
      await challenge.save()
      // Do not log SMTP errors: providers may include credentials or recipient data.
      ctx.session.flash(
        'error',
        'Email could not be sent. Check the sender configuration, then request a new code after one minute.'
      )
    }
  }

  async store(ctx: HttpContext) {
    const { request, response, session } = ctx
    if (!(await allowRequest('registration', request.ip(), 10, 3600))) {
      session.flash('error', 'Too many registrations. Please try again later.')
      return response.redirect().toPath('/register')
    }
    const { fullName, email, phone } = await request.validateUsing(registerParticipantValidator)
    const participant = await Participant.firstOrCreate(
      { email: email.trim().toLowerCase() },
      {
        fullName,
        phone: phone || null,
        emailVerified: false,
      }
    )
    // An existing verified database row does not authenticate a new browser.
    session.forget('verifiedParticipantId')
    session.forget('quizAttempt')
    session.forget('quizResultId')
    session.forget('otpChallengeId')
    session.put('pendingParticipantId', participant.id)
    await this.issue(ctx, participant)
    return response.redirect().toPath('/verify-email')
  }

  async pending({ session, response, inertia }: HttpContext) {
    const participant = await Participant.find(session.get('pendingParticipantId') || 0)
    if (!participant) return response.redirect().toPath('/register')
    return inertia.render('registration_pending', { email: participant.email })
  }

  async resend(ctx: HttpContext) {
    const participant = await Participant.find(ctx.session.get('pendingParticipantId') || 0)
    if (!participant) return ctx.response.redirect().toPath('/register')
    if (await allowRequest('resend-ip', ctx.request.ip(), 20, 3600))
      await this.issue(ctx, participant)
    else ctx.session.flash('error', 'Too many requests. Please try again later.')
    return ctx.response.redirect().toPath('/verify-email')
  }

  async verify({ request, session, response }: HttpContext) {
    const code = request.input('code')
    const participantId = session.get('pendingParticipantId')
    const challengeId = session.get('otpChallengeId')
    let accepted = false
    if (participantId && challengeId && typeof code === 'string' && /^\d{6}$/.test(code)) {
      accepted = await db.transaction(async (trx) => {
        // Claim one attempt atomically BEFORE reading the hash; concurrent requests cannot bypass the cap.
        const changed = await trx
          .from('otp_challenges')
          .where('id', challengeId)
          .where('participant_id', participantId)
          .whereNull('used_at')
          .where('expires_at', '>', DateTime.utc().toSQL()!)
          .where('failed_attempts', '<', 5)
          .increment('failed_attempts', 1)
        if (!Number(changed)) return false
        const challenge = await OtpChallenge.query({ client: trx })
          .where('id', challengeId)
          .firstOrFail()
        if (
          !verifyOtpCode(code, challenge.codeHash, participantId, env.get('OTP_SECRET').release())
        )
          return false
        challenge.usedAt = DateTime.utc()
        await challenge.save()
        await trx.from('participants').where('id', participantId).update({ email_verified: true })
        return true
      })
    }
    if (!accepted) {
      session.flash(
        'error',
        'Invalid, expired, or already used code. Codes allow five attempts; request a new one if needed.'
      )
      return response.redirect().toPath('/verify-email')
    }
    await session.regenerate()
    session.put('verifiedParticipantId', participantId)
    session.forget('pendingParticipantId')
    session.forget('otpChallengeId')
    return response.redirect().toPath('/')
  }
}
