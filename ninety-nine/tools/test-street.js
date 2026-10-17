// v0.2 engine checks (SPEC-v0.2 §8). Usage: node tools/test.js index.html
const fs=require('fs'),assert=require('assert');
const file=process.argv[2]||'index.html';let src=fs.readFileSync(file,'utf8');
if(file.endsWith('.html'))src=src.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m={exports:{}};new Function('module',src)(m);const E=m.exports;const {SEC,MIN,H}=E;
const T0=Date.UTC(2026,9,16,12,0,0);
const fresh=()=>{const S=E.newGame(7,T0);S.basement.next=99;S.basement.fuseAt=null;return S;};// no basement noise unless a test wants it
const mk=(S,sp,aff,v,count)=>{const T=E.newKind(S,sp,aff,0,T0);Object.assign(E.orig(S,T).v,v||{});T.count=count||1;return T;};
const near=(a,b,eps,msg)=>assert.ok(Math.abs(a-b)<=eps,(msg||'')+' '+a+' vs '+b);
let pass=0;const ok=(name,f)=>{try{f();pass++;console.log('ok ',name);}catch(e){console.log('FAIL',name,'\n   ',e.message);process.exitCode=1;}};

ok('1 founding at the bench: material, light, favoured cap',()=>{const S=fresh();S.light=30;S.gold=20;const b=E.newBody(S,'candle');
 assert.equal(E.matPrice(S,'Frost'),0,'first use of a material is free');const tid=E.found(S,T0,b,'Frost');const T=S.kinds[tid];assert.equal(T.sp,'candle');assert.equal(T.aff,'Frost');assert.equal(T.count,1);assert.equal(E.orig(S,T).v.Frost,10);assert.equal(S.light,20);assert.equal(S.gold,20);assert.equal(S.mats.Frost,1);assert.equal(E.shelf(S).length,0);
 assert.equal(E.caps('candle').Frost,19,'not favoured: caps D');assert.equal(E.caps('candle').Ember,29,'favoured: caps C');assert.equal(E.matPrice(S,'Frost'),4);S.mats.Frost=9;assert.equal(E.matPrice(S,'Frost'),8);});

ok('1b the first item\'s wax is free; so is the first straw; the second wax is not',()=>{const S=E.newGame(7,T0);assert.equal(E.matPrice(S,'Ember'),0);assert.equal(E.matPrice(S,'Bloom'),0);assert.equal(E.sit(S,T0,{found:{aff:'Ember'}}),null);assert.equal(S.gold,0);assert.equal(S.light,0);
 E.advance(S,T0+6*SEC);const T=E.kinds(S)[0];assert.equal(T.sp,'candle');assert.equal(T.aff,'Ember');assert.equal(E.matPrice(S,'Ember'),4,'free only once');});

ok('2 joining: same shape, 10 light; wrong shape refused',()=>{const S=fresh();S.light=30;const T=mk(S,'candle','Ember');const c=E.newBody(S,'candle'),ch=E.newBody(S,'chime');
 assert.equal(E.join(S,T0,c,T.id),null);assert.equal(T.count,2);assert.equal(S.light,20);assert.equal(S.bodies[c],undefined);assert.equal(E.join(S,T0,ch,T.id),'Not the same shape');S.light=5;assert.equal(E.join(S,T0,E.newBody(S,'candle'),T.id),'Need 10 light');});

ok('3 sitting with a join plan grows the kind; a fuse wake ignores the plan and is wild',()=>{const S=E.newGame(7,T0);const T=mk(S,'candle','Ember');assert.equal(E.sit(S,T0,{join:T.id}),null);const ev=E.advance(S,T0+6*SEC);
 assert.equal(T.count,2);assert.equal(ev.some(e=>e.k==='join'),true);assert.equal(E.kinds(S).length,1);assert.equal(S.basement.fuseAt,T0+5*SEC);
 E.advance(S,T0+20*H);const w=E.kinds(S).filter(K=>E.isWild(S,K));assert.equal(w.length,2,'two wild one-member kinds, then the fuse pauses');assert.ok(w.every(K=>K.count===1&&E.AFF.includes(K.aff)));});

