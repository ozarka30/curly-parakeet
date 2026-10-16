# Ninety-Nine v0.2 — kinds, families and the street formation (rev 2, after review)

*Builds on v0.1 rev 2. Everything not mentioned is unchanged: Hōzuki, the basement clock and fuses, wild wakes, roads, the market, offline rules, the paper. Rev 2 folds in three reviews (economy, first-player UX, systems); changes from rev 1 are marked ★.*

## 0. The idea

You don't manage units; you found **kinds**. At the bench you pack an old body with a material and sit with it: it wakes as an **original**, a named creature with a face and lines, and its design is a kind, named after her until you rename it ("Pochi's kind") ★. From then on you can awaken more of her kind: **the family**, a count that stands behind her and multiplies what she does. Every kind has an **ability** from its body and an **affinity** from its material; a house's output is the family's size × the original's grade × how well the neighbours agree, because the five affinities feed and quell each other down the street. The number that goes up is the street's gold a minute; the way you raise it is designing the right kind for the gap and putting it in the right house.

## 1. Kinds

Kind = **body shape** × **affinity**. Shape gives the ability and a favoured affinity; the material gives the affinity. Packing the favoured material raises the cap one band. Duplicate shape+affinity kinds are allowed (three Ember-favouring houses want three Ember families) ★.

| shape | ability | favoured | per unit (tier 2 doubles) |
|---|---|---|---|
| candle / lantern | **Light** | Ember | +2 light a minute, wherever it is |
| chime / bell | **Toll** | Frost | every house +1%, **while housed** ★ |
| whisk / broom | **Sweep** | Bloom | the two neighbouring houses +3%, while housed |
| teapot / clay pot | **Steam** | Clay | **this house +2%** ★ (was cycle speed; that was dead and complicated) |
| ladle / bucket | **Carry** | Tide | roads: trip ÷ (1 + 0.02 per unit), loot × (1 + 0.03 per unit) ★ |
| kokeshi / doll | **Comfort** | Bloom | at home: tames; at a house: +1 rep per cycle per 5 units ★ |

Materials: wax (Ember), ice (Frost), straw (Bloom), earth (Clay), water (Tide), 4 g × 1.1 per use ★. **Item 1's wax is free** and the other four are dimmed with "caps a band lower" ★.

## 2. Originals and families

- The original is a v0.1 creature: name, portrait, lines, five values, wild/tame, history. Feeding, roads and growth happen to her; **the kind's grade is hers** and the family inherits it. Copy never says "units": "Pochi and 39 of her kind", "Feed Pochi; they follow her" ★. The count is a badge, never the headline; the window shows her face and at most three silhouettes ★.
- **Awaken another** lives on her card: it buys the body at the scrapyard and wakes it for 10 light in one tap, showing the price and the +g/min ★. The n-th body of a shape costs 10 g (common) / 25 g (uncommon) × **1.10ⁿ** ★ (1.15 walled by day 2 with only six shapes). **The first spare candle is free** ("Grandmother kept a spare") ★. Tier-2 shapes appear at the scrapyard at rep 100, 1,000 g base ★.
- **Milestones** ★: a family's output ×2 at 10, 25, 50, 100 and 200. This is the upgrade layer Cookie Clicker has and a bare count doesn't; it also makes "one fat family or many" a decision.
- Bodies also arrive from the basement, roads and the market; at the bench a body founds a kind (material) or **joins** one of the same shape and affinity (10 light, no material).
- **Wild ones** are one-member kinds with a random affinity. Tamed, they work alone or **join** a kind of the same shape and affinity by name: "Kuro joins Pochi's kind". Families keep a roll; tap the count to read it ★. Never automatic.
- When the original is on a road the family keeps earning at count − 1; her frame on the card empties ("on the Pass · back 40 m") and the window dims a step ★. If her body breaks she comes home unhoused; the kind keeps its grade; a spare body of the shape (or borrowing one from the family) rehouses her ★.

## 3. The street as a formation

Houses in a column. **Mrs. Tokiwa is house 1 and the bakery house 2** ★ so the first feed arrow (Momo's straw above Pochi's flame) happens in the opening, and the fish stall below the bakery teaches the first quell. A house asks a **grade**, pays by **tier**, **favours** an affinity (×1.5), and holds one kind. No slots: houses are the slots.

Output, gold a minute, for the kind at house h with u working units:
`rate × u × fit(×1/1.5/2) × favoured(×1.5) × fed × quelled × milestones × (1+Toll) × (1+Sweep) × (1+Steam)`
- **fed** ★ = `1 + 0.5 × min(1, units above ÷ units here)` when the kind above feeds this one (Bloom→Ember→Clay→Frost→Tide→Bloom). A thin family above a fat one feeds it only a little, so the formation changes as families grow instead of being solved once (the review enumerated all 5⁸ columns: the static rule had one 20%-better answer).
- **quelled** = ×0.75 if either neighbour quells this kind (Bloom→Clay→Tide→Ember→Frost→Bloom) ★ defined.
- Toll counts housed Toll units street-wide; Sweep counts housed Sweep units at h±1; Steam counts this kind's own units.
- Rep per cycle as v0.1 (×2 when two bands over), plus Comfort. Cycles are seconds mod cycle length; Steam no longer touches them.
- Assigning to an occupied house **swaps**; the displaced kind takes the vacated house if it fits, else goes home. Assign lists every candidate with its resulting g/min and arrow ★.

