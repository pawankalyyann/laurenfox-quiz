import type { HttpContext } from '@adonisjs/core/http'
import Participant from '#models/participant'
import { registerParticipantValidator } from '#validators/participant'

export default class ParticipantsController {
  async create({ inertia }: HttpContext) {
    return inertia.render('register', {})
  }

  async store({ request, response, session }: HttpContext) {
    const { fullName, email, phone } = await request.validateUsing(registerParticipantValidator)

    const normalizedEmail = email.trim().toLowerCase()

    const participant = await Participant.firstOrCreate(
      { email: normalizedEmail },
      {
        fullName,
        email: normalizedEmail,
        phone: phone ?? null,
        emailVerified: false,
      }
    )

    // Registration alone does not verify email ownership.
    session.put('pendingParticipantId', participant.id)

    return response.redirect().toPath('/verify-email')
  }

  async pending({ session, response, inertia }: HttpContext) {
    const pendingId = session.get('pendingParticipantId')

    if (!pendingId) {
      return response.redirect().toPath('/register')
    }

    return inertia.render('registration_pending', {})
  }
}
