# Coding standards

Read at review time. Mechanical rules live in checks, not here: the pre-push
hook (`githooks/pre-push`) and GitHub branch protection both reject pushes to
`main`; `npm run lint`, `npm run build`, `npm test` run in CI.

## Git workflow

- **Read a git failure as a diagnosis, not an obstacle.** When git or GitHub
  reports `No commits between <base> and <head>` or `head branch is the same as
  base`, the changes are already on the base branch. The fix is to report that
  state (what is on `base`, why the PR is empty) and stop. Amending, force-
  pushing, or recreating branches to get a PR accepted hides the real problem.
- **State the root cause from the output before a second attempt** at a failed
  git/gh command. `git log origin/main -1` or `git log main..<branch>` answers
  most of these in one call. Two attempts differing only in cosmetic variation
  mean the diagnosis is missing.
