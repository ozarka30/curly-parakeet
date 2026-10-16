// Prints every data table from the engine as markdown. Usage: node tools/dump.js index.html tables.md
const fs=require('fs');const src=fs.readFileSync(process.argv[2],'utf8').match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m={exports:{}};new Function('module',src)(m);const E=m.exports;
const out=[];const p=(...a)=>out.push(a.join(''));
p('CONFIG: ',JSON.stringify(E.CONFIG));p('RARITY: ',JSON.stringify(E.RARITY));
p('\nMOLDS (id | name | yokai — gloss | tier | rarity | native | lean | tags | gift | vice (triggers) | station/next)');
for(const [id,M] of Object.entries(E.MOLDS))p('- ',id,' | ',M.name,' | ',M.yokai,' — ',M.gloss,' | t',M.tier,' | ',M.rarity,' | ',M.native,' | ',M.lean.join('+'),' | ',M.tags.join(','),' | gift:',M.gift,' ("',M.giftText,'") | vice: ',M.vice,' (',M.triggers.join(','),')',M.station?' | station '+M.station.join('+')+(M.next?' → '+M.next:''):'',M.env?' env '+M.env.k+' '+M.env.amt:'');
p('\nMATS (id | name | aff | grade | price)');for(const [id,x] of Object.entries(E.MATS))p('- ',id,' | ',x.n,' | ',x.a,' | ',x.g,' | ',x.rare?'rare (found only)':x.p+'g');
p('\nFOODS (id | name | grade | +value | to | side | tox | price)');for(const [id,x] of Object.entries(E.FOODS))p('- ',id,' | ',x.n,' | ',x.g,' | +',x.v,' | ',x.to.join(' '),' | ',x.side?x.side.k+' '+x.side.amt:'none',' | tox ',x.tox,' | ',x.rare?'rare':x.p+'g',x.unlock?' | unlock: '+x.unlockText:'');
p('\nLOCS');for(const [id,L] of Object.entries(E.LOCS))p('- ',id,' | ',L.n,' | lvl ',L.lvl,L.unlock?' | unlock: '+L.unlockText:'',' | trials: ',L.trials.map(t=>t[0]+' '+t[1]+' → '+t[2]).join('; '));
p('\nCUST (id | name | trade | enters after N deliveries | ladder)');for(const [id,C] of Object.entries(E.CUST))p('- ',id,' | ',C.n,' | ',C.t,' | enter ',C.enter,' | ',C.ladder.join(' → '));
p('\nREQ (id | customer | title | constraints | pay | due | desire | situation | bonus | unlock)');for(const [id,R] of Object.entries(E.REQ))p('- ',id,' | ',R.c,' | ',R.title,' | ',R.cons.map(c=>c.join(' ')).join(', '),' | ',R.pay,'g | due ',R.due,' | desire ',R.desire,' ("',R.hint,'") | sit ',R.sit,' | bonus ',R.bonus,R.unlock?' | unlock '+JSON.stringify(R.unlock):'');
p('\nTUT steps');E.TUT.forEach((t,i)=>p('- ',i,': ',(t.title||t.h||''),' — ',(t.text||t.t||'').toString().slice(0,160),t.unlock?' [unlocks '+t.unlock+']':'',t.end?' [end]':''));
fs.writeFileSync(process.argv[3],out.join('\n'));console.log(out.length,'lines');
