# Yorishiro Weekly — design handoff

*State of the project as of 2026-10-16. Written so the game can be picked up cold: what exists, what was decided but not built, what was researched, and where everything lives. Parked to start an idle game on the same theme.*

---

## 1. Where everything lives

| Thing | Where |
|---|---|
| Playable build (v0.6.1 "yokai types") | https://ozarka30.github.io/curly-parakeet/ (GitHub Pages, phone-friendly) |
| Same build as a Claude artifact | https://claude.ai/artifact/5q8nHv9T4FeByPGRQfY86m (version 13) |
| Source | this repo, `index.html` — one file: `<script id="engine">` (pure rules, no DOM, `module.exports` for node) + a UI script. `index.html` is the game wrapped in doctype/head (charset, viewport, theme-color). |
| Design Bible (rules of record through v0.6.1) | Claude Doc https://claude.ai/code/artifact/b49646ce-ce67-40ab-98fb-9577955692da — Premise, Settled rules, Affinities & cycle, Stats, Mold roster, Training machines, Cast, Request templates, Open items. **This handoff supersedes its Premise and adds everything decided after it.** |
| Tests | `tools/check_tut.js` (plays the whole tutorial + wear-in, unlocks, decline, scouting, rename, yokai names; prints "tutorial check: all good"), `tools/render.js` (Playwright click-through at 390px, screenshots, reports page errors), `tools/postgame.js` (post-tutorial board sampler), `tools/dump.js` (prints every data table). |
| Deploy | push to `main` → `.github/workflows/pages.yml` publishes. Pages source must stay "GitHub Actions". Re-run via workflow_dispatch if needed. |

Run tests: `node tools/check_tut.js index.html` · `node tools/postgame.js index.html` · `node tools/render.js index.html shot.png` (needs `npm i playwright`; Chromium path is set inside the script).

Save game lives in `localStorage` key `yw-save`; the Ledger tab exports/imports a "pickle" JSON `{CONFIG,G}`. Pickles from before v0.4 are refused (`inv.mold` / `cust` required).

---

## 2. The game in one paragraph

A retro black-and-white magazine, *Yorishiro Weekly*, is the interface to a shop that prepares bodies for yokai. You take customers' commissions (grade floors on stats and affinities, a size, a temperament, a trait), build a **vessel** from an antique **mold** plus **materials** and **mix-ins**, let a spirit possess it (only possessed things are in color), raise what is still short with **food** (permanent toxicity), **training machines** (themselves possessed vessels, which teach up to their own grade and wear in with use) and **expeditions** (trial ladders with scouted next steps), then deliver, cheap for margin or over-built for a bonus. Customers keep the creatures and come back when they outgrow them.

## 3. Premise (settled 2026-10-16, not yet in the build's copy)

- You inherit your grandmother's shop. **The basement holds 99 items, each turning 99 years old one week at a time.** Working through them is the campaign; the masthead counts them down.
- Tsukumogami have become common and wild because the town throws out the old for the new. Discards are everywhere: the antique cart, the dealer's old machines, the riverbank, the kiln ruins.
- A **tamed** tsukumogami beats modern technology because it is sentient and keeps learning. That is why customers pay, why they come back when it outgrows them, and why your own shop runs on them.
- The shop's job: find items about to turn, prepare them, and see that they wake **helpful instead of wild or vengeful.** An item worked and sat with in the light wakes gently; one left in the dark wakes wild.
- **Hōzuki** (鬼灯, "demon lamp"), grandmother's shop lantern, a Chōchin-obake, is the companion: already awake when you arrive, writes the Beginner's column, speaks on events, lights the basement, and is the one who wakes the others.
- Spirit model (decision "A"): items wake with their own spirit. The spirit box holds *unhoused* spirits (bodies that broke, mostly on expeditions); the shrine sells ones it caught. Housing an unhoused spirit in a prepared vessel is the instant, known-temperament road; letting Hōzuki wake it is the free, slower, unknown one.

---

## 4. Rules as built (v0.6.1)

