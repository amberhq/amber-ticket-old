---
name: ticket-decisions
description: Record decisions, requirement changes and implementation choices for Amber's ticketing platform (amber-ticket, the Zammad fork, epic AI-1283) in the running log at amberhq/sdlc-docs POD-AI/AI-1283-replace-ticketing/README.md. Use when the user says "log this decision", "record that", "update the ticketing decisions", "add to the decision log", "sync the decision log", "/ticket-decisions", or when a session settles something about the ticketing platform (scope, design, infra, a reversed call) that the team should be able to find later. Appends only: a reversed decision gets a new entry and the old one is marked superseded.
---

# Ticketing platform decision log

One log holds every decision, requirement change and implementation choice for the Amber
ticketing platform:

- **Repo:** `amberhq/sdlc-docs`
- **Folder:** `POD-AI/AI-1283-replace-ticketing/` (epic
  [AI-1283](https://amberhq.atlassian.net/browse/AI-1283), so it files under `POD-AI/`)
- **File:** `README.md` in that folder; `_index.yml` beside it

Child tickets that have their own SDLC folder (for example `POD-AI/AI-1284-ticketing-platform-poc/`)
keep their detailed docs there. The log records their decisions in one line each and links to the
detail; it doesn't copy it.

## What goes in the log

| Section | ID | Log it when | Example |
|---|---|---|---|
| Decisions | `D-nnn` | A choice between options was made, by anyone, for a reason | "No Elasticsearch at launch" |
| Requirement changes | `R-nnn` | What the platform must do changed against the spec, AI-1284 or an earlier ticket: added, dropped, deferred or reworded | "Reports module unavailable at launch" |
| Implementation choices | `I-nnn` | How something is built, where the reader would otherwise ask "why is it done this way?" | "Statuses are Zammad ticket states; per-team lists via Core Workflow" |
| Open items | `O-nnn` | A question or owed piece of work that blocks or shapes a later decision | "Which Gmail scopes for onboarding?" |

Don't log routine work (a bug fix, a dependency bump, a refactor with no visible effect), and don't
log facts about the code that belong in the repo's own docs.

## Rules

1. **Append only.** Never rewrite or delete a past entry. When a decision is reversed or replaced,
   add a new entry, and set the old one's Status to `Superseded by D-0xx`. When an open item is
   answered, set its Status to `Answered → D-0xx` (or `R-`/`I-`) and log the answer as its own entry.
2. **IDs only go up.** Take the next number after the highest one in that section. Never reuse one.
3. **Absolute dates** (`2026-11-02`), the day the decision was made, not the day it was logged. If
   only the month is known, write `2026-10` and say so in the source.
4. **Every entry has a source:** a Jira key, PR, commit, doc path, artifact link, or "conversation
   with <name>, <date>". If the reason wasn't recorded, write `Not recorded`; don't invent one.
5. **No secrets.** Never copy passwords, tokens, keys, local admin logins or credential values.
   Environment variable _names_ are fine.
6. **Plain English, one entry per row.** Each row must make sense to someone who wasn't there.

## Workflow

### 1. Get a clean copy of sdlc-docs

The clone is usually a sibling of the product repo (`../sdlc-docs` from the amber-ticket root,
which is `/Users/durvesh/Documents/Amber/sdlc-docs` on Durvesh's machine). If it isn't there,
ask for the path. Don't use whatever branch that clone has checked out, and don't touch its
uncommitted changes. Work on a fresh branch from `origin/main`, in a worktree:

```bash
cd <sdlc-docs>
git fetch origin main
git worktree add --no-track -b docs/AI-1283-decision-log-<yyyy-mm-dd> .claude/worktrees/AI-1283-log origin/main
```

The log is pushed straight to `main` (step 7), so there is no long-lived log branch or PR to add to.
The branch above is local and is deleted once its commit is on `main`.

### 2. Read the current log

Read `POD-AI/AI-1283-replace-ticketing/README.md` in full. Note the highest ID in each section,
the open items, and the **Sources last checked** line under the changelog.

### 3. Gather candidates

Collect everything decided or changed since the last check, from:

- **This conversation:** what the user decided, chose, rejected, deferred or asked to change.
- **amber-ticket:** commits on the Amber branches (`staging`, feature branches named
  `<ticket>-<three words>` such as `AI-1329-apply-amber-theme` (I-017), older `feature/*`, and
  `docs/*`) since the last check (`git log --since=<date> --format='%h %ad %s' --date=short origin/<branch>`),
  and the planning docs in `amber-docs/ticketing-platform/`.
- **sdlc-docs:** changed files under `POD-AI/` for AI-1283's child tickets (`AI-1284-…` and later).
- **Jira (if the Atlassian tools are connected):** AI-1283 and its child issues, including status
  changes and comments.
- **The user's Claude memory notes** about amber-ticket, if present.

When the user asks to log one specific thing, step 3 is just that thing.

### 4. Sort and check against the log

For each candidate, choose its section, then check it against existing entries:

- **Already logged, nothing new:** drop it.
- **Contradicts an active entry:** a new entry that supersedes the old one.
- **Answers an open item:** a new entry plus the open item's status change.

### 5. Confirm with the user before writing

Show the proposed changes as a short list, grouped by section, with the new IDs and every
`Superseded`/`Answered` change. Ask about anything that's unclear (the date, who decided, whether
it's final or still a proposal). **Write nothing until the user confirms.**

### 6. Write

In `README.md`:

- Add the new rows to the bottom of their section's table.
- Update the Status of superseded entries and answered open items.
- Update the **Status** line and **Summary** at the top if the platform's state changed.
- Add one row to **Changelog**: date, what was added (IDs), and who (`@<github-user> (with Claude Code)`).
- Update the **Sources last checked** line with today's date and the newest commit per amber-ticket
  branch read.

In `_index.yml`, update `status` if it changed, and add any new repos or flags.

In the root `README.md` index, update this folder's row if its status, repos, flags or keywords
changed.

### 7. Commit, then push straight to `main` when asked

```bash
git add POD-AI/AI-1283-replace-ticketing README.md
git commit -m "AI-1283: decision log - <short summary, e.g. add D-021, supersede D-012>"
```

Show the user the commit. When they say yes, push it **directly to `main`**. Don't open a PR. Keep
the history linear (no merge commits):

```bash
git fetch origin main
git rebase origin/main
git push origin HEAD:main
```

If the rebase conflicts in the root `README.md` index (other teams edit it often), keep `main`'s
rows and re-apply only this folder's row changes. If the push is refused, say so; the commit stays
on the local branch.

Once the commit is on `main`, remove the worktree and its branch:
`git worktree remove .claude/worktrees/AI-1283-log && git branch -D docs/AI-1283-decision-log-<yyyy-mm-dd>`.

## Entry formats

Use the column layout the README already has. For reference:

```markdown
| ID | Date | Decision | Why | Rejected options | Decided by | Source | Status |
| ID | Date | Change | Before → After | Asked by | Impact | Source | Status |
| ID | Date | Area | Choice | Why | Where | Status |
| ID | Raised | Question or owed work | Owner | Blocks | Status |
```

Statuses: Decisions and implementation choices are `Active` or `Superseded by …`. Requirement
changes are `Active` or `Superseded by …`. Open items are `Open`, `Answered → …` or `Dropped (reason)`.
