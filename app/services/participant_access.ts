import type { HttpContext } from '@adonisjs/core/http'
import Participant from '#models/participant'

export async function verifiedParticipant(session: HttpContext['session']) {
  const id = session.get('verifiedParticipantId')
  if (!id) return null
  const participant = await Participant.find(id)
  return participant?.emailVerified ? participant : null
}
