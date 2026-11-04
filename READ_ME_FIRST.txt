K20 Student Programmer - Scoring Repair

This archive contains FIVE source files with project-relative paths:
- app/controllers/questions_controller.ts
- app/validators/quiz_submission.ts
- start/routes.ts
- inertia/pages/quiz.tsx
- inertia/pages/results.tsx

1) In VS Code, open a NEW terminal tab (not the one running npm run dev).
2) cd ~/Documents/GitHub/k20-student-programmer-task
3) git diff > ../k20-work-before-scoring.patch
4) unzip -o ~/Downloads/K20_Scoring_Repair_Nov1.zip -d .
5) npx prettier --write app/controllers/questions_controller.ts app/validators/quiz_submission.ts start/routes.ts inertia/pages/quiz.tsx inertia/pages/results.tsx
6) npm run typecheck && npm run lint

Do not paste TypeScript source into the Terminal.
Do not commit or push until testing passes.
No .env or credentials are included.