### Stats, affinities, grades
- Stats: Brawn, Grit, Heart, Pace, Wits, Knack. Affinities: Ember, Frost, Bloom, Clay, Tide.
- Grades are 10-point bands: E 0–9, D 10–19, C 20–29, B 30–39, A 40–49, S 50+ (`gradeOf`, `bandBot`, `bandTop`).
- Gogyō cycle. FEEDS: Bloom→Ember→Clay→Frost→Tide→Bloom. QUELLS: Ember→Frost→Bloom→Clay→Tide→Ember. In a vessel, a feeding pair raises the fed affinity's cap one band and lowers the feeder's; a quelling pair lowers both caps a band unless the **ash** mix-in mutes it.

### Vessels
- **Mold = species.** Molds are consumable antiques (found on expeditions, bought from the cart/dealer). Tier 1 small, one material slot; tier 2 medium, two slots. Machines are "large".
- Tier table: t1 lean-stat floor 10 / cap 39, other stats floor 0 / cap 29, native affinity floor 10 / cap 29. t2: lean 20/49, other 10/39, native 20/39.
- The mold's native affinity acts like a built-in material. Each material sets a floor at the bottom of its grade band and a cap at the top of the next band (D material → floor 10, cap 29). Mix-ins: **ash** (mute quells, 40g), **lacing** (+1 slot, 35g), **gold** (+1 band native cap).
- A spirit possessing a vessel is raised to the vessel's floors and read through its caps (`effVal = min(value, cap)`); value above cap shows as "straining".
- Salvage an empty vessel: one material back at random. Transfer a spirit out: keeps 70% exp.

### Spirits
- Temper −15..15: ≤−5 Docile, ≥5 Fierce, else Steady. Mood −15..15: ≤−5 Quiet, ≥5 Lively, else Even. Requests constrain the band.
- Toxicity is lifetime, per spirit, cap 100. Food adds toxicity and a stat/affinity gain that halves for each band the target already sits above the food's grade; side effects push temper/mood or another stat.
- Each mold has a **gift** (hidden-desire bonus) and a **vice** with trigger situations (complaint).

### Shops (Specials tab)
- Materials: one on special (−40%), one limited (1 left), one sold out, per issue. Foods at the grocer; honey unlocks via Mrs. Tokiwa; sake is found only.
- Antique cart: 3 molds drawn by rarity (common w6 20g, uncommon w3 35g, rare w1 80g) plus anything a customer unlocked (`G.unl.cart`).
- Machine dealer every other issue: 2 machines at 45g (tier-2 at 110g once the tier-1 is worn in), plus unlocked ones (`G.unl.dealer`).
- Shrine: 3 null spirits per issue at 25g, temperament shown.

### Workshop
- A machine is a mold with `station:[affinity, stat]`; built → installed. It works only when possessed and teaches **up to its own spirit's grade** (teacher ceiling), 4 points per session, one session per machine per issue (`used`).
- Wear-in: each session gives the machine's own spirit +2 in the taught stat up to its cap; at cap it is "worn in" and the dealer starts carrying its tier-2 `next`. Washtub sessions also mood −2, planter sessions temper −2.
- A machine cannot train itself. Machines are vessels: they can be fed, transferred, salvaged and **sold** to a request they fit.

### Expeditions (Travel)
- One at a time. Location = ladder of trials `[stat, threshold, reward]`; one trial per issue. Pass: reward + stat gain (up to 4, capped by location level and vessel cap), then **press on** or **return** with the haul. Fail: the body breaks, the spirit comes home to the box with half the haul.
- Scouting: you can always see the next trial from where you stand (`scouted(loc, i)`); first-time climbs are "rumors".
- Kiln Hill unlocks via Umeda's first commission.

### Requests (Front Page / Order Form)
- Six customers, each with a **ladder** of commissions; one rung on the board per customer; entering the cast requires N total deliveries; cooldown 4 issues between a customer's rungs. Board max 4, 1 new per issue.
- Each request: constraints (aff/stat grade, size, temper, mood, tag), pay (the budget), deadline (ticks only while unaccepted; accepting freezes it), hidden desire → bonus (+2 rep + item), situation → vice complaint (−1 rep), optional unlock (cart item, dealer item, location, food). Decline is free (rung returns after cooldown). Missed deadline −2 rep.
- Follow-ups: sold spirits gain 5 exp per issue; past 40 (t1) / 100 (t2) the customer brings it back wanting a bigger body.
- Order Form "Designing for": pick a request and the coupon shows MET/SHORT badges live, the receipt shows cost vs budget and margin, ★ marks materials the card wants.

