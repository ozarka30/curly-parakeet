# Ninety-Nine — idle game spec, v0.1 (rev 2, after review)

*Companion to Yorishiro Weekly (the sim). Same world, same look, different verb: the sim sells tamed tsukumogami, this game rents them out. Phone-first, one scrolling page, check in a few times a day. One HTML file, no build step, GitHub Pages. Rev 2 folds in three independent reviews (economy, first-player UX, systems); the changes are marked ★.*

## 0. The pitch

You inherit your grandmother's shop. The basement holds 99 items turning 99 years old. Hōzuki, her lantern, is already awake and sits with the items so they wake tame instead of wild. The town throws out the old for the new and has problems only a tamed tsukumogami can fix, so you rent yours out and send the rest down the roads. The more you have out and about, the more they bring in and the stronger they come home. The street is black and white; every window where one of yours is working glows in color.

## 1. Slim rules

- **Five affinities:** Ember, Frost, Bloom, Clay, Tide. No stats.
- **Grades:** a value 0–59 per affinity; E 0–9, D 10–19, C 20–29, B 30–39, A 40–49, S 50–59.
- **A creature** = a spirit in a body. Spirit: name, yokai type, five affinity values, wildness (0 = tame), cycles served per house. Body: species (sets the native affinity), tier (sets caps).
- **Species (12):**

| id | name | yokai | affinity | tier | at home it… |
|---|---|---|---|---|---|
| candle | Candle | Rōsoku-bi | Ember | 1 | makes light |
| lantern | Lantern | Chōchin-obake | Ember | 2 | makes light ×2 |
| chime | Wind chime | Fūrin-kozō | Frost | 1 | tames |
| bell | Bell | Suzu-furunushi | Frost | 2 | tames |
| whisk | Whisk | Sasara-bake | Bloom | 1 | tames |
| broom | Broom | Hōki-gami | Bloom | 2 | tames |
| kokeshi | Kokeshi | Kokeshi-gami | Bloom | 1 | tames ×2 |
| doll | Doll | Ichimatsu-onna | Bloom | 2 | tames ×2 |
| teapot | Teapot | Kyūsu-bōzu | Clay | 1 | tames |
| claypot | Clay pot | Bunbuku-gama | Clay | 2 | tames |
| ladle | Ladle | Hishaku-bake | Tide | 1 | tames |
| bucket | Bucket | Tsurube-otoshi | Tide | 2 | tames |

- **Body caps:** tier 1: native 29 (C), other affinities 19 (D). Tier 2: native 39 (B), others 29 (C). (Tier 3, 49/39, arrives with the second century.)
- **A new spirit** wakes with its native affinity at 10 (D) and the rest at 0.
- **Growth** only happens out of the house, always capped by the body: rentals grow the house's affinity **+1 per hour** ★ (was +1/10 min; everything capped in three hours and fit was never a decision); roads grow the road's affinity +3/+6/+10/+15 by depth. Roads are the fast way to grow, rentals the way to earn.
- **Tame / wild:** a wild creature cannot be sent anywhere. Taming happens at home (see 4).
- **Fit:** a house or road asks for one affinity at one grade. Meets = allowed. Each band over the ask pays more. Under the ask: houses refuse; roads allow **one band under** with a body break, and refuse two or more ★ (any-depth breaking was a free body-for-gold machine: a D ladle at depth 4 returned 1,200 g and a guaranteed tier-2 body).

## 2. Resources

- **Light.** Accrues 1/min, plus 1/min per band of each candle at home (D=1, C=2…; lantern double). Tapping the lantern adds 1. **Ceiling = next sit cost + 20, +10 per light-maker at home** ★ (a flat 30 made item 22 unwakeable). Nothing accrues past it; tapping at the ceiling says so once.
- **Gold.** Rentals pay per second ★ (a counter stuck at 0 for the first minute reads as broken); roads pay on return. Spent on slots, bodies, food, the stray, the offline cap.
- **Reputation.** From completed rental cycles. Unlocks houses and market tiers. Never spent.
- **Bodies.** From the basement, roads, the market. An empty body houses an unhoused spirit, or **sells for half its market price** ★.
- **Unhoused spirits** (the box). Spirits whose body broke. Keep values, wildness, history.

