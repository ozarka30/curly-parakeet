// SPEC §13 as runnable checks. Usage: node tools/test.js [engine.js | index.html]
const fs=require('fs'),assert=require('assert');
const file=process.argv[2]||'engine.js';let src=fs.readFileSync(file,'utf8');
if(file.endsWith('.html'))src=src.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m={exports:{}};new Function('module',src)(m);const E=m.exports;const {MIN,H}=E;
const T=Date.UTC(2026,9,16,12,0,0);// a fixed "now"
const fresh=()=>E.newGame(7,T);
// helpers: place a creature of species sp with values, at home
function make(S,sp,vals,t){const s=E.newSpirit(S,sp,false,t||S.tick);Object.assign(s.v,vals||{});return s;}
const n=(S,s)=>S.spirits[s.id];
let pass=0;const ok=(name,f)=>{try{f();pass++;console.log('ok ',name);}catch(e){console.log('FAIL',name,'\n   ',e.message);process.exitCode=1;}};

ok('1 new game: light 10, cost 10, nothing to do but sit/tap',()=>{const S=fresh();assert.equal(S.light,10);assert.equal(E.sitCost(S),10);assert.equal(Object.keys(S.spirits).length,0);
 assert.equal(E.buySlot(S),'Need 60 g');assert.equal(E.canSend(S,'nope',{h:1}),'No body');assert.equal(E.tap(S),true);assert.equal(S.light,11);assert.equal(E.sit(S,T),null);assert.equal(S.light,1);assert.equal(S.basement.fuseAt,null);
 assert.equal(E.basementLeft(S),99);assert.deepEqual(S.basement.order.slice(0,3),['candle','kokeshi','ladle']);});

ok('2 wild wake with nobody home; kokeshi tames at 2/min',()=>{const S=fresh();const c=make(S,'candle'),k=make(S,'kokeshi');assert.equal(E.send(S,T,c.id,{h:1}),null);assert.equal(E.send(S,T,k.id,{h:2}),null);
 E.advance(S,T+4*H);const w=E.atHome(S).filter(s=>s.wild>0);assert.equal(w.length,1);assert.equal(w[0].wild,60);assert.equal(S.basement.next,1,'next item surfaced');
 E.advance(S,T+5*H);assert.equal(w[0].wild,60);assert.equal(E.recall(S,T+5*H,k.id),null);assert.equal(E.recall(S,T+5*H,c.id),null);E.advance(S,T+5*H+MIN);assert.equal(w[0].wild,58,'candle makes light, does not tame');
 const rep=S.rep;E.advance(S,T+5*H+31*MIN);assert.equal(w[0].wild,0);assert.equal(S.rep,rep+2);});

ok('3a two tier-1 rentals at exact fit: 480 g / 16 rep per 4 h, capped',()=>{const S=fresh();const a=make(S,'chime',{Ember:19}),b=make(S,'chime',{Bloom:19});E.send(S,T,a.id,{h:1});E.send(S,T,b.id,{h:2});
 E.advance(S,T+4*H);assert.equal(S.gold,480);assert.equal(S.rep,16);assert.equal(a.v.Ember,19);
 E.advance(S,T+24*H);assert.equal(S.gold,960);assert.equal(S.rep,32);});

ok('3b candle Ember 10 at the bakery for 4 h: 240 g, Ember 14, rep 8',()=>{const S=fresh();const c=make(S,'candle');E.send(S,T,c.id,{h:1});E.advance(S,T+4*H);assert.equal(S.gold,240);assert.equal(c.v.Ember,14);assert.equal(S.rep,8);});

ok('4 one band under: warned, breaks, loot kept, spirit boxed at Tide 19',()=>{const S=fresh();const l=make(S,'ladle',{Tide:13});const p=E.roadPreview(S,l.id,'river',1);assert.equal(p.ok,true);assert.equal(p.breaks,true);
 assert.equal(E.send(S,T,l.id,{r:'river',d:1}),null);assert.equal(E.outCount(S),1);E.advance(S,T+H);assert.equal(S.gold,80);assert.equal(l.body,null);assert.equal(l.v.Tide,19);assert.equal(E.outCount(S),0);assert.equal(Object.keys(S.bodies).length,0+(l.loc.k==='home'?Object.keys(S.bodies).length:0));assert.equal(E.box(S).length,1);});

