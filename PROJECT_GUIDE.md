# Lauren Fox Quiz — implementation and handoff

## What changed
The original task's four-choice question editor and server-side scoring remain. Participant registration now sends an email code, verification unlocks the assessment, and each score is stored in SQLite. The public quiz, verification, results, and administrator pages share a dark crimson/white design. The welcome design is preserved.

Public flow: /welcome → /register → /verify-email → / → /quiz/results.
Private entry: /admin/login → /admin/dashboard. Question management remains /configuration.
The dashboard includes paginated participant verification status and saved scores. No participant data is exposed without administrator authorization.

## Upgrade an existing project
Use the supplied START_HERE.md and installer. Stop the dev server and save/close VS Code editors first. The installer checks files against the uploaded source before replacing them, backs up changed files and the database outside the repository, and only adds OTP_SECRET if missing. Existing SMTP, application and admin credentials are retained.
Run migration:run, NEVER migration:fresh against your working database. The new migration adds the fields omitted by the already-applied OTP migration and creates quiz_attempts and request_limits. Earlier migrations are unchanged.

## Fresh clone setup
Requires Node 24+ and npm. After the upgrade, commit database/fixtures/questions.json (exported automatically by the installer) so reviewers can reproduce your actual questions without your private database.

```bash
npm ci
cp SETUP_ENV.example .env
node ace generate:key
```
Fill SMTP and admin credentials privately. Generate a separate OTP_SECRET with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and paste it into .env. Do not paste the value into chat or Git.

```bash
mkdir -p tmp
node ace codegen
node ace migration:run
node ace quiz:seed
npx prettier --write database/schema.ts
npm run typecheck
npm run lint
npm test
npm run build
npm run dev
```
quiz:seed refuses to alter an existing question set. If no question fixture was exported, add questions in the admin portal instead. Tests use tmp/test.sqlite3, distinct from the working database.

## Security and design decisions to explain
- OTP codes use cryptographic random generation and keyed SHA-256 hashing; plaintext codes are only passed to the mail transport.
- Codes expire after 10 minutes, allow five attempts, are consumed once, and are bound to the pending browser session and participant. Registration of an existing verified email still requires a new code.
- Database rate limits restrict issuance, registration, resend and admin login. These fixed windows are sufficient for a single small deployment; broader production abuse controls may require a reverse proxy or dedicated limiter.
- The server checks participant access before reading questions, grading or showing results. Public question payloads omit correctness flags.
- The server validates that each submitted option belongs to its question and that all questions were answered exactly once.
- A fingerprint detects questions changed during an attempt. A unique attempt token avoids duplicate saved scores. Retakes create new attempts.
- Saved answer reviews are snapshots: later question edits cannot rewrite a historical result.
- Admin requests check authorization before reading/modifying data. CSRF protection remains enabled. Admin access uses the existing shared access-key design, not individual staff accounts.
- Radio inputs, visible focus indicators, keyboard navigation, mobile layouts, reduced-motion rules and readable type support accessibility. Browser visual/accessibility QA still needs a local pass.

## Verification completed here
- All five migrations ran successfully against SQLite, including the additive OTP repair.
- TypeScript, ESLint, and the production build passed.
- Six automated tests passed: OTP binding/format, grading rejection cases, fingerprint behavior, full HTTP registration-to-results flow, expiry/lockout/cooldown/CSRF, and admin CRUD/stale-attempt/logout.
- Email delivery in tests used Adonis Mail's fake transport. Real SMTP credentials were not available or used.
- Tests ran via the application's direct test entrypoint because this execution host cannot enumerate network interfaces for the ace test launcher. Normal npm test is the intended Mac command.
- No browser visual test was completed: the browser binary download was unavailable in this environment.

## Local acceptance checks before submission
1. Set real Gmail credentials (an eligible Google App Password, not a normal account password). Register an inbox you control; confirm the email arrives and its code opens the quiz.
2. Check every original question, keyboard selection, Previous/Next navigation, answered count, submit and score review on desktop and narrow mobile width.
3. In an incognito browser, try /, /quiz/results, /configuration and /admin/dashboard; verify access is denied or redirected appropriately.
4. Sign in at /admin/login. Confirm your participant, verification status and score appear. Test question add/edit/delete with a disposable question.
5. Confirm database/fixtures/questions.json contains your intended questions before committing it. Review git diff and commit intentional changes in meaningful groups.
6. Rotate previously exposed APP_KEY and ADMIN_ACCESS_KEY before sharing/deploying. APP_KEY rotation invalidates existing sessions; no rotation was performed by the installer.

## Deployment scope
This archive is an application update, not a deployed website or purchased domain. The original README does not require a custom domain. For any public deployment use HTTPS, NODE_ENV=production, a persistent writable SQLite volume, environment secrets and approved SMTP egress. The production database path is the running application's tmp/db.sqlite3; keep it outside ephemeral/replaced build storage via a persistent mount. Do not present local tests as a production load or security audit. No team notification emails were added.

## Submission and interview
The original README allows AI assistance and requires email disclosure. Describe accurately that AI assisted implementation/debugging, while you reviewed the changes and tested the application. Be ready to explain controllers → validation → models/transactions → Inertia props, why correct answers stay server-side, why verification belongs on the server, and why saved results use snapshots. Do not claim a feature was manually authored or a test was run unless that is true.
