import { createHash } from 'node:crypto'
import db from '@adonisjs/lucid/services/db'

/** Database-backed fixed windows survive restarts and cannot be reset by clearing cookies. */
export async function allowRequest(scope: string, identity: string, max: number, seconds: number) {
  const now = Date.now()
  const bucket = Math.floor(now / (seconds * 1000))
  const key = createHash('sha256').update(`${scope}:${identity}:${bucket}`).digest('hex')
  await db.from('request_limits').where('expires_at', '<', now).delete()
  await db
    .table('request_limits')
    .insert({ key, count: 0, expires_at: (bucket + 1) * seconds * 1000 })
    .onConflict('key')
    .ignore()
  const updated = await db
    .from('request_limits')
    .where('key', key)
    .where('count', '<', max)
    .increment('count', 1)
  return Number(updated) > 0
}