### Tutorial
13 steps in the Beginner's column (0–12), each unlocking tabs: Specials → Order → Roster → Workshop → Travel → Ledger. Fixed issue-1 stock so it always holds (charcoal on special, teapot 35g, treadle on the dealer). `tut:-1` = skipped.

### UI
Tabs: Front Page, Order Form, Specials, Workshop, Roster, Travel, Ledger. Fonts Rye / Oswald / Libre Baskerville. Grade letters everywhere, numbers on hover. Reveal overlay on possession; SVG portraits with glow by affinity, mouths by temperament, idle bob (reduced-motion safe); epithets; speech lines; rename; yokai type names from `YOKAI`.

### Tuning knobs (`CONFIG`)
`{gold:200, toxCap:100, sessionPts:4, expPerIssue:5, outgrow1:40, outgrow2:100, transferKeep:0.7, maxActive:4, newPerIssue:1, trialGain:4, spiritPrice:25, cooldown:4, sessionsFastPace:30, dealerEvery:2, marketSize:3, machineGain:2}` — editable in the Ledger tab.

---

## 5. Data tables (dumped from the engine)

### Molds
id | name | yokai — gloss | tier | rarity | native | lean | tags | gift | vice (triggers)
- candle | Candle | Rōsoku-bi — candle-flame | t1 | common | Ember | Grit+Wits | glows,warms,guides | guides | gutters in a draft (drafty,steamy)
- lantern | Lantern | Chōchin-obake — lantern ghost | t2 | rare | Ember | Grit+Wits | glows,warms,guides | guides | gutters in a draft (drafty,steamy)
- chime | Wind chime | Fūrin-kozō — chime boy | t1 | uncommon | Frost | Wits+Heart | rings,wards,cools | warns | cannot keep quiet (quiet)
- bell | Bell | Suzu-furunushi — old master of the bell | t2 | rare | Frost | Wits+Heart | rings,wards,cools | warns | cannot keep quiet (quiet)
- whisk | Whisk | Sasara-bake — changed whisk | t1 | common | Bloom | Pace+Knack | sweeps,cleans,airs | luck | sweeps up what you wanted kept (smallgoods)
- broom | Broom | Hōki-gami — broom god | t2 | rare | Bloom | Pace+Knack | sweeps,cleans,airs | luck | sweeps up what you wanted kept (smallgoods)
- teapot | Teapot | Kyūsu-bōzu — teapot monk | t1 | uncommon | Clay | Knack+Grit | holds,warms,pours,cooks | warms | whistles at night (quiet)
- claypot | Clay pot | Bunbuku-gama — the kettle that walks | t2 | rare | Clay | Knack+Grit | holds,warms,pours,cooks | warms | rattles its lid at night (quiet)
- ladle | Ladle | Hishaku-bake — changed ladle | t1 | common | Tide | Brawn+Pace | holds,washes,carries | soothes | splashes (paper)
- bucket | Bucket | Tsurube-otoshi — bucket-dropper | t2 | rare | Tide | Brawn+Pace | holds,washes,carries | soothes | splashes (paper)
- kokeshi | Kokeshi | Kokeshi-gami — doll god | t1 | common | — | Heart | comforts,watches,sits | watches | sulks when left alone (away)
- doll | Doll | Ichimatsu-onna — doll woman | t2 | rare | — | Heart | comforts,watches,sits | watches | sulks when left alone (away)

Machines (station affinity+stat → tier-2 upgrade):
- hibachi | Hibachi | Hibachi-nyūdō — brazier priest | Ember+Grit → kamado | vice soots everything (paper)
- washtub | Washtub | Tarai-bake — changed tub | Tide+Brawn → tub | session mood −2 | vice splashes (paper)
- planter | Planter | Ueki-kozō — planter boy | Bloom+Heart → bed | session temper −2 | vice sheds everywhere (smallgoods)
- wheel | Potter's wheel | Rokuro-bake — changed wheel | Clay+Knack → kickwheel | vice never stops turning (quiet)
- icechest | Ice chest | Kōri-bōzu — ice monk | Frost+Wits → cellar | vice sweats on the floor (paper)
- treadle | Foot treadle | Karausu-kozō — treadle boy | Pace+Grit → mill | vice thumps all night (quiet)
- tier 2: kamado (Kamado-gami, hearth god), tub (Yubune-nyūdō, bath priest), bed (Hatake-gami, field god), kickwheel (Rokuro-nyūdō, wheel priest), cellar (Himuro-nyūdō, ice-house priest), mill (Karausu-nyūdō, treadle priest). Tier-2 machines cap the taught stat at A (49).

