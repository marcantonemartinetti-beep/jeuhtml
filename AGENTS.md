# Agent Rules For This Repository

## Active Architecture
- Runtime code is modular and loaded from split module files referenced by `index.html`.

## Legacy Archive (Do Not Use)
- Never use, edit, or refactor files inside `legacy/monolith-archive/`.
- Files prefixed with `LEGACY_DO_NOT_USE__` are historical snapshots only.
- Do not propose patches based on those archived monolith files.

## Preferred Sources
- Use active modular files (`abilities-*.js`, `entities-*.js`, `ui-*.js`, `game-*.js`) as the source of truth.
