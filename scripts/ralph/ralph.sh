#!/usr/bin/env bash
# One fresh, sandboxed Codex turn per supervised Ralph invocation.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"
DRY_RUN=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --agent) [[ "${2:-}" == codex ]] || { echo 'Only the verified Codex adapter is configured.' >&2; exit 2; }; shift 2 ;;
    1) shift ;;
    *) echo 'Usage: scripts/ralph/ralph.sh [--dry-run] [--agent codex] [1]' >&2; exit 2 ;;
  esac
done
for tool in node git codex; do command -v "$tool" >/dev/null || { echo "Missing $tool" >&2; exit 1; }; done
[[ -f prd.json && -f progress.txt && -d archive && -f scripts/ralph/AGENTS.md ]] || { echo 'Missing Ralph handoff files' >&2; exit 1; }
node --input-type=module -e 'import fs from "node:fs"; const p=JSON.parse(fs.readFileSync("prd.json","utf8")); if(!p.branchName || !p.userStories?.length) process.exit(1); console.log(`Branch: ${p.branchName}`); const next=p.userStories.find(s=>!s.passes); console.log(next ? `Next: ${next.id} ${next.title}` : "All stories verified");'
BRANCH="$(node -p 'JSON.parse(require("fs").readFileSync("prd.json","utf8")).branchName')"
[[ "$(git branch --show-current)" == "$BRANCH" ]] || { echo 'Wrong branch' >&2; exit 1; }
if [[ "$DRY_RUN" -eq 1 ]]; then echo 'Dry run OK (one iteration; workspace-write; approval review; no unsafe flags)'; exit 0; fi
[[ -z "$(git status --porcelain)" ]] || { echo 'Worktree must be clean before an iteration' >&2; exit 1; }
export RALPH_AGENT=codex RALPH_REPO_ROOT="$REPO_ROOT" RALPH_PROMPT_FILE="$REPO_ROOT/scripts/ralph/AGENTS.md" RALPH_ITERATION=1 RALPH_MAX_ITERATIONS=1 RALPH_UNSAFE=0
# --approve-for-me already selects workspace-write; this CLI rejects combining it with --sandbox.
codex exec --approve-for-me - < scripts/ralph/AGENTS.md
echo 'Iteration ended. Supervisor must validate, commit, push, and verify production before another iteration.'
