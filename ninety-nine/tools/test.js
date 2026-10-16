// SPEC §13 on the seconds-first scale. Usage: node tools/test.js index.html
const fs=require('fs'),assert=require('assert');
const file=process.argv[2]||'index.html';let src=fs.readFileSync(file,'utf8');
if(file.endsWith('.html'))src=src.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m={exports:{}};new Function('module',src)(m);const E=m.exports;const {SEC,MIN,H}=E;
const T=Date.UTC(2026,9,16,12,0,0);
const fresh=()=>E.newGame(7,T);
function make(S,sp,vals,t){const s=E.newSpirit(S,sp,0,t||S.tick);Object.assign(s.v,vals||{});return s;}
const near=(a,b,eps,msg)=>assert.ok(Math.abs(a-b)<=eps,(msg||'')+' '+a+' vs '+b);
let pass=0;const ok=(name,f)=>{try{f();pass++;console.log('ok ',name);}catch(e){console.log('FAIL',name,'\n   ',e.message);process.exitCode=1;}};

ok('1 new game: light 10, item 1 costs 10 and sits 5 s; only sit/tap do anything',()=>{const S=fresh();assert.equal(S.light,10);assert.equal(E.sitCost(S),10);assert.equal(E.sitSec(S),5);assert.equal(E.fuseMsFor(S),5*MIN);
 assert.equal(E.buySlot(S),'Need 60 g');assert.equal(E.canSend(S,'nope',{h:1}),'No body');assert.equal(E.tap(S),true);assert.equal(S.light,11);assert.equal(E.sit(S,T),null);assert.equal(S.light,1);assert.equal(S.basement.fuseAt,null);
 const ev=E.advance(S,T+6*SEC);assert.equal(ev[0].k,'wake');const s=Object.values(S.spirits)[0];assert.equal(s.wild,0);assert.equal(E.spOf(S,s),'candle');assert.equal(S.basement.fuseAt,T+5*SEC,'next fuse starts at the wake');
 assert.deepEqual(S.basement.order.slice(0,3),['candle','kokeshi','ladle']);});

ok('1b the scale stretches: item 50 costs 114 light and sits 57 s; its fuse is 23 min',()=>{const S=fresh();S.basement.next=50;assert.equal(E.sitCost(S),114);assert.equal(E.sitSec(S),57);near(E.fuseMsFor(S)/MIN,22.9,0.2);assert.equal(E.wildnessFor(50),80);});

ok('2 wild wakes with nobody home, two at most; a kokeshi settles one at 24/min',()=>{const S=fresh();const c=make(S,'candle'),k=make(S,'kokeshi');assert.equal(E.send(S,T,c.id,{h:1}),null);assert.equal(E.send(S,T,k.id,{h:2}),null);
 E.advance(S,T+6*MIN);let w=E.atHome(S).filter(s=>s.wild>0);assert.equal(w.length,1);assert.equal(w[0].wild,30);assert.equal(S.basement.next,1);
 E.advance(S,T+9*MIN);w=E.atHome(S).filter(s=>s.wild>0);assert.equal(w.length,2,'second woke at 5m+126s');assert.equal(S.basement.fuseAt,null,'fuse paused at two wild');
 assert.equal(E.recall(S,T+9*MIN,k.id),null);assert.equal(E.recall(S,T+9*MIN,c.id),null);E.advance(S,T+10*MIN);near(Math.max(...w.map(x=>x.wild)),31,0.01,'the one closest to tame goes first');near(Math.min(...w.map(x=>x.wild)),6,0.01,'24 a minute');
 const rep=S.rep;E.advance(S,T+10*MIN+16*SEC);assert.equal(Math.min(...w.map(x=>x.wild)),0);assert.equal(S.rep,rep+2);assert.notEqual(S.basement.fuseAt,null,'fuse resumes');});

ok('3a two tier-1 rentals at exact fit: 960 g and 960 rep per 4 h, capped',()=>{const S=fresh();const a=make(S,'chime',{Ember:19}),b=make(S,'chime',{Bloom:19});E.send(S,T,a.id,{h:1});E.send(S,T,b.id,{h:2});
 E.advance(S,T+4*H);near(S.gold,960,0.01);assert.equal(S.rep,960);assert.equal(a.v.Ember,19);E.advance(S,T+24*H);near(S.gold,1920,0.01);assert.equal(S.rep,1920);});

ok('3b candle Ember 10 at the bakery for 4 h: 480 g, Ember 14, 480 rep',()=>{const S=fresh();const c=make(S,'candle');E.send(S,T,c.id,{h:1});E.advance(S,T+4*H);near(S.gold,480,0.01);assert.equal(c.v.Ember,14);assert.equal(S.rep,480);});

