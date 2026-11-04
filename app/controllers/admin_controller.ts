import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class AdminController {
  async index({ session, response, inertia, request }: HttpContext) {
    if (session.get('adminAuthorized') !== true) return response.redirect().toPath('/admin/login')
    const page = Math.max(1, Math.min(100000, Number.parseInt(request.input('page', '1'), 10) || 1))
    const participants = await db
      .from('participants')
      .select('id', 'full_name', 'email', 'email_verified', 'created_at')
      .orderBy('id', 'desc')
      .paginate(page, 20)
    const attempts = await db
      .from('quiz_attempts')
      .join('participants', 'participants.id', 'quiz_attempts.participant_id')
      .select(
        'quiz_attempts.id',
        'participants.full_name',
        'quiz_attempts.correct',
        'quiz_attempts.total',
        'quiz_attempts.created_at'
      )
      .orderBy('quiz_attempts.id', 'desc')
      .paginate(page, 20)
    const count = await db.from('participants').count('* as total').first()
    const verified = await db
      .from('participants')
      .where('email_verified', true)
      .count('* as total')
      .first()
    const completed = await db.from('quiz_attempts').count('* as total').first()
    return inertia.render('admin_dashboard', {
      stats: {
        participants: Number(count.total),
        verified: Number(verified.total),
        attempts: Number(completed.total),
      },
      participants: participants.all(),
      attempts: attempts.all(),
      page,
      hasNext: participants.hasMorePages || attempts.hasMorePages,
    })
  }
}
