# Admin Access (Local Setup)

Question management (add, edit, delete) is restricted to administrators. Configuration is hidden from regular participants, and every configuration action is also checked on the server, so the hidden URL is not the only protection.

## Setup

1. Open your local `.env` file. **Never commit it.**
2. Generate a random key:

   ```bash
   openssl rand -hex 32
   ```

   Add it to `.env`:

   ```env
   ADMIN_ACCESS_KEY=your-random-key
   ```

3. Restart the dev server (`Ctrl+C`, then `npm run dev`).
4. Open http://localhost:3333/admin/login and enter your key.
5. After login, Configuration appears in the navigation. Edit a question and save it, then delete a test question (deleting asks for confirmation).
6. In a private browser window, confirm that http://localhost:3333/configuration redirects to `/admin/login` and that the public quiz at `/` still works.

## Security Notes

The shared access key is a simple gate for local demos, not a production identity system. A public deployment would need individual admin accounts with managed authentication, TLS, rate limiting, and access logging.

## Smoke Tests

```bash
npm run typecheck
npm run lint
```

Then check A/B/C/D options, question labels, a perfect score, a deliberately wrong answer, and that non-admins can't create, update, or delete questions by sending requests directly.