### Materials (affinity, grade, price)
Ember: wax D 12g, charcoal C 28g, slag B found · Frost: ice D 10g, iron C 30g, moonsilver B found · Bloom: straw D 8g, cedar C 22g, moss B found · Clay: earth D 10g, shard C 26g, brick B found · Tide: water D 8g, pearl C 32g, salt B found.

### Foods (grade, gain, target, side effect, toxicity, price)
pepper C +6 Ember, temper +4, tox 12, 10g · riceball D +5 Grit, −2 other stat, tox 8, 6g · potato D +5 Pace, −2, tox 8, 6g · fish C +6 Brawn, −3, tox 10, 9g · plum C +6 Wits, −3, tox 10, 9g · beans D +5 Heart, mood +4, tox 8, 7g · milk D +5 Heart, mood −3, tox 8, 7g · tofu C +6 Frost, mood −4, tox 10, 9g · honey B +7 Bloom, temper −4, tox 16, 20g (unlock: Tokiwa) · sake A +8 Knack, no side, tox 20, found only.

### Locations
- river | Riverbank Shallows | level C | Pace 12 → cedar; Wits 14 → pearl; Brawn 16 → ladle mold; Grit 20 → salt
- kiln | Old Kiln Hill | level B | unlock: Umeda's first commission | Grit 24 → shard; Knack 26 → claypot mold; Heart 28 → sake; Wits 32 → bell mold

### Customers and ladders (enter after N deliveries)
- Kōda, baker (0): r1 → k2 → k3
- Shiraishi, bathhouse (0): r4 → s2 → r7
- Umeda, fishmonger (1): r2 → u2
- Mrs. Tokiwa, the widow upstairs (2): r3 → t2
- Noguchi, schoolteacher (3): r5 → n2 → r8
- Hana, delivery girl (4): h1 → r6 → h3

### Requests
id | customer | title | constraints | pay | due | desire ("overheard") | situation | bonus | unlock
- r1 | koda | OVEN GOES COLD BY DAWN | Ember C, small, Docile | 90 | 4 | warms ("Mie has warm milk before bed.") | drafty | honey | cart: teapot
- k2 | koda | A CREAM CASE FOR THE SUMMER CAKES | Frost C, holds, Docile | 120 | 5 | soothes | smallgoods | iron
- k3 | koda | THE BIG OVEN FOR THE FESTIVAL | Ember B, Grit C, Steady | 220 | 8 | warms | drafty | slag
- r4 | shiraishi | FLOORS STICKY BY EVENING | cleans, Pace C | 80 | 3 | luck ("a bad run") | — | cedar | dealer: hibachi
- s2 | shiraishi | TOWELS DRY BY MORNING | warms, Ember C, Lively | 110 | 5 | warms | steamy | cedar
- r7 | shiraishi | BIG BATH GOES LUKEWARM | Ember B, Tide C, Steady | 260 | 8 | Lively | steamy | slag
- r2 | umeda | CATCH SPOILS BY NOON | Frost C, holds | 110 | 3 | soothes ("the shop cat") | quiet | pearl | loc: kiln
- u2 | umeda | THE ICE MERCHANT DOUBLED HIS PRICE | Frost B, holds, Quiet | 170 | 6 | soothes | quiet | moonsilver
- r3 | tokiwa | COMPANY FOR THE LONG NIGHTS | Heart C, Quiet, small | 60 | 6 | guides ("lights a candle for her husband") | quiet | sake | food: honey
- t2 | tokiwa | SOMETHING THAT WON'T SULK | comforts, Heart C, Quiet | 100 | 6 | warms | away | sake
- r5 | noguchi | LIGHT FOR THE WALK HOME | glows, Wits C | 75 | 4 | guides ("loses his glasses") | drafty | charcoal | dealer: icechest
- n2 | noguchi | A LANTERN FOR THE NIGHT CLASS | glows, Wits C, Grit C | 120 | 6 | guides | drafty | lantern mold
- r8 | noguchi | KEEP FORTY CHILDREN IN LINE | rings, Wits B, Quiet | 150 | 6 | guides | quiet | moonsilver
- h1 | hana | KEEP UP WITH THE CART | carries, Pace C | 95 | 5 | Lively ("whistles the whole route") | rough | potato
- r6 | hana | CARRY THE MORNING ROUND | carries, Pace B, Grit C | 120 | 5 | Lively | rough | salt
- h3 | hana | THE ROUND CROSSES THE RIVER | carries, Pace B, Tide C | 180 | 7 | Lively | rough | bucket mold

