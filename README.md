# LaurenFox Quiz

A full-stack quiz web application with multiple-choice quizzes, server-side scoring, email verification, and an admin dashboard for managing questions and reviewing saved attempts.

---

## Features

- **Multiple-choice quizzes:** participants answer every question and submit for scoring
- **Server-side scoring:** the server validates each submission and calculates the authoritative score
- **Results review:** participants see their score and an answer review after submitting
- **Email verification:** participants verify their email with a code that expires, has an attempt limit, and has resend limits
- **Admin dashboard:** administrators create, edit, and delete questions, set four answer choices with one correct answer, and view saved attempts
- **Reliable results:**
  - Stale-quiz detection rejects a submission if the questions changed after the participant loaded the quiz
  - Each saved attempt keeps a snapshot of what was graded, so editing questions later doesn't rewrite past results
  - A unique attempt token prevents duplicate attempts from repeated submissions

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React, Inertia, Tailwind CSS |
| Backend | AdonisJS 7 (TypeScript) |
| Database | SQLite with Lucid ORM |
| Quality checks | Automated tests, TypeScript type checks, lint, production build |
| Version control | Git and GitHub |
| Development | AI-assisted coding (ChatGPT, Codex) for implementation, debugging, and tests |

## How It Works

React renders the pages, and Inertia connects them to the AdonisJS backend. AdonisJS handles routes, validation, and application logic. Lucid manages the database models and queries, and SQLite stores the data. Answer choices are stored as separate records linked to their question, so the server can confirm that each submitted choice belongs to the question being answered.

## Screenshots

_Coming soon: quiz page, results page, and admin dashboard._

## How to Run

Requires Node.js 24 or newer and Git.

```bash
git clone https://github.com/pawankalyyann/laurenfox-quiz.git
cd laurenfox-quiz
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

Then open http://localhost:3333.

Quality checks:

```bash
node ace test        # automated tests
npm run typecheck    # TypeScript checks
npm run lint         # lint
```

## Testing

- 6 automated tests covering scoring, email verification, access restrictions, data persistence, admin question management, and stale quizzes
- TypeScript type checks, lint, and a production build all pass
- Manual browser testing of question management, scoring, and access restrictions

## What I Built

I started from a provided starter app that had a Quiz tab, a Configuration tab, and text-only questions. I extended it with the full quiz flow: multiple-choice questions, submissions, server-side scoring, and results. I also added participant email verification and an admin dashboard with saved attempts. I learned an unfamiliar stack by tracing one complete workflow first, then made and tested small changes.

## What I'd Improve Next

- A fuller accessibility and cross-browser review
- Individual administrator accounts instead of a shared demo access key
- Deployment and monitoring

## What I Learned

- How to learn a new framework quickly by following one request from the database to the interface
- Why the server, not the browser, should decide scores and validate submissions
- Using AI coding tools effectively while reviewing, testing, and being able to explain every change

---

**Author:** Pawan Kalyan Chamala · [LinkedIn](https://www.linkedin.com/in/pawan-kalyan-chamala-355248381)
