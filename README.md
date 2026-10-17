# Yorishiro Weekly

Prototype of a yokai vessel-shop sim. Play it at https://ozarka30.github.io/curly-parakeet/

`index.html` is the whole game. It autosaves in your browser; the Ledger tab has a pickle export to move a save, a tuning panel for the numbers, and a New game button if you want the tutorial again.

## Design and tests
- `DESIGN.md` — full design handoff: rules as built, data tables, decisions not yet built (v0.7/v0.8), research, where everything lives.
- `tools/` — `check_tut.js` (rules test, plays the tutorial), `render.js` (Playwright click-through), `postgame.js` (board sampler), `dump.js` (data tables). Run against `index.html`.

## Ninety-Nine (idle fighter)
`ninety-nine/index.html` — v0.3 "the descent": 99 floors of basement, a line of four, tap-to-use abilities whose charge carries between fights, every floor's resident tamed into a unique character. Live at https://ozarka30.github.io/curly-parakeet/ninety-nine/. Spec `ninety-nine/SPEC-v0.3.md`; tests `node ninety-nine/tools/test.js ninety-nine/index.html`; click-through `node ninety-nine/tools/render.js shot.png` (needs playwright); bout card `ninety-nine/fight.html` is the throwaway the fight model came from.
Earlier: `ninety-nine/street.html` is v0.2 (the street economy: kinds, families, houses; specs `SPEC.md`, `SPEC-v0.2.md`, tests `tools/test-street.js`, `tools/render-street.js`).
Art: `ninety-nine/art/` holds the first three character sprites (Pochi, Momo, the rogue teapot; tame and wild halves split from the Gemini sheets in `art/src/` by `tools/split-sheet.py`); other bodies keep SVG placeholders.