## 3. The basement

- 99 items in a seeded order: species weighted common 6 / uncommon 3 / rare 1 (tier-2 species are the rares). Items 1–3 are candle, kokeshi, ladle. The next item is always visible: species, tier, "wakes wild in 2h 40m".
- **Sit with it:** costs 10 + n light for the n-th item. A sitting timer (45 s for item 1, 2 min after ★), then it wakes tame with a reveal card and the next item surfaces. Sitting clears the current fuse even if it would have expired during the timer.
- **Fuse:** a surfaced item wakes **wild** on its own 3 h after surfacing. Wild wakes are free; the creature needs taming. **The fuse pauses while two or more wild creatures are at home** (from any source) and resumes when one is tamed ★ (the "max 2 pending" rule, made exact).
- v0.1 has no auto-sit; every wake is a tap. (v0.2: "a second lantern" upgrade that sits on its own.)

## 4. Home

Creatures at home earn nothing and do one thing by species, automatically:
- **Make light:** candle and lantern only ★ (they do not tame).
- **Tame:** everyone else, while a wild creature is home. Each tamer takes 1 wildness/min off the wildest (ties: oldest), +0.5/min per band of its best grade above D; kokeshi and doll ×2. Wildness starts at 60. At 0: "Tamed. +2 rep."
- **Wait:** otherwise. Hōzuki nags about waiting creatures **only when a slot is free** ★.

Out earns; home tames and lights. An empty shop earns the most and tames nothing.

## 5. The street (rentals)

Eight houses, unlocked by reputation. A rental pays per second, auto-renews until recalled, grows the house's affinity +1/h to cap.

| # | house | problem | asks | tier | base rate | unlock rep ★ |
|---|---|---|---|---|---|---|
| 1 | Kōda's bakery | the oven goes cold by dawn | Ember D | 1 | 1 g/min | 0 |
| 2 | Mrs. Tokiwa, upstairs | company for the long nights | Bloom D | 1 | 1 g/min | 0 |
| 3 | Umeda's fish stall | the catch spoils by noon | Frost D | 1 | 1.2 g/min | 10 |
| 4 | Tsuru-no-yu bathhouse | the big bath goes lukewarm | Ember C | 2 | 3 g/min | 60 |
| 5 | Hana's delivery cart | the round crosses the river | Tide C | 2 | 3 g/min | 60 |
| 6 | The schoolhouse | forty children in line | **Bloom C** ★ | 2 | 3.5 g/min | 60 |
| 7 | The inn by the bridge | every room, every season | **Clay C** ★ | 3 | 9 g/min | 200 |
| 8 | The shrine on the hill | the lamps must not go out | Ember B | 3 | 10 g/min | 500 |

★ Rep thresholds were 5/15/40/100: two tier-1 rentals make 4 rep/h, so every house opened by the second morning and rep did nothing after. Schoolhouse moved to Bloom because a third of all wakes are Bloom species and they had one 1 g/min job; the inn moved to Clay C so Clay creatures have a payoff before the endgame.

- **Fit multiplier:** meets ×1.0; one band over ×1.5 ("a tip"); two or more ×2.0.
- **Cycle:** 30 min. Each completed cycle: rep +1/+2/+3 by house tier, doubled at two bands over. Fit is evaluated per minute as the creature grows; the rep doubling uses fit at cycle end.
- **Recall** any time: pay is already banked; the partial cycle gives no rep. Recall asks once ("Lose the half-cycle?") ★.
- Asks are fixed; progress is unlocking houses.

## 6. The roads

Three destinations, four depths. Pick a depth, send, wait, collect. Roads do not repeat on their own.

| road | affinity | depth 1 | depth 2 | depth 3 | depth 4 |
|---|---|---|---|---|---|
| Riverbank Shallows | Tide | 15 min · D | 1 h · C | 4 h · B | 12 h · A |
| Old Kiln Hill | Clay | same | same | same | same |
| Mountain Pass | Frost | same | same | same | same |