ok('4 output: favoured, fed from above (dynamic), quelled from a neighbour',()=>{const S=fresh();S.rep=10;const a=mk(S,'ladle','Tide',{Tide:10},1),b=mk(S,'whisk','Bloom',{Bloom:20},7),c=mk(S,'teapot','Clay',{Clay:10},1);
 assert.equal(E.assign(S,T0,a.id,1),null);assert.equal(E.assign(S,T0,b.id,2),null);assert.equal(E.assign(S,T0,c.id,3),null);
 const bb=E.breakdown(S,b,2);// bakery: rate 2 × 7 units × fit 1.5 (Bloom C vs D) × fav 1 (bakery favours Ember) × fed: Tide above feeds Bloom, 1 unit above / 7 here → 1+0.5·(1/7)
 near(bb.fed,1+0.5/7,1e-9);assert.equal(bb.fav,1);assert.equal(bb.fit,1.5);near(bb.rate,2*7*1.5*(1+0.5/7),1e-9);
 const bc=E.breakdown(S,c,3);// fish stall: Clay teapot, quelled by Bloom above → 0.75; fed? Bloom does not feed Clay
 assert.equal(bc.quell,0.75);assert.equal(bc.fed,1);near(bc.sweep,0.21,1e-9,'the whisk above sweeps');near(bc.steam,0.02,1e-9);near(bc.rate,2.4*0.75*1.21*1.02,1e-9);
 const ba=E.breakdown(S,a,1);assert.equal(ba.fav,1);assert.equal(ba.quell,1);near(ba.rate,2*1.21,1e-9,'swept by the whisk below');
 E.advance(S,T0+60*SEC);near(S.gold,ba.rate+bb.rate+bc.rate,0.01,'one minute of the street');});

ok('5 Toll and Sweep stack while housed, not from home; Steam is own-house',()=>{const S=fresh();S.rep=10;const a=mk(S,'ladle','Tide',{Tide:10},1),ch=mk(S,'chime','Frost',{Frost:10},10),w=mk(S,'whisk','Clay',{Clay:10},5);
 E.assign(S,T0,a.id,1);E.assign(S,T0,ch.id,2);E.assign(S,T0,w.id,3);
 near(E.tollPct(S),0.10,1e-9);near(E.sweepPct(S,2),0.15,1e-9,'whisk at 3 sweeps house 2');near(E.sweepPct(S,1),0,1e-9);
 const ba=E.breakdown(S,a,1);near(ba.rate,2*1*1*1*1*1*(1.10)*(1),1e-9,'ladle gets Toll only');// chime at 2 quells? Frost quells Bloom, not Tide
 const bch=E.breakdown(S,ch,2);near(bch.rate,2*10*1*1*1*2*(1.10)*(1.15),1e-9,'10 units → milestone ×2, own Toll, swept from 3');
 E.unassign(S,T0,w.id);near(E.sweepPct(S,2),0,1e-9,'home whisks sweep nothing');E.unassign(S,T0,ch.id);near(E.tollPct(S),0,1e-9);
 const tp=mk(S,'teapot','Clay',{Clay:10},5);E.assign(S,T0,tp.id,3);near(E.steamPct(S,tp),0.10,1e-9);near(E.breakdown(S,tp,3).rate,2.4*5*1*1*1*1*1*1*1.10,1e-9);});

ok('6 milestones double at 10 and 25',()=>{assert.equal(E.mile(9),1);assert.equal(E.mile(10),2);assert.equal(E.mile(25),4);assert.equal(E.mile(200),32);});