ok('4 one band under: warned, 3-minute trip, breaks, loot kept, spirit boxed at Tide 19',()=>{const S=fresh();const l=make(S,'ladle',{Tide:13});const p=E.roadPreview(S,l.id,'river',1);assert.equal(p.ok,true);assert.equal(p.breaks,true);assert.equal(p.sec,180);
 assert.equal(E.send(S,T,l.id,{r:'river',d:1}),null);E.advance(S,T+4*MIN);assert.equal(S.gold,40);assert.equal(l.body,null);assert.equal(l.v.Tide,19);assert.equal(E.outCount(S),0);assert.equal(E.box(S).length,1);});

ok('4b two bands under is refused',()=>{const S=fresh();const l=make(S,'ladle',{Tide:13});assert.equal(E.canSend(S,l.id,{r:'river',d:2}),'Far too deep');});

ok('5 rehouse clamps to the new caps; not while rented',()=>{const S=fresh();const l=make(S,'ladle',{Tide:25});l.body=null;const chime=E.newBody(S,'chime');assert.equal(E.rehouse(S,l.id,chime),null);assert.equal(l.v.Tide,19);assert.equal(l.yokai,'Fūrin-kozō');
 l.v.Frost=10;S.rep=10;assert.equal(E.send(S,T,l.id,{h:3}),null);assert.equal(E.rehouse(S,l.id,E.newBody(S,'bell')),'Not home');assert.equal(E.feed(S,l.id,'Tide'),'Not home');});

ok('6 light: 12/min, ceiling = cost+20; tap refused at the ceiling; a candle home raises it; clamps back',()=>{const S=fresh();E.advance(S,T+MIN);near(S.light,22,0.01);E.advance(S,T+H);assert.equal(S.light,E.lightCeiling(S));assert.equal(E.tap(S),false);
 const c=make(S,'candle');const ceil0=E.lightCeiling(S);assert.equal(E.lightCeiling(S),ceil0);assert.equal(E.lightRate(S),24);E.advance(S,T+2*H);assert.equal(S.light,ceil0);assert.ok(ceil0>=40);E.send(S,T+2*H,c.id,{h:1});E.advance(S,T+2*H+SEC);assert.equal(S.light,E.lightCeiling(S));assert.equal(E.lightCeiling(S),ceil0-10);});

ok('7 clock goes back: timestamps shift, nothing paid',()=>{const S=fresh();const c=make(S,'candle'),l=make(S,'ladle',{Tide:20});E.send(S,T,c.id,{h:1});E.send(S,T,l.id,{r:'river',d:1});
 E.advance(S,T-H);assert.equal(S.gold,0);assert.equal(S.tick,T-H);assert.equal(l.loc.done,T-H+180*SEC);E.advance(S,T-59*MIN);near(S.gold,2,0.01);assert.equal(l.loc.k,'road');});

ok('8 export/import mid-timer keeps the loot and the clock',()=>{const S=fresh();const l=make(S,'ladle',{Tide:20});E.send(S,T,l.id,{r:'river',d:1});E.advance(S,T+60*SEC);const txt=E.exportState(S);
 const S2=E.importState(txt);E.advance(S2,T+100*SEC);const l2=S2.spirits[l.id];assert.equal(l2.loc.k,'road');assert.equal(l2.loc.done-(T+100*SEC),80*SEC);assert.deepEqual(l2.loc.loot,l.loc.loot);assert.equal(S2.gold,0);});

ok('9 sitting just before the fuse: tame wake, next fuse starts at the wake',()=>{const S=fresh();const t0=T+5*MIN-10*SEC;E.advance(S,t0);assert.equal(E.sit(S,t0),null);E.advance(S,T+5*MIN+10*SEC);
 const sp=Object.values(S.spirits);assert.equal(sp.length,1);assert.equal(sp[0].wild,0);assert.equal(S.basement.fuseAt,t0+5*SEC);assert.equal(S.basement.fuseMs,0);});

ok('10 two wild pending at most; paused; resumes after a taming',()=>{const S=fresh();const ev=E.advance(S,T+20*H);const w=ev.filter(e=>e.k==='wild');assert.equal(w.length,2);assert.deepEqual(w.map(e=>e.t),[T+5*MIN,T+5*MIN+126*SEC]);assert.equal(S.basement.fuseAt,null);assert.equal(S.basement.next,2);
 Object.values(S.spirits)[0].wild=0;E.advance(S,T+21*H);assert.equal(S.basement.next,3,'third woke 132 s after the taming');});