Situations: drafty, steamy, quiet (needs quiet), smallgoods (small goods about), paper (paper and radios about), away (owner away), rough.

---

## 6. Decided, not built: v0.7 and v0.8

### v0.7 — premise, basement, waking, taming, posts, Hōzuki
**The week.** After the tutorial, one basement item surfaces per issue on the Front Page: "Turning this week: a kokeshi (uncommon). Work it or let it turn." Work it = free on the shelf, build it this issue. Let it = wakes wild at the turn. Nothing else ticks; bought and found items are "not close yet". Masthead shows the count (99, one per week).
- `G.basement`: 99 mold ids drawn by rarity (common 6 / uncommon 3 / rare 1 / machine 1), ~1 in 5 flagged already awake (`wild:true`). The **first item after the tutorial is always already wild** (the scripted lesson). Clock starts when `G.tut` reaches the end step.
- `G.turning = {mold, issue, built}`; `placeOrder` marks `built`; `nextIssue` resolves it.

**Waking.**
- Worked item, left empty, lit by Hōzuki → wakes at `nextIssue` with a fresh spirit, temper rnd(−9, 4) (never Fierce), mood rnd(−9, 9).
- Worked item + housed spirit → wakes now (today's flow).
- Unworked → `buildVessel(mold, [], [])` + spirit temper rnd(5, 12), `wild:true`, −1 rep ("it got out"). Pre-woken basement items arrive the same way, without the rep hit.
- Hōzuki's capacity: lights N empty vessels per week, N = its Wits band (D 1, C 2, B 3). The turning item is auto-lit when built; the rest of the capacity goes to any empty vessel (Roster: "Ask Hōzuki to sit with it"). Lights the basement: see 1/2/3 weeks ahead; at C+ choose which surfaces.

**Wild ones.** Fierce refuses training (`trainPreview` → "Too fierce to train. Tame it first."); can still go on expeditions and be sold to anyone who doesn't constrain temperament. First time a `wild` spirit reaches Steady: "Tamed. +1 rep", flag cleared.

**Taming, three roads, all deterministic and previewed.**
- **Handler post** (Heart): the posted creature tames the wildest creature in the roster each week, −3 temper, if its Heart band meets the wild one's (Fierce 5–9 needs Heart D; 10+ needs Heart C).
- Planter sessions already −2 temper. Honey already −4 temper at 16 toxicity.

**Posts** (your own creatures as staff; the premise made literal). One creature per post, assigned on the Front Page masthead; a posted creature gains +2 in the post's stat per week up to its vessel's cap (machine wear-in rule) — so staff need better bodies eventually, which is the reason to build vessels for yourself.
- v0.7 posts: **Counter** (Heart; customers return sooner: cooldown 4 → 3 / 2 / 1 by band), **Handler** (above), **Lantern** = Hōzuki, permanent.
- Later: **Kitchen** (Knack; food toxicity −25/50/75%), **Road** (Pace; scouts one more trial per band, keeps more haul on a break), **Bench** (an Ember creature raises floors of Ember builds) as a sixth.
- Masthead staff box at the top of the Front Page: every post named with its effect this week, or **vacant, printed as what you're losing** ("Counter — vacant: customers return in 4 weeks"). Selling a posted creature shows who leaves the masthead.

**Hōzuki.** Unique possessed lantern (tier 2 caps), unsellable, not transferable, in the roster with portrait and grade. Writes the Beginner's column (same 13 steps, its voice, its face) and comments on events (wild wake: "That one woke in the dark. Nobody sat with it."; taming; a capped machine; a vacancy). Grows like a post (+2 Wits/week working), plus plum, plus a Wits machine.

**Copy pass.** Masthead tagline, tutorial step 0, customer lines ("heard you tame them"), shrine ("caught spirits"), box ("unhoused"), expeditions as places discards pile up. Bible Premise rewrite.

### v0.8 — Client Files (the view from the shop)
Reference: Adam's old "Client File #004 – Elara Vance" log (consultation → hatching → diet phase → stabilization → training → delivery, with an itemized bill). Keep the format, drop eggs and stages (evolution was ruled out; items wake instead of hatch).
- Every accepted commission gets a file that writes itself, dated by issue: Consultation (request, budget) · Action taken (item brought up / built with what, cost) · Diet (foods) · Observation (band crossings, temper settling) · Delivery (fit, bonus, complaint) · **Bill**: mold, materials at list, feed at list, workshop sessions, vs pay, **margin** last.
- Open files on the accepted request card; closed files in the Ledger (filing cabinet instead of a log). Tracking: `vessel.cost` at build, `spirit.spent` from feed(); entries from `spirit.hist`.
- Observation lines from feeding and handling too (today only machines announce crossings); portrait changes at the band crossed.
- Kitchen and Road posts. **Vault**: a delivery that earns the bonus saves its build as a named recipe callable from the Order Form (Dressmaker's pattern book).

### Still parked
House calls instead of fixed locations; ticking market items ("turns in 3 weeks"); favorite snack per species (mood instead of toxicity); Spirit Index page (24 types, filled on first possession); genuine/reproduction molds and collector customers; kuyō rite on salvage (grudge without it); gossip hints from creatures in the shop.

---

## 7. Research notes

**Dressmaker (applied).** Thresholds printed on the card, sketchbook bars, client budgets, client ladders, visible unlocks → our "Designing for" badges, receipt/margin, ladders, unlock rewards.

**Post-tutorial diagnosis (applied).** Simulation showed 73% of boards held grade-B requests by issue 3, hidden food solutions, the kiln trap, no direction; mold scarcity was not a problem (98% fit). Ladders brought grade-B boards at issue 3 to 0%; first grade-B rung now lands around issue 8.

**Bestiary.** Reider 2009 (JJRS) on tsukumogami; Source Library emaki scan; NDL Sekien column; yokai.jp; Nichibunken yōkai database; Matthew Meyer (yokai.com); Wikipedia. All 24 type names in `YOKAI` use canonical names where one exists.

**Tsukumogami in games (2026-10-16).** Nobody has made the vessel-crafting game. Existing uses: enemies to *name* (99 Spirits, 2012: guess the true name from clues; capture; panned for tedious meters), creature-collector with snacks and bond (Tsukumo SNAP!, out 2026-10-27, 161 spirits), antique vs. phony teacup with a hidden authenticity stamp (Pokémon Sinistea; its Scarlet dex entry about fanatics preparing the perfect teacup for a spirit is our premise), candle whose flame brightens with life absorbed (Litwick), Nioh 2's Karakasa ("old object brought to life after being discarded"), Touhou's koto and biwa sisters (tools abandoned without a memorial service), *We Rent Tsukumogami* (Edo rental shop; the spirits overhear gossip and solve each customer's problem), Spirittea (serve forgotten spirits; dinged for chores and unsignposted preferences). Steal list: gossip hints, Spirit Index, antique/phony, favorite snack, kuyō. Avoid: upkeep meters that aren't decisions.

---

## 8. Tuning watch and known issues
- Cooldown 4 can leave the board thin in issues 4–6 (the Counter post is the designed fix).
- `machineGain` 2 is a guess; wear-in to B takes ~10 sessions.
- Speech-line table is small; FIRST/says() repeat quickly.
- Reveal overlay and locked tabs need handling in any click-through test (see `tools/render.js`).
- Engine `const` names must not collide with window globals (`top` did, now `bandTop`).

## 9. Version history
v0.1 playable → v0.2 fixes (dropdowns, spirit select, accept without deadline, grade/cap strip) → v0.3 Pages + tutorial → v0.4 consumable molds, machines as vessels, new tutorial → v0.5 ladders, Designing for, unlocks, budget, free decline, rumors, Dressmaker pass → v0.6 machine wear-in + tier-2, scouting, creature presentation (reveal, faces, voices, epithets) → v0.6.1 yokai type names.
