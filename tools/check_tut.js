// Plays the tutorial exactly as the column tells a new player to. Usage: node tools/check_tut.js index.html
const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync(process.argv[2],'utf8').match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
const m={exports:{}};new Function('module',src)(m);const E=m.exports;const G=()=>E.G;
const step=()=>{E.advanceTut();return G().tut};const tabs=()=>[...E.unlockedTabs()].join(',');
E.newGame();
assert.equal(step(),0);assert.equal(tabs(),'front');assert.equal(G().stock.special,'charcoal');assert.ok(E.dealerIn());
assert.deepEqual(G().inv.mold,{candle:1,whisk:1});
const r1=G().requests.find(r=>r.id==='r1');E.accept(r1.uid);assert.equal(step(),1);assert.equal(tabs(),'front,specials');
assert.equal(E.buyMat('charcoal'),null);assert.equal(G().gold,183,'charcoal on special is 17g');assert.equal(step(),1,'still needs the teapot mold');
assert.equal(E.buyMold('teapot'),null);assert.equal(G().gold,148);assert.equal(G().inv.mold.teapot,1);assert.equal(step(),2);assert.equal(tabs(),'front,specials,order');
assert.equal(E.placeOrder('bell',[],[],''),'No Bell mold in stock');
const box=E.boxSpirits()[0];assert.equal(E.placeOrder('teapot',['charcoal'],[],box.id),null);assert.equal(G().lastBorn,E.roster()[0].id,'reveal points at the new creature');assert.equal(E.rename(box.id,'  Kettle '),null);assert.equal(box.name,'Kettle');assert.equal(E.rename(box.id,''),'Give it a name');assert.equal(E.yname(E.roster()[0]),'Kyūsu-bōzu');assert.ok(Object.keys(E.MOLDS).every(m=>E.MOLDS[m].yokai&&E.MOLDS[m].gloss),'every mold names its yokai');assert.equal(G().inv.mold.teapot,0,'mold consumed');assert.equal(step(),3);assert.ok(tabs().includes('roster'));
let v=E.roster()[0];assert.equal(E.gradeOf(E.effVal(v,E.spiritOf(v),'Ember')),'C');
assert.equal(E.deliver(r1.uid,v.id),null);assert.equal(G().rep,3);assert.equal(G().inv.food.honey,1);assert.equal(step(),4);assert.deepEqual(G().unl.cart,['teapot'],'Kōda unlocks the teapot on the cart');assert.equal(G().cust.koda.step,1);
const r4=G().requests.find(r=>r.id==='r4');E.accept(r4.uid);assert.equal(step(),5);
assert.equal(E.placeOrder('whisk',['straw'],[],'shop:0'),null);assert.equal(step(),6);assert.ok(tabs().includes('workshop'));assert.equal(G().gold,213);
assert.equal(E.machines().length,0);
assert.equal(E.buyMold('treadle'),null);assert.equal(G().gold,168);assert.equal(step(),7);
assert.equal(E.placeOrder('treadle',[],[],'shop:0'),null);assert.equal(G().gold,143);assert.equal(E.machines().length,1,'installed');assert.equal(step(),8);
const tr=E.machines()[0];const I=E.stationInfo(tr.id);assert.equal(I.ceil.Pace,19,'treadle spirit has Pace D, so the ceiling is D');assert.equal(I.pts,4);
v=E.roster().find(x=>x.mold==='whisk');const s=E.spiritOf(v);
assert.equal(E.trainPreview(tr.id,tr.id,'Pace').err,'A machine cannot train itself');
assert.equal(E.feed(v.id,'potato'),null);assert.equal(s.v.Pace,15);assert.equal(step(),8);
assert.equal(E.train(tr.id,v.id,'Pace'),null);assert.equal(s.v.Pace,19);assert.equal(step(),9);assert.ok(tabs().includes('travel'));
assert.equal(E.spiritOf(tr).v.Pace,12,'the treadle learns by teaching: +2 Pace');
assert.equal(E.train(tr.id,v.id,'Pace'),'No sessions left today');
assert.equal(E.send(v.id,'river'),null);assert.equal(step(),9,'still step 9 until the trial resolves');
E.nextIssue();assert.ok(G().exped.await);assert.equal(s.v.Pace,23);assert.equal(step(),10);assert.ok(tabs().includes('ledger'));assert.equal(tr.used,0,'sessions reset');assert.ok(!E.dealerIn(),'dealer away on issue 2');
assert.ok(G().stock.molds.some(m=>m.id==='teapot'),'teapot always on the cart now');assert.deepEqual(G().requests.map(r=>r.id).sort(),['r2','r4'],'Umeda entered after one delivery and posted his first rung');
assert.ok(E.scouted('river',0)&&E.scouted('river',1)&&!E.scouted('river',2),'trial 2 scouted after passing trial 1; trial 3 not');
E.returnHome();assert.equal(step(),11);assert.equal(G().inv.mat.cedar,1);
assert.ok(E.fit(r4,v).every(x=>x.ok),'whisk now fits Shiraishi');
assert.equal(E.deliver(r4.uid,v.id),null);assert.equal(step(),12);assert.ok(E.TUT[12].end);assert.equal(r4.due,3,'accepted order never ticked');assert.deepEqual(G().unl.dealer,['hibachi']);
// free decline postpones the rung; the hard rungs are two deliveries away
const r2=G().requests.find(r=>r.id==='r2');E.decline(r2.uid);assert.equal(G().rep,6,'decline is free');assert.equal(G().cust.umeda.step,0);assert.equal(G().cust.umeda.ready,G().issue+E.CONFIG.cooldown);
assert.equal(E.send(E.roster()[0].id,'kiln'),"Opens after Umeda's first commission");assert.equal(E.buyFood('honey'),"Not stocked yet: Mrs. Tokiwa's first commission");
assert.equal(E.fitWith({cons:[['temper','Docile']]},E.roster()[0],null)[0].ok,null,'no spirit: temperament unknown');
// a machine can be sold like anything else: Umeda wants Frost C + holds; an ice chest with iron would do. Here just check fit() accepts a machine vessel.
E.CONFIG.dealerEvery=1;E.nextIssue();assert.ok(E.dealerIn());assert.deepEqual(G().requests.map(r=>r.id),['r3'],'Tokiwa entered after two deliveries; Umeda is on cooldown');assert.ok(G().stock.dealer.some(m=>m.id==='hibachi'),'hibachi always on the dealer cart');
G().inv.mold.icechest=1;G().inv.mat.iron=1;G().stock.spirits[0]={name:'Kin',temper:0,mood:0};assert.equal(E.placeOrder('icechest',['iron'],[],'shop:0'),null);
const ic=E.machines().find(x=>x.mold==='icechest');const rq={cons:[['aff','Frost','C'],['tag','holds']]};assert.ok(E.fit(rq,ic).every(x=>x.ok),'a possessed ice chest with iron meets Frost C + holds');
// mold rewards from expeditions land in the mold inventory
G().inv.mold.ladle=0;G().exped=null;const cand=E.roster()[0];assert.equal(E.send(cand.id,'river'),null);G().exped.step=2;E.spiritOf(cand).v.Brawn=16;E.nextIssue();E.returnHome();assert.equal(G().inv.mold.ladle,1,'ladle mold from the river');
G().tut=-1;assert.equal(E.unlockedTabs(),null);
// old pickle refused, new one round-trips
assert.throws(()=>E.importState(JSON.stringify({CONFIG:{},G:{vessels:{},inv:{mat:{}}}})),/older version/);
const pk=E.exportState();E.newGame();E.importState(pk);assert.equal(G().issue,4);
// wear-in: a machine at its cap makes the dealer bring the tier-two version
const tr2=E.machines().find(x=>x.mold==='treadle');E.spiritOf(tr2).v.Pace=39;assert.ok(E.wornIn(tr2));E.CONFIG.dealerEvery=1;E.nextIssue();assert.ok(G().stock.dealer.some(m=>m.id==='mill'),'mill treadle offered');
G().gold=500;assert.equal(E.buyMold('mill'),null);assert.equal(E.placeOrder('mill',[],[],''),null);const mill=E.machines().find(x=>x.mold==='mill');assert.equal(mill.caps.Pace,49,'tier-two machine caps at A');
E.transferOut(tr2.id);assert.equal(E.possessEmpty(mill.id,E.spiritOf(tr2)?null:Object.values(G().spirits).find(x=>x.v.Pace===39).id),null);assert.equal(E.stationInfo(mill.id).ceil.Pace,39,'keeps its grade: teaches to B in the mill');
// unlocking the kiln through Umeda's rung
G().unl.loc.push('kiln');assert.notEqual(E.send(E.roster()[0].id,'kiln'),"Opens after Umeda's first commission");
console.log('tutorial check: all good. gold',G().gold,'rep',G().rep);