ok('11 recall forfeits the half cycle; pay is banked per second',()=>{const S=fresh();const c=make(S,'candle');E.send(S,T,c.id,{h:1});E.advance(S,T+25*SEC);near(S.gold,25*2/60,0.01);assert.equal(E.recall(S,T+25*SEC,c.id),null);
 E.send(S,T+25*SEC,c.id,{h:1});E.advance(S,T+30*SEC);assert.equal(S.rep,0);E.advance(S,T+55*SEC);assert.equal(S.rep,1);near(S.gold,55*2/60,0.01);});

ok('12 market refreshes on the local date, not 24 h',()=>{const S=fresh();const d=new Date(T);const late=new Date(d.getFullYear(),d.getMonth(),d.getDate(),23,59).getTime();const next=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1,0,0).getTime();
 S.market.stock[0].sold=true;const day=S.market.day;E.advance(S,late);assert.equal(S.market.day,day);assert.equal(S.market.stock[0].sold,true);E.advance(S,next);assert.notEqual(S.market.day,day);assert.equal(S.market.stock.every(x=>!x.sold),true);assert.equal(S.market.stock.filter(x=>x.kind==='stray').length,1);});

ok('13 a tamer on the road tames only after it returns (inside the cap)',()=>{const S=fresh();const w=make(S,'teapot');w.wild=60;const t=make(S,'chime');S.basement.next=99;S.basement.fuseAt=null;assert.equal(E.send(S,T,t.id,{r:'pass',d:0}),null);t.loc.done=T+3*H;
 E.advance(S,T+20*H);assert.equal(w.wild,0);const tamed=S.log.filter(x=>/is tame/.test(x.text)).pop();near(tamed.t,T+3*H+5*MIN,SEC,'60 wildness at 12/min');});

ok('14 slots cost 60 then 300',()=>{const S=fresh();S.gold=400;assert.equal(E.buySlot(S),null);assert.equal(S.gold,340);assert.equal(E.buySlot(S),null);assert.equal(S.gold,40);assert.equal(S.slots,4);assert.equal(E.buySlot(S),'Need 1500 g');});

ok('15 fit multipliers and food',()=>{assert.equal(E.fitMult(19,'D'),1);assert.equal(E.fitMult(20,'D'),1.5);assert.equal(E.fitMult(30,'D'),2);assert.equal(E.fitMult(9,'D'),0);
 const S=fresh();const c=make(S,'candle',{Ember:16});assert.equal(E.feedGain(c,'Ember'),6);assert.equal(E.feed(S,c.id,'Ember'),null);assert.equal(c.v.Ember,22);c.v.Ember=29;assert.equal(E.feed(S,c.id,'Ember'),'At the cap');c.v.Ember=35;assert.equal(E.feedGain(c,'Ember'),3);});

ok('16 road wild comes home housed with the depth\'s wildness; growth caps',()=>{const S=fresh();const a=make(S,'ladle',{Tide:25});E.send(S,T,a.id,{r:'river',d:1});a.loc.loot.wild='teapot';a.loc.loot.body=null;a.loc.loot.breaks=false;
 const ev=E.advance(S,T+180*SEC);assert.ok(ev.some(e=>e.k==='wild'&&e.from==='road'));const w=E.atHome(S).filter(s=>s.wild>0);assert.equal(w.length,1);near(w[0].wild,60,0.5,'depth-2 wildness, less one tick of the ladle taming');assert.equal(E.spOf(S,w[0]),'teapot');assert.equal(a.v.Tide,29);});

ok('17 stray at 300 + rep; empty body sells for half; cap upgrade',()=>{const S=fresh();S.gold=1000;const i=S.market.stock.findIndex(x=>x.kind==='stray');assert.equal(S.market.stock[i].price,300);assert.equal(E.buyStock(S,T,i),null);assert.equal(Object.keys(S.spirits).length,1);assert.equal(S.gold,700);
 const b=E.newBody(S,'chime');assert.equal(E.sellBody(S,b),null);assert.equal(S.gold,775);S.gold=1000;assert.equal(E.buyCap(S),null);assert.equal(S.cap,8);});

ok('18 road gold scales with rep/1000, capped ×10',()=>{const S=fresh();S.rep=500;assert.equal(E.roadMult(S),1.5);S.rep=20000;assert.equal(E.roadMult(S),10);const l=make(S,'ladle',{Tide:20});assert.equal(E.roadPreview(S,l.id,'river',0).gold,50);});

console.log(pass,'passed');
