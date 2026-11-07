# Ralph iteration instructions

Read root AGENTS.md, tasks/prd-site-audit-fixes.md, prd.json, and progress.txt before editing.

Implement exactly the lowest-priority-number story with passes=false, unless its notes say it is awaiting supervisor release verification. In that case report that state without implementing a later story.

Do not spawn additional agents or workers within an iteration. The supervisor independently reviews the completed diff. Avoid repeating checks that are known to fail at the same esbuild filesystem boundary; report unexecuted checks accurately so the supervisor can run them. The supervisor owns before/after Lighthouse measurements and browser/production validation.

The approved production site is https://www.fengchenchen.top on Vercel; older root documentation is stale until US-002 updates it. Preserve all accepted UI/content decisions and both locales. Do not implement deferred project links or opportunistic later stories.

Run npm run build, npm run check:content, git diff --check and the current story's focused validations. From US-006 onward run npm run test:e2e too. Use a temporary npm cache when Windows cache access is denied. Never disable sandbox or approvals, use --unsafe, copy credentials, edit unrelated files, or modify origin/main directly.

This run is supervised. Implement and locally validate one story, append evidence and gotchas to progress.txt, and set the story notes to "Implementation ready; awaiting supervisor browser/release verification" only after local validation passes. Leave passes=false. Do not commit, push, create a second worktree, or start the next story: the supervising agent reviews the diff, performs browser validation and the authorized commit/push, verifies production and then records passes=true. If a required command is blocked by permissions, report its exact command and leave local validation incomplete for the supervisor; do not claim it passed.

Finish with a concise report of changed files, checks, and remaining verification. Emit the completion promise only if every story has passes=true, never for a single implementation.