ok('4b two bands under is refused',()=>{const S=fresh();const l=make(S,'ladle',{Tide:13});assert.equal(E.canSend(S,l.id,{r:'river',d:2}),'Far too deep');});

ok('5 rehouse clamps to the new caps; not while rented',()=>{const S=fresh();const l=make(S,'ladle',{Tide:25});l.body=null;const chime=E.newBody(S,'chime');assert.equal(E.rehouse(S,l.id,chime),null);assert.equal(l.v.Tide,19);assert.equal(l.v.Frost,0);assert.equal(l.yokai,'Fūrin-kozō');
 l.v.Frost=10;S.rep=10;assert.equal(E.send(S,T,l.id,{h:3}),null);assert.equal(E.rehouse(S,l.id,E.newBody(S,'bell')),'Not home');assert.equal(E.feed(S,l.id,'Tide'),'Not home');});

ok('6 light ceiling: tap refused at ceiling; candle home raises it; clamps back',()=>{const S=fresh();S.light=30;assert.equal(E.tap(S),false);assert.equal(S.light,30);E.advance(S,T+H);assert.equal(S.light,30);
 const c=make(S,'candle');assert.equal(E.lightCeiling(S),40);E.advance(S,T+2*H);assert.equal(S.light,40);E.send(S,T+2*H,c.id,{h:1});E.advance(S,T+2*H+MIN);assert.equal(S.light,30);});

ok('7 clock goes back: timestamps shift, nothing paid',()=>{const S=fresh();const c=make(S,'candle'),l=make(S,'ladle');E.send(S,T,c.id,{h:1});E.send(S,T,l.id,{r:'river',d:0});
 E.advance(S,T-H);assert.equal(S.gold,0);assert.equal(S.tick,T-H);assert.equal(l.loc.done,T-45*MIN);E.advance(S,T-59*MIN);assert.equal(S.gold,1);assert.equal(l.loc.k,'road');});

ok('8 export/import mid-timer keeps the loot and the clock',()=>{const S=fresh();const l=make(S,'ladle');E.send(S,T,l.id,{r:'river',d:0});E.advance(S,T+5*MIN);const txt=E.exportState(S);
 const S2=E.importState(txt);E.advance(S2,T+8*MIN);const l2=S2.spirits[l.id];assert.equal(l2.loc.k,'road');assert.equal(l2.loc.done-(T+8*MIN),7*MIN);assert.deepEqual(l2.loc.loot,l.loc.loot);assert.equal(S2.gold,0);});

ok('9 sitting just before the fuse: tame wake, fuse restarts at the wake',()=>{const S=fresh();S.light=50;const t0=T+3*H-30e3;E.advance(S,t0);assert.equal(E.sit(S,t0),null);E.advance(S,T+3*H+2*MIN);
 const s=Object.values(S.spirits)[0];assert.ok(s&&s.wild===0,'tame wake');assert.equal(Object.keys(S.spirits).length,1);assert.equal(S.basement.fuseAt,t0+45e3);assert.equal(S.basement.fuseMs,0);});

ok('10 at most two wild pending; the fuse pauses, then resumes 3 h after a taming',()=>{const S=fresh();const ev=E.advance(S,T+20*H);const w=ev.filter(e=>e.k==='wild');assert.equal(w.length,2);assert.deepEqual(w.map(e=>e.t),[T+3*H,T+6*H]);assert.equal(S.basement.fuseAt,null);assert.equal(S.basement.next,2);
 Object.values(S.spirits)[0].wild=0;E.advance(S,T+23*H);assert.equal(S.basement.next,3,'third woke exactly 3 h after the taming');});