ok('7 original on the road: family earns at count−1, light still counts her',()=>{const S=fresh();const c=mk(S,'candle','Ember',{Ember:10,Tide:10},4);E.assign(S,T0,c.id,2);
 near(E.houseRate(S,c),12,1e-9,'2 × 4 × favoured 1.5');assert.equal(E.lightRate(S),6+8);assert.equal(E.send(S,T0,c.id,'river',0),null);near(E.houseRate(S,c),9,1e-9);assert.equal(E.lightRate(S),14,'she shines on the road');
 E.advance(S,T0+20*SEC);assert.equal(E.orig(S,c).loc.k,'home');near(S.gold,9*20/60+5,0.1);near(E.houseRate(S,c),12,1e-9);});

ok('8 break: unhoused original keeps the grade; family works on; borrow or rehouse',()=>{const S=fresh();const l=mk(S,'ladle','Tide',{Tide:13},3);E.assign(S,T0,l.id,1);assert.equal(E.send(S,T0,l.id,'river',1),null);
 E.advance(S,T0+200*SEC);const o=E.orig(S,l);assert.equal(o.body,null);assert.equal(o.v.Tide,19);assert.equal(l.count,3);assert.equal(E.units(S,l),2);near(E.houseRate(S,l),4,1e-9);
 assert.equal(E.rehouse(S,T0,l.id,E.newBody(S,'chime')),'Not the same shape');assert.equal(E.borrow(S,T0,l.id),null);assert.equal(l.count,2);assert.ok(o.body);near(E.houseRate(S,l),4,1e-9);});

ok('9 a lone tame creature joins a kind by name; the roll remembers her',()=>{const S=fresh();const a=mk(S,'candle','Ember',{Ember:20},2),b=mk(S,'candle','Ember'),c=mk(S,'candle','Frost'),d=mk(S,'candle','Ember');E.orig(S,d).wild=20;
 const nm=E.orig(S,b).name;assert.equal(E.merge(S,T0,b.id,a.id),null);assert.equal(a.count,3);assert.deepEqual(a.roll,[nm]);assert.equal(S.kinds[b.id],undefined);assert.equal(E.orig(S,a).v.Ember,20,'grade kept');
 assert.equal(E.merge(S,T0,c.id,a.id),'Different affinity');assert.equal(E.merge(S,T0,d.id,a.id),'Wild');});

ok('10 scrapyard: 1.10 curve per shape, the free candle, tier 2 gated, sell = half',()=>{const S=fresh();S.gold=1000;assert.equal(E.scrapPrice(S,'candle'),0);assert.equal(E.buyScrap(S,'candle'),null);assert.equal(S.gold,1000);assert.equal(E.scrapPrice(S,'candle'),10);
 E.buyScrap(S,'candle');assert.equal(E.scrapPrice(S,'candle'),11);E.buyScrap(S,'candle');assert.equal(E.scrapPrice(S,'candle'),12);assert.equal(E.scrapPrice(S,'chime'),25);assert.equal(E.scrapPrice(S,'lantern'),null);S.rep=100;assert.equal(E.scrapPrice(S,'lantern'),1000);
 const b=E.shelf(S)[0];const g=S.gold;assert.equal(E.sellBody(S,b),null);assert.equal(S.gold,g+6,'half of 12');});

ok('11 awaken another: body price + 10 light, count up',()=>{const S=fresh();S.gold=100;S.light=25;const c=mk(S,'candle','Ember');assert.equal(E.awaken(S,T0,c.id),null);assert.equal(c.count,2);assert.equal(S.gold,100,'first candle free');assert.equal(S.light,15);
 assert.equal(E.awaken(S,T0,c.id),null);assert.equal(S.gold,90);assert.equal(S.light,5);assert.equal(E.awaken(S,T0,c.id),'Need 10 light');});

ok('12 light: 6/min + 2 per Light unit; ceiling = sit cost + 100 + 2/unit; taps give 2',()=>{const S=fresh();assert.equal(E.lightRate(S),6);assert.equal(E.lightCeiling(S),100);const c=mk(S,'candle','Ember',{},10);assert.equal(E.lightRate(S),26);assert.equal(E.lightCeiling(S),120);
 const l=mk(S,'lantern','Ember',{},3);assert.equal(E.lightRate(S),26+12);S.light=119;assert.equal(E.tap(S),true);assert.equal(S.light,121,'tap +2 (lantern units raise the ceiling to 126)');S.light=126;assert.equal(E.tap(S),false);});

