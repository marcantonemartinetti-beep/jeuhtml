# Legacy Monolith Archive

This folder contains deprecated monolithic files kept only for historical reference.

Files with the prefix `LEGACY_DO_NOT_USE__` are not part of the runtime modular architecture and must not be used for edits, debugging, or feature work.

Active runtime architecture is split across module files (for example: `abilities-*.js`, `entities-*.js`, `ui-*.js`, `game-*.js`) loaded by `index.html`.