- **Loot:** gold 20 / 80 / 300 / 1,200, **× (1 + rep/100), capped ×10** ★ (so the manual lane keeps up with houses that pay 3–10 g/min); a body 20% / 40% / 70% / 100% (tier 1 at depths 1–2, tier 2 at 3–4); a **wild creature** comes home 0% / 10% / 25% / 50% (housed in a body of its own species, wildness 60; the supply after the basement).
- **Growth:** +3 / +6 / +10 / +15 in the road's affinity, to cap.
- **Risk:** one band under the ask is allowed and the body breaks on return: loot kept, growth applied, spirit to the box, body gone, slot freed. Shown before sending: "Too deep for a D. The ladle will break; Taro comes home unhoused and you keep the loot." Two or more bands under: greyed, "far too deep". Loot and the break are rolled and stored at send (no re-rolling by reloading).
- Every depth row shows its odds: `80 g · body 40% · wild spirit 10% · +6 Tide` ★ (otherwise where spirits come from is undiscoverable).

## 7. Slots, market, food, bodies, offline cap

- **Slots** = creatures out at once. Start 2. Slot 3–8 cost **60 / 300 / 1,500 / 7,500 / 37,500 / 150,000** ★ (the old curve was bought out by the first night's income). The masthead shows `Out 2/2 · +1 for 60 g`, tappable; a blocked Send reads `Slots full`.
- **Market** refreshes at local midnight (and on first open): 2 bodies (**tier 1 100–200 g; tier 2 800–1,600 g once rep ≥ 200** ★), 3 foods, and **one stray** ★: a tame creature, species random, priced 300 + 5×rep. The stray is the only sink that scales with the game and the standing reason to open the app on day 3.
- **Food:** one per affinity, 12 g: +6 to that affinity, halved per band the creature already is above C. Preview shows the result: `+6 Ember → 22 (C)` ★. Only at home.
- **Rehouse:** unhoused spirit + empty body → creature (values clamped to the new caps; wildness carries). A housed spirit may move to a better body at home; the old body goes to the shelf. Preview shows the new caps ★. Only at home.
- **Offline cap:** rentals, light, taming and growth run for at most **4 h** of an absence; **8 h for 1,000 g, 12 h for 5,000 g** ★ (a check-in lever and a sink). Roads, sitting timers and fuses run to real time regardless.

## 8. Offline and time (★ rules made exact)

`advance(S, now)` is the only thing that moves time; it runs every second while open and once on load/visibility. Window W = [tick, min(now, tick + cap)].
1. If now < tick (clock went back): shift every stored timestamp by the difference; nothing is paid.
2. Sweep events up to the window's end, earliest first: road returns, sitting completions, fuse wakes (fuse time excludes paused stretches). After each, re-check the fuse pause.
3. Step whole minutes through W with the roster as it stood each minute: rentals pay and tick cycles (rep at :30), growth at the hour; light accrues and clamps; tamers work on the wildest; band crossings log.
4. Sweep events from the window's end to now (returns come home and earn nothing; fuses give at most two wild wakes, then pause).
5. Market: if the local date changed, restock.
6. Return the events for the "While you were out" card when the gap exceeded 5 minutes.

Per-minute stepping is at most 720 × roster operations; nothing is closed-form because every rate depends on who is home that minute. Device clock jumps forward are bounded by the cap. Two tabs: the save carries an owner id; a foreign write stops this tab with "Open in another tab". Save version with a migrate chain.

## 9. Save

`localStorage` key `nn-save`, autosave on every change and every 10 s; export/import as text.

```json
{"v":1,"savedAt":0,"tick":0,"rng":123456,"owner":"tab-id",
 "gold":0,"light":10,"rep":0,"slots":2,"cap":4,
 "basement":{"order":["candle","kokeshi","ladle","…96 more"],"next":0,"fuseAt":0,"fuseMs":0,"sitAt":null},
 "spirits":{"s1":{"name":"Pochi","yokai":"Rōsoku-bi","v":{"Ember":10,"Frost":0,"Bloom":0,"Clay":0,"Tide":0},
   "wild":0,"cycles":{"1":3},"body":"b1","loc":{"k":"home"}}},
 "bodies":{"b1":{"sp":"candle"},"b2":{"sp":"chime"}},
 "market":{"day":"2026-10-16","stock":[{"kind":"body","sp":"chime","price":140,"sold":false}]},
 "log":[]}
```
`loc`: `{"k":"home"}` · `{"k":"house","h":1,"at":0,"min":0}` · `{"k":"road","r":"river","d":2,"at":0,"done":0,"loot":{"gold":80,"body":"chime","wild":null,"breaks":false}}`. Derived, never stored: creature = spirit with a body; box = spirits with `body:null`; shelf = unreferenced bodies; out-count; wild-at-home; light ceiling.

## 10. The page (phone, top to bottom)

1. **Sticky masthead:** NINETY-NINE · gold (ticking) · light (the lantern is the tap target, ≥44 px) · `rep 12 → fish stall at 10` · `Out 2/2 · +1 for 60 g` · basement count.
2. **The shop:** Hōzuki with a line; the next item with its fuse and **Sit with it (11 light · 2 min)**; the home roster as a wrapping grid of chips. Each chip: portrait, name, five lettered pips with the native highlighted (`Em D13 · Fr – · Bl – · Cl – · Ti –`), the role tag (Making light · Taming the teapot · Waiting), one primary button (Send, or House in… for the unhoused), and tap-to-expand for Feed, Rehouse, Sell body, caps (`29/29 · the candle's limit`).
3. **The box** (unhoused spirits) sits under the home grid, not at the bottom ★.
4. **The street:** open houses as cards (problem, ask, rate, Send… listing eligible creatures with `Fits · 1 g/min` or `×1.5 · a tip`; or the occupant glowing, `earning 1.5 g/min · cycle ends in 12 min · +1 rep`, Recall). **Locked houses collapse to one row**: `5 more · next at rep 10` ★.
5. **The roads:** three cards, depth rows with odds and duration, eligible creatures with the break warning, Send; or the timer and Collect on return.
6. **The market:** today's bodies, foods, the stray; `tier-2 bodies at rep 200`.
7. **Ledger:** log (last 100), totals, export/import.
8. **Sticky bottom bar** of pending actions, one line, tap scrolls there: `Taro's back · Collect` · `Light full · Sit` · `Teapot wild · recall someone` ★ (Collect was otherwise 1,100 px down behind grey houses).

Signals carry two channels: affinity glow + glyph + text; wild = `WILD` badge + jagged border + shake (off under reduced-motion); every grey state has a text reason (locked, unaffordable, empty body, slots full). Timers aria-live polite; wild wakes assertive.

**While you were out** (gap > 5 min): wild or broken first, in color, with the action inline; roads back with Collect; gold, rep, houses unlocked; light full; next fuse; elapsed time and the cap when it bit ("Gone 14 h; the street pays for 4"). Never leads with gold, never buries a wild wake, never stacks on quick reopens. On close: scroll to the first pending action with Hōzuki naming it; otherwise the basement card.

**Hōzuki's script** (trigger → line):
1. First open → "You're late. Ninety-nine downstairs, and the first wakes in three hours. Sit with it so it wakes tame; that costs light, and I've enough for one."
2. First Sit → "Forty-five seconds. Tap me while you wait: every tap is light, and the next one costs more." (The candle colors in over the timer.)
3. First reveal closed → "Pochi. Ember, grade D: warm, barely. Kōda's oven wants exactly that. Send her; she earns by the minute and learns while she works."
4. Shop empty, out = slots → "Both slots full, nobody home. If the next one wakes before someone sits with it, it wakes wild, and wild ones can't work."
5. Send blocked by slots → "Taro waits. A third slot is 60 gold; the street earns that in half an hour. Go on, I'll keep the lamp."
6. First return, card closed → "They each finished a cycle while you were gone. That's reputation, and reputation opens doors."
7. First wild wake → "The teapot woke wild; see it shake. It can't work until someone tame sits with it at home. Recall one; the doll's quickest."
8. First band crossed → "Pochi's learned something. Ember C now; Kōda will tip."
9. First body break → "Taro's home without the ladle. Keep the loot; find him a body."
10. First stray → "Someone's selling a tame one. Dearer every day you're known."

## 11. The game as a player lives it (rev 2 numbers)

**Minute 0.** Black-and-white street. Hōzuki's line 1. Light 10. Basement card: *Candle · wakes wild in 2h 59m · Sit with it (10 light · 45 s)*. The only live button. Tap; the candle colors in over 45 seconds while Hōzuki invites taps.

**Minute 1.** Reveal: *Pochi, a Rōsoku-bi. Ember D.* The bakery card is live: *Ember D · Fits · 1 g/min · Send Pochi*. Send; the window glows; gold ticks per second. `Out 1/2`.

**Minutes 1–5.** Next item: kokeshi, 11 light, light at 2. Tap nine times, sit, 2 minutes. *Momo, Kokeshi-gami, Bloom D* → Mrs. Tokiwa. `Out 2/2`, shop empty, line 4.

**Minute 8, decision 1.** Third item: a ladle, 12 light, light at 3; the Riverbank wants Tide D for 15 min and 20 g, but slots are full and `+1 for 60 g` sits in the masthead with gold at 14. Line 5. The player closes the app with a goal (60 g ≈ 30 min). **Session 1: 8 minutes.**

**Return at ~40 min.** Card: 64 g; two cycles finished (+2 rep). Buy slot 3. Light refilled to its ceiling (32) while away; sit with the ladle, no tapping. *Taro, Hishaku-bake, Tide D* → Riverbank depth 1. Rep 2 → `fish stall at 10`.

**Return at ~2 h.** Taro is back: 20 g, +3 Tide (D13), and the 20% roll gave a chime body: empty, on the shelf. Item 4 surfaced two hours ago, *wakes wild in 58m*; it's a whisk, sit with it. Hōzuki: "A body with nobody in it is just a chime." Where do spirits come from? The depth-2 row says `wild spirit 10%` and asks Tide C; Taro is D13: red warning, "the ladle will break". Decision 2: the player either waits for the basement to hand them a Frost species for the fish stall (rep 10 is an hour away), sells the chime for 70 g, or spends the ladle for 80 g + a 40% body. Rentals, meanwhile, have grown Pochi to Ember 12.

**Evening of day 1.** Four or five creatures, rep ~14, fish stall open, slot 4 bought (300 g). Probably one wild wake happened (gone four hours; teapot shaking in the shop; line 7; Momo recalled from Tokiwa tames it in 30 minutes, "the doll's good at this"). The 4 h offline cap bit overnight and the card said so; `8 h for 1,000 g` is now a visible goal next to slot 5 (1,500 g). Pochi is Ember 18 after a day: one food (12 g, +6 → 24, C) away from the bathhouse when rep reaches 60 tomorrow. The candle's cap of 29 is printed on the chip, so the player already knows the bathhouse at ×1.0 is Pochi's ceiling until a lantern body turns up.

**Day 2.** Rep 60 by lunch: bathhouse, cart, schoolhouse open. First deliberate break (ladle to depth 2 for 80 g × (1 + rep/100) and the 40% body). Taro in the box; the chime on the shelf caps Tide at 19, so Taro keeps 16 but a Frost spirit would be worth more in that body (the fish stall wants Frost D). Decision 3: bodies shape futures. The first stray appears at the market: 300 + 5×60 = 600 g for a tame creature today, 1,300 g when rep is 200; buy now or save for slot 5.

**Day 3–4.** Six slots, rep approaching 200, the inn opens (Clay C, 9 g/min) and a teapot that has been on Kiln Hill all week is the best earner in the shop. Two candles kept home have doubled light, so each check-in wakes two items. The pressure is now **who stays home** (a doll to tame, candles for light) versus **who earns**, and roads are the only way to grow anyone past what their house teaches. Basement ~55.

**Day 7–10 (casual) / day 4–5 (active).** Basement empty. Hōzuki: "That's all of them. Ninety-nine years is a long time to be in the dark." v0.1 continues on road and market supply; v0.2 turns the century: creatures with **≥48 cycles** (a full day) at a house become its household god (×1.1 per god on that house, permanent), everything else resets, 99 tier-up items, and Hōzuki remembers.

Pacing targets (from the review's minute-level model, rev 2 numbers): slots 3–4 on the first morning, slot 5 on day 1–2, slot 6 day 3; rep 10 inside session 2, 60 on day 1–2, 200 on day 3, 500 on day 5+; income ~2 g/min day 1, ~10 day 3, ~25 day 5. Tuning levers, in order: light rate, fuse length, slot curve, rep thresholds.

## 12. Engine (node-testable, no DOM)

Same pattern as the sim: `<script id="engine">` exporting via `module.exports`; functions take `S` and `now`.
- `newGame(seed, now) → S` · `advance(S, now) → events[]` (the only function that moves time)
- `gradeOf(v)`, `bands(v)`, `caps(species)`, `fit(S, sid, aff, ask) → 0 | 1 | 1.5 | 2`
- `lightCeiling(S)`, `lightRate(S)`, `tameRate(S, sid)`, `wildAtHome(S)`, `tap(S) → bool`
- `sitCost(S)`, `sit(S, now)`
- `canSend(S, sid, dest) → null | reason`, `send(S, now, sid, dest)`, `recall(S, now, sid)`, `roadPreview(S, sid, road, depth)`
- `buySlot(S)`, `buyStock(S, i)`, `buyCap(S)`, `sellBody(S, bid)`, `feed(S, sid, aff)`, `rehouse(S, sid, bid)`
- `exportState(S)`, `importState(txt, now)` (validate → migrate → advance), `rand(S)` (mulberry32, advances `S.rng`)

## 13. Tests (the acceptance checks, concrete)

| # | setup | action | expect |
|---|---|---|---|
| 1 | newGame | — | light 10, sitCost 10, no spirits; every action but sit/tap refuses with a reason |
| 2 | candle + kokeshi out, nobody home, item surfaced at T | advance(T+4h); advance(T+5h); recall kokeshi; advance(+1m); advance(+30m) | one wild at 60 and the next item surfaced; still 60; 58; 0 and rep +2 |
| 3a | two tier-1 rentals at exact fit, values capped | advance(+4h); advance(+20h) | gold +480, rep +16; same (cap 4 h) |
| 3b | candle Ember 10 at the bakery | advance(+4h) | gold +240, Ember 14, rep +8 |
| 4 | ladle Tide 13 | roadPreview(river, 2).breaks; send; advance(+1h) | true; gold +80×(1+rep/100), spirit boxed at Tide 19, body gone, slot freed |
| 4b | ladle Tide 13 | canSend(river, 3) | refused: "far too deep" |
| 5 | boxed spirit Tide 25 / Frost 0, chime on the shelf | rehouse | Tide 19, Frost 0; rehouse/feed while rented refused |
| 6 | light at ceiling, no light-maker | tap; advance(+1h); candle comes home; send it out | false, unchanged; unchanged; ceiling +10; clamps back next tick |
| 7 | tick T, a rental, a road due T+15m | advance(T−1h); advance(T−59m) | gold unchanged, timestamps shifted, due T−45m; then one minute's pay |
| 8 | road depth 1 sent at T | advance(T+5m); export; import at T+8m | 7 min remaining, loot identical, gold unchanged |
| 9 | item surfaced T | sit at T+3h−30s; advance(T+3h+2m) | tame wake, no wild; next item's fuse starts at the wake |
| 10 | surfaced T, nobody home | advance(T+20h); tame one; advance(+3h) | exactly two wild (T+3h, T+6h), fuse paused; third wakes 3 h after the taming |
| 11 | bakery rental | advance(+25m); recall; send; advance(+5m); advance(+25m) | gold +25 then +5, rep 0; then rep +1 |
| 12 | market day set | advance(local 23:59); advance(local 00:00) | no refresh; refresh, new stray, sold flags cleared |
| 13 | wild 60 home; only tamer on a road due +3h | advance(+20h) | tamed at +4h, not +1h (tamer worked only after returning, inside the cap) |
| 14 | rep 0 → 10 | buy slots 3 and 4 in order | 60 then 300; `Out n/4` |

## 14. Open questions left after review
- Light rate 1/min makes the basement a 7–10 day campaign for a casual player. Fine for v0.1; the second century needs a faster light curve (household gods could raise it).
- Bloom and Ember have no road; Ember has three houses. Lopsided on purpose: Ember earns, Tide/Clay/Frost travel, Bloom tames and keeps company. Revisit after play.
- Is the 4 h base offline cap too mean for a two-check-ins-a-day player? The counter-argument is that it is the first upgrade they'll want. Watch the friend's reaction.
- No tutorial beyond Hōzuki's ten lines and the one-live-button opening. If testers stall at minute 8 anyway, add a sticky "Next: …" hint.