ok('13 assign swaps; refuses wild, locked, unfit',()=>{const S=fresh();S.rep=10;const a=mk(S,'candle','Ember'),b=mk(S,'whisk','Bloom'),c=mk(S,'ladle','Tide'),w=mk(S,'chime','Frost'),d=mk(S,'teapot','Clay',{Clay:10});E.orig(S,w).wild=30;
 E.assign(S,T0,a.id,1);E.assign(S,T0,b.id,2);E.advance(S,T0+25*SEC);assert.equal(E.assign(S,T0+25*SEC,b.id,1),null);assert.equal(b.post.h,1);assert.equal(a.post.h,2,'swapped');assert.equal(b.post.sec,0);
 assert.equal(E.assign(S,T0,c.id,1),null);assert.equal(b.post,null,'displaced home when the vacated house is none');assert.equal(E.assign(S,T0,w.id,3),'Wild');assert.equal(E.assign(S,T0,d.id,4),'Opens at rep 100');S.rep=100;assert.equal(E.assign(S,T0,d.id,4),'Needs Clay C');});

ok('14 Comfort tames at home (×2) and adds rep at a house per 5 units',()=>{const S=fresh();const k=mk(S,'kokeshi','Bloom',{Bloom:10},3),w=mk(S,'teapot','Clay');E.orig(S,w).wild=48;
 assert.equal(E.tameRateHome(S),24,'one kokeshi kind at home: 12 × 2');E.advance(S,T0+2*MIN);assert.equal(E.orig(S,w).wild,0);assert.equal(S.rep,2);
 E.assign(S,T0,k.id,1);const rep=S.rep;E.advance(S,T0+2*MIN+30*SEC);assert.equal(S.rep,rep+1+1,'crep 1 + ceil(3/5)=1');});

ok('15 food price scales with the family; cap price with income',()=>{const S=fresh();const c=mk(S,'candle','Ember',{Ember:16},25);assert.equal(E.foodPrice(c),36);const i=S.market.stock.findIndex(x=>x.kind==='food');S.market.stock[i].a='Ember';S.gold=100;
 assert.equal(E.feed(S,T0,i,c.id),null);assert.equal(E.orig(S,c).v.Ember,22);assert.equal(S.gold,64);assert.equal(E.capUp(S).price,500,'floor');E.assign(S,T0,c.id,2);assert.ok(E.rentalRate(S)>50);assert.equal(E.capUp(S).price,Math.round(120*E.rentalRate(S)));});

ok('16 offline: 4 h of a 7-strong family, capped',()=>{const S=fresh();const c=mk(S,'candle','Ember',{Ember:29},7);E.assign(S,T0,c.id,2);const r=E.houseRate(S,c);near(r,2*7*1.5*1.5,1e-9,'fit × favoured');E.advance(S,T0+4*H);near(S.gold,r*240,0.5);assert.equal(S.rep,480);E.advance(S,T0+24*H);near(S.gold,2*r*240,1);});

ok('17 roads: Carry shortens and fattens; wild finds arrive as kinds',()=>{const S=fresh();const l=mk(S,'ladle','Tide',{Tide:25},5);const p=E.roadPreview(S,l.id,'river',1);assert.equal(p.sec,Math.round(180/1.1));assert.equal(p.gold,Math.floor(40*1.15));
 assert.equal(E.send(S,T0,l.id,'river',1),null);E.orig(S,l).loc.loot.wild='teapot';E.orig(S,l).loc.loot.breaks=false;E.advance(S,T0+p.sec*SEC);const w=E.kinds(S).find(K=>K.sp==='teapot');assert.ok(w&&E.isWild(S,w));assert.equal(w.count,1);});

console.log(pass,'passed');
