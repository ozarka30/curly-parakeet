# Yorishiro Weekly

Prototype of a yokai vessel-shop sim. Play it at https://ozarka30.github.io/curly-parakeet/

`index.html` is the whole game. It autosaves in your browser; the Ledger tab has a pickle export to move a save, a tuning panel for the numbers, and a New game button if you want the tutorial again.

## Design and tests
- `DESIGN.md` — full design handoff: rules as built, data tables, decisions not yet built (v0.7/v0.8), research, where everything lives.
- `tools/` — `check_tut.js` (rules test, plays the tutorial), `render.js` (Playwright click-through), `postgame.js` (board sampler), `dump.js` (data tables). Run against `index.html`.