| # | house | asks | favours | tier | rate / unit | rep |
|---|---|---|---|---|---|---|
| 1 | Mrs. Tokiwa, upstairs | D | Bloom | 1 | 2 g/min | 0 |
| 2 | Kōda's bakery | D | Ember | 1 | 2 | 0 |
| 3 | Umeda's fish stall | D | Frost | 1 | 2.4 | 10 |
| 4 | Tsuru-no-yu bathhouse | C | Ember | 2 | 5 | 100 |
| 5 | Hana's delivery cart | C | Tide | 2 | 5 | 100 |
| 6 | The schoolhouse | C | Bloom | 2 | 6 | 100 |
| 7 | The inn by the bridge | C | Clay | 3 | 10 | 600 |
| 8 | The shrine on the hill | B | Ember | 3 | 12 | 3000 |

## 4. Home, light, gold

- Kinds not housed are home. Any tame kind at home tames (12 wildness a minute per kind, Comfort ×2, tier doubles); Light kinds shine wherever they are; the rest wait. Housed Toll/Sweep/Steam/Comfort do their thing only while housed ★.
- **Light** ★: 6 a minute (was 12) + 2 per Light unit; taps give 2; **ceiling = next sit cost + 100 + 2 per Light unit** (the review showed the old ceiling made light bind on day 1 and idle after). Spent on sitting (cost grows 5% per item as now) and on awakenings (10 each).
- **Gold**: bodies, materials, food (**12 g × ⌈family ÷ 10⌉** ★ so a +6 isn't a permanent ×2 for 12 g), the offline cap (**8 h = 120 minutes of current income, 12 h = 360** ★). Empty bodies sell for half the scrapyard price ★ (the old flat 75 g was infinite money against 10 g bodies).

## 5. Roads

As v0.1, originals only. Carry as above. Loot gold × (1 + rep/1000).

## 6. Page (changes)

Order ★: masthead (g/min large, gold, light, rep → next house, items left) · Hōzuki · **bench** (next item with fuse; join buttons for matching kinds, or the five materials with price and cap note, then Sit) · **shop strip** (kinds at home: face, name, ×N, role) · **street column** with a 20 px rail: green ▼ between cards when above feeds below, a red barred arrow at a quelled card, dotted grey otherwise; shape and words, never colour alone · roads · market (foods by kind, the stray, the scrapyard shapes) · ledger · pending-actions bar.

House card, always visible ★: caption `KŌDA'S BAKERY · wants Ember`; 48 px face · `Pochi ×7` · `31.5 g/min` large; `Rōsoku-bi · Ember C` and at most three chips (`Ember ✓` `fed ↑` `quelled ↓`); cycle bar with `+1 rep`. Everything else on tap, in a sheet: labelled multiplier lines (active ones only), the roll, Feed (+6 → grade), Awaken another (price · light · +g/min), Road, Change house (per-house preview), Recall, Rename.

Hōzuki's opening ★ (trigger → line):
1. First open → "You're late. Ninety-nine downstairs; the first wakes in five minutes. It's a candle, and a candle wants wax. Pack it, sit with it, it wakes tame."
2. Materials shown → "Wax. The others would take, but a candle packed with ice never burns bright."
3. First reveal closed → "Pochi. First of her kind, so her kind is 'Pochi' until you say otherwise. Kōda's oven likes Ember; put her there."
4. First assign → "See the window light. She earns by the minute, and makes light wherever she stands. Two of her would earn twice."
5. Light ≥ 10 after that → "Grandmother kept a spare candle. Tap *Awaken another* on Pochi: the body, a little light, and her kind grows."
6. First ×2 → "Not a new face. One more of Pochi's kind, standing behind her. What she learns, they learn. Watch the oven."
7. Item 2 surfaces → "A kokeshi. Straw, for Bloom: she tames, and Mrs. Tokiwa wants company. Put her upstairs, above Pochi."
8. First green arrow → "There: her straw feeds Pochi's flame, and the oven runs hot. The street's a chain. Mind what stands above what."

## 7. Data model (v3, fresh start; v2 saves are not migrated)

```
S={v:3,…,gold,light,rep,cap,
 basement:{order,next,fuseAt,fuseMs,sitAt,plan:null|{found:{aff}}|{join:tid}},
 spirits:{sid:{…v0.1 fields…, tid}},            // originals only; loc is home|road
 bodies:{bid:{sp}},                               // shelf = unreferenced
 kinds:{tid:{id,name,sp,aff,sid,count,post:null|{h,at,sec,g,earned},cycles,born,roll:[]}},
 mats:{Ember:0,…}, scrap:{candle:0,…}, free:{candle:1}, market,log,notices,seen,say}
```
`units(T)` = wild ? 0 : count − (original away or unhoused ? 1 : 0). Light counts a travelling original, not an unhoused one.

## 8. Tests (engine, node)
founding (light, material, cap by favoured); joining (shape check, light check); sit with a join plan (count++, no spirit; fuse wake ignores the plan); output formula with favoured + fed (dynamic) + quelled; Toll/Sweep stacking while housed, not from home; Steam; milestones at 10 and 25; original on the road (count−1 earns, light still counts her); break then rehouse/borrow; join by name with the roll; scrapyard curve 1.10 and the free candle; sell = half price; light rate and ceiling with Light units; assign swap; Comfort taming at home and rep at a house; food price by family size; cap price from income.

## 9. Prestige (v0.3, for the record)
Persist: household gods ×1.5 per house, kind recipes (re-founding a known kind needs no material), Hōzuki +3 light/min per century, a lineage bonus √(units ever awakened)% on every house, the bought offline cap. Reset: gold, light, rep, counts, bodies, originals' grades, houses, basement, prices.

## 10. Still open after review
- Comfort is the rep spine once families are large; watch whether rep thresholds need to move once people stack kokeshi.
- Roads are now a side lane (growth, bodies, wild ones); if nobody uses them by day 2, Carry goes and roads become "calls".
- The family-milestone layer buys about a day; the next layer (kind upgrades bought with gold, or tier-3 shapes) is a v0.3 question.
