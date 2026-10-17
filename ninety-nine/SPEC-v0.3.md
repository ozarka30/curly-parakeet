# Ninety-Nine v0.3 · the descent

An idle fighter. Ninety-nine floors of basement under the shop; each floor is one thing turning ninety-nine, wild. Beat it and it is tamed: it joins the roster as a unique character. Fights are JRPG-style (your line of four on the left, theirs on the right) and run by themselves one second at a time; your only input in a fight is tapping an ability when its gauge is full, and choosing when not to. This replaces the v0.2 street economy (kept as `street.html`).

Live: https://ozarka30.github.io/curly-parakeet/ninety-nine/ · tests `node ninety-nine/tools/test.js ninety-nine/index.html` · click-through `node ninety-nine/tools/render.js shot.png`.

## The loop, as a player

1. Hōzuki hands you Pochi (candle, Ember, Lv 3) and Momo (kokeshi, Bloom, Lv 2). **Go down to B1.**
2. B1 is three encounters with no scene change: a pack of junk (two throwaways: umbrellas, lighters, cans), a second pack, then the floor's **resident**, Taro the ladle. Junk dies in seconds; the resident takes a while and fights back with a wind-up you can see.
3. Pochi's gauge fills from her own hits. Left alone it fires Flare at 100. Tap **Hold** and it sits full (gains past 100 are wasted, so holding costs you) until you tap **Flare** yourself: on the resident, ideally, or the second its wind-up bar starts.
4. Taro goes down → **tamed**: he joins the line in slot 3 at his own level. The floor counter ticks to B2. HP and gauges carry over; two seconds of walk-in regen between encounters.
5. Gold from every kill. Spend it in the shop list under the fight: **Lv n · cost** per character, any time. Reorder the line with ▲ (the top slot takes the hits and feeds the one below it if the elements chain). Bench anyone; benched characters earn gold per minute in the shop.
6. B5 is a **challenge**, not a fight: a dark passage that wants Light. A bar fills at a rate set by who you brought; nobody is hurt, it is just slow without the right ability.
7. B9's resident is a **boss**, the vending machine, with escorts and 1.6× HP. The first time, the line breaks around here. Nobody dies: the bodies come home, everyone is healed, and the four hold the deepest cleared floor, earning a trickle while you decide. Level up, put Taro on top (Tide quells Ember, and the machine is Ember), hold two gauges for the boss, go again.
8. Close the tab. On return, **While you were gone**: the four farmed the deepest floor at half pay and the shop earned its bench rate, both capped at 8 hours. That buys the levels the wall needed.
9. Nine floors to a stratum; the ninth is a boss; after B9 residents are drawn from all bodies, modern ones included. B99 is the first ending; the next basement (reincarnation as prestige) is v0.4.

## Rules as built

- **Stats at level L** = 10 + spread × (L − 1) per body (six stats, as the bout card). **HP** = Grit × 6 + 10 (Carry +25%). **Hit** = max(Brawn, Wits) − Grit/3, min 1; acts every 4 s × 10/Pace (0.5–6 s); crit Knack/200 (Light +10%), ×2. Element: attacker quells defender ×1.5, defender quells attacker ×0.75; the ally above feeds you ×1.25.
- **Gauge**: +25 per own action, +10 per hit taken (rogues +15/+5); cap 100, no stacking. Party fires at 100 unless **Hold**. Rogues at 100 **wind up for 3 s** (visible bar) then cast; Great Toll during a wind-up cancels it and drops the gauge to 50; dazzle halves the special.
- **Specials**: Flare (Wits × 0.8 all, dazzle 5 s), Great Toll (Wits × 1.2 all, stun 2 s, breaks wind-ups), Clean Sweep (Brawn all), Scald (×2 on focus, burn 8 s), Bulwark (shield Grit × 2 each, 6 s), Lullaby (heal all Heart × 1.5, **lifts the fallen**, enemies lose 2 s).
- **Junk** (umbrella, lighter, can; from stratum 2 also bag, battery): 0.3× HP, never heals, never casts. Packs of 2 (stratum 1), 3 (2–4), 4 (5+).
- **Floors**: n%9 == 5 → challenge wanting one ability (rate Σ lv × 1 if it has it, else 0.15; amount 15 n). n%9 == 0 → boss: resident lv n+4, 1.6× HP, two junk escorts. Otherwise resident lv n+2. Every enemy stat is multiplied by **1.03^n**: that curve is what makes walls.
- **Residents** 1–8 hand-written (Taro ladle Tide, Kuro teapot Clay, Suzu chime Frost, Hime whisk Bloom, challenge, Ume ladle Clay, Gen chime Ember, Fumi kokeshi Frost), B9 the vending machine. Deeper: random non-junk body, 60% its favoured element, a name from a list; bosses are modern bodies. A tamed resident joins at **its own level** with full HP and an empty gauge, and takes a free slot in the line if there is one.
- **Gold**: junk pays 3 × 1.1^(n−1); residents 5×, bosses 10×. **Level cost** 8 × 1.12^(L−1). **Bench** earns lv × 0.6 g/min per benched character. **Home**: the party holds the deepest floor and earns a floor's junk gold per 90 s at half pay. **Offline**: the same two rates for min(away, 8 h). Backgrounding under 60 s is simulated second by second; longer is treated as away, the current encounter is abandoned and resumes from walk-in, nobody is healed.
- **Falling**: when the fourth body breaks, the run ends, everyone is healed, the four hold the deepest cleared floor. Retreat does the same on purpose. Descend always starts at deepest + 1. Fallen characters stay down within a run unless Lullaby lifts them.
- **Save**: localStorage `nn3`, every 5 s and on hide; the fight itself is not saved, a reload restarts the encounter from walk-in with HP and gauges as they were.

## Pacing (greedy auto-player, Auto, no holds)

B9 at ~5 min, B18 at ~11, B27 at ~25, B36 at ~80 min of active retrying; walls fall exactly on the boss floors. 8 h away at B27 buys ~50 levels across the line. First floor: first kill at 12 s, Taro tamed at ~1 min. Expected tuning after Adam and a friend play: boss floors may want a one-floor warning (B8 harder), modern bodies need stat spreads with more character, and the bench rate is a guess.

## Deliberately not in v0.3

Materials and crafting; reincarnation and the second basement; individual stat spreads beyond the body; challenge floors that hurt; focus persistence between encounters; art for the modern bodies (SVG placeholders until the Gemini sheets are split); sound.