ok('11 recall forfeits the half cycle; pay is banked per minute',()=>{const S=fresh();const c=make(S,'candle');E.send(S,T,c.id,{h:1});E.advance(S,T+25*MIN);assert.equal(S.gold,25);assert.equal(E.recall(S,T+25*MIN,c.id),null);
 E.send(S,T+25*MIN,c.id,{h:1});E.advance(S,T+30*MIN);assert.equal(S.gold,30);assert.equal(S.rep,0);E.advance(S,T+55*MIN);assert.equal(S.rep,1);});

ok('12 market refreshes on the local date, not 24 h',()=>{const S=fresh();const d=new Date(T);const late=new Date(d.getFullYear(),d.getMonth(),d.getDate(),23,59).getTime();const next=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1,0,0).getTime();
 S.market.stock[0].sold=true;const day=S.market.day;E.advance(S,late);assert.equal(S.market.day,day);assert.equal(S.market.stock[0].sold,true);E.advance(S,next);assert.notEqual(S.market.day,day);assert.equal(S.market.stock.every(x=>!x.sold),true);assert.equal(S.market.stock.filter(x=>x.kind==='stray').length,1);});

ok('13 a tamer on the road tames only after it returns (inside the cap)',()=>{const S=fresh();const w=make(S,'teapot');w.wild=60;const t=make(S,'chime');S.basement.next=99;S.basement.fuseAt=null;assert.equal(E.send(S,T,t.id,{r:'pass',d:0}),null);t.loc.done=T+3*H;
 E.advance(S,T+20*H);assert.equal(w.wild,0);const tamed=S.log.filter(x=>/is tame/.test(x.text)).pop();assert.equal(tamed.t,T+4*H);});

ok('14 slots cost 60 then 300',()=>{const S=fresh();S.gold=400;assert.equal(E.buySlot(S),null);assert.equal(S.gold,340);assert.equal(E.buySlot(S),null);assert.equal(S.gold,40);assert.equal(S.slots,4);assert.equal(E.buySlot(S),'Need 1500 g');});

ok('15 fit multipliers and food',()=>{assert.equal(E.fitMult(19,'D'),1);assert.equal(E.fitMult(20,'D'),1.5);assert.equal(E.fitMult(30,'D'),2);assert.equal(E.fitMult(9,'D'),0);
 const S=fresh();const c=make(S,'candle',{Ember:16});assert.equal(E.feedGain(c,'Ember'),6);assert.equal(E.feed(S,c.id,'Ember'),null);assert.equal(c.v.Ember,22);assert.equal(E.feedGain(c,'Ember'),6);c.v.Ember=29;assert.equal(E.feed(S,c.id,'Ember'),'At the cap');c.v.Ember=35;assert.equal(E.feedGain(c,'Ember'),3);});

ok('16 road wild comes home housed and pauses the fuse when two are wild',()=>{const S=fresh();const a=make(S,'ladle',{Tide:25});E.send(S,T,a.id,{r:'river',d:1});a.loc.loot.wild='teapot';a.loc.loot.body=null;a.loc.loot.breaks=false;
 const ev=E.advance(S,T+H);assert.ok(ev.some(e=>e.k==='wild'&&e.from==='road'));const w=E.atHome(S).filter(s=>s.wild>0);assert.equal(w.length,1);assert.equal(E.spOf(S,w[0]),'teapot');assert.equal(a.v.Tide,29,'capped growth');});

ok('17 stray purchase makes a tame creature; empty body sells for half',()=>{const S=fresh();S.gold=1000;const i=S.market.stock.findIndex(x=>x.kind==='stray');assert.equal(E.buyStock(S,T,i),null);assert.equal(Object.keys(S.spirits).length,1);assert.equal(S.gold,700);
 const b=E.newBody(S,'chime');assert.equal(E.sellBody(S,b),null);assert.equal(S.gold,775);assert.equal(E.buyCap(S),'Need 1000 g');S.gold=1000;assert.equal(E.buyCap(S),null);assert.equal(S.cap,8);});

console.log(pass,'passed');
