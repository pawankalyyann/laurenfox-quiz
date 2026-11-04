# K20 quiz: private admin access (local demo)

This patch keeps both assignment-required capabilities (Quiz and Configuration) but hides Configuration from unauthenticated participants. The URL itself is NOT the security control: every configuration action is checked on the server.

## Local setup

1. Open your existing `.env` on your Mac. **Do not upload or commit it.**
2. Add a random, unique, difficult-to-guess key, for example, generate one locally with `openssl rand -hex 32` and paste the output into:

   ```env
   ADMIN_ACCESS_KEY=your-new-random-string-from-openssl
   ```

3. Restart `npm run dev` (Ctrl+C, then `npm run dev`) so the new variable is loaded.
4. Open `http://localhost:3333/admin/login` and enter your chosen key.
5. After login, Configuration appears in navigation. Click Edit on any question; make a change and Save Changes. Test deleting a throwaway question (there is now a confirmation step).
6. Open a separate incognito browser window and check that `http://localhost:3333/configuration` redirects to `/admin/login`. The public quiz `/` should still work.

## Evaluator access

The README requires configuration **add and edit** to be reviewable. Send reviewer access instructions through an appropriate private channel if requested. Never include the access key in commits, README, screenshots, or a public web page. For a public deployment, use a managed authentication system, TLS, rate limiting, and access logging before handling real participant information. This demonstration access-key gate is not a production-grade multi-user identity system.

## Smoke tests

```bash
npm run typecheck
npm run lint
```

Verify A/B/C/D options, Q01–Q10 labels, 10/10 correct scoring, deliberately incorrect answer scoring, and that non-admins can't create/update/delete questions by sending requests directly.

## Required assignment disclosure

The provided README says AI use is allowed but **must be disclosed by email** after working, including your own design decisions and explanations. Keep this in the final submission checklist.
