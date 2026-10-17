// Engine checks for Ninety-Nine v0.3 (the descent). Usage: node tools/test.js index.html
const fs=require('fs');const html=fs.readFileSync(process.argv[2]||'index.html','utf8');
const src=html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1];const M={exports:{}};new Function('module','exports',src)(M,M.exports);const E=M.exports;
let n=0,bad=0;const ok=(c,msg)=>{n++;if(!c){bad++;console.log('FAIL',n,msg);}else console.log('ok ',n,msg);};
const play=(S,secs)=>{for(let i=0;i<secs;i++)E.advance(S,S.last+1000);};
const greedy=S=>{let sp=true;while(sp){sp=false;for(const c of E.partyOf(S).sort((a,b)=>a.lv-b.lv)){if(E.levelUp(S,c.id)){sp=true;break;}}}};

// 1 opening
let S=E.newGame(7,0);ok(S.roster.length===2&&S.party.length===2&&S.run.phase==='home','start: Pochi and Momo, at home');
ok(!E.fire(S,'pochi'),'cannot fire outside a fight');
ok(E.descend(S)&&S.run.phase==='walk'&&S.run.floor===1,'descend goes to B1');
play(S,2);ok(S.run.phase==='fight'&&S.F&&S.F.R.length===2&&S.F.R.every(e=>E.SP[e.sp].junk),'B1 pack 1: two junk');
const junkHp=S.F.R[0].max;ok(junkHp<40,'junk is flimsy: hp '+junkHp);
play(S,40);ok(S.run.floor===1&&S.run.enc>=1&&S.gold>0,'first pack cleared inside 40 s, gold '+Math.floor(S.gold));

// 2 charge carries over; hold keeps it
S=E.newGame(7,0);E.descend(S);play(S,2);const p=E.partyOf(S);p[0].hold=true;play(S,30);
ok(p[0].gauge===100,'held gauge sits at 100 across fights');const before=S.F?S.F.R.map(x=>x.hp).join():'';
if(S.run.phase==='fight'){ok(E.fire(S,'pochi')&&p[0].gauge===0,'tap fires Flare and empties the gauge');}else ok(true,'(between fights, skipped tap)');
let W=E.newGame(7,0);E.descend(W);play(W,2);const q=E.partyOf(W);play(W,30);ok(q.every(c=>c.gauge<100||c.hold),'without hold, a full gauge fires by itself');

// 3 taming: the resident joins at its level and fills the line
S=E.newGame(7,0);for(let i=0;i<600&&S.deep<1;i++){greedy(S);if(S.run.phase==='home')E.descend(S);play(S,1);}
ok(S.deep===1&&S.roster.length===3&&S.party.length===3,'B1 resident tamed and joined the line');
const taro=E.byId(S,'r1');ok(taro&&taro.name==='Taro'&&taro.lv===3&&taro.hp===taro.max,'Taro joins at Lv 3 with full hp');

// 4 fall: everyone comes home healed, deepest floor holds
S=E.newGame(7,0);E.descend(S);S.roster.forEach(c=>{c.lv=1;E.restat(c);});S.run.floor=9;play(S,2);play(S,300);
ok(S.run.phase==='home'&&S.stats.falls===1&&E.partyOf(S).every(c=>c.hp===c.max&&!c.down),'a level-1 pair breaks on B9 and comes home whole');

// 5 enemies wind up before a special; Great Toll breaks it
const tollie=E.make({id:'t',name:'Suzu',sp:'chime',aff:'Frost',lv:20});const res=E.make({name:'Kuro',sp:'teapot',aff:'Clay',lv:10,rogue:true});
const F=E.newFight([tollie],[res]);F.rng=E.rngOf(3);res.gauge=100;E.step(F);ok(res.wind>0,'rogue at 100 starts a wind-up instead of casting');
tollie.gauge=100;E.special(F,tollie,'toll',F.L,F.R);ok(res.wind===0&&res.gauge===50,'Great Toll breaks the wind-up and halves its gauge');

// 6 challenge floor
S=E.newGame(7,0);S.deep=4;E.descend(S);play(S,2);ok(S.run.phase==='challenge'&&S.run.need==='light','B5 is a dark passage wanting Light');
play(S,60);ok(S.run.floor===6&&S.deep===5,'passed with Pochi leading');

// 7 offline: farm the deepest floor, bench earns, no healing exploit
S=E.newGame(7,0);S.deep=6;S.roster.push(E.make({id:'x',name:'Ume',sp:'ladle',aff:'Clay',lv:8,floor:6}));
const away=E.advance(S,S.last+9*3600*1000);ok(away&&away.farm>0&&away.bench>0&&away.secs===9*3600,'away 9 h pays farm '+away.farm+' and bench '+away.bench);
const capd=E.newGame(7,0);capd.deep=6;const a8=E.advance(capd,capd.last+8*3600*1000);const c2=E.newGame(7,0);c2.deep=6;const a24=E.advance(c2,c2.last+24*3600*1000);ok(a8.farm===a24.farm,'offline capped at 8 h');
S=E.newGame(7,0);E.descend(S);play(S,2);E.partyOf(S)[0].hp=5;E.advance(S,S.last+120*1000);ok(E.partyOf(S)[0].hp===5&&S.run.phase==='walk','backgrounding for 2 min does not heal; the floor resumes');

// 8 save/load round trip keeps hp, gauge, hold, party order
S=E.newGame(7,0);E.descend(S);play(S,12);E.partyOf(S)[1].hold=true;const j=E.save(S);const L=E.load(j);
ok(L&&L.party.join()===S.party.join()&&E.byId(L,'momo').hold&&Math.abs(E.byId(L,'pochi').hp-E.byId(S,'pochi').hp)<.01&&E.byId(L,'pochi').gauge===E.byId(S,'pochi').gauge,'save/load keeps the line as it was');

// 9 pacing envelope (greedy auto-player): B9 by 10 min, B27 not before 15 min
S=E.newGame(7,0);let t9=null,t27=null;for(let s=0;s<60*60;s++){greedy(S);if(S.run.phase==='home')E.descend(S);play(S,1);if(t9==null&&S.deep>=9)t9=s;if(t27==null&&S.deep>=27)t27=s;}
ok(t9!=null&&t9<600,'first stratum inside 10 min: '+Math.round(t9/60)+' min');ok(t27==null||t27>900,'B27 not before 15 min: '+(t27==null?'not reached in an hour':Math.round(t27/60)+' min'));
ok(S.roster.length===2+S.deep-Math.floor((S.deep+4)/9),'one tame per fight floor: roster '+S.roster.length+' at B'+S.deep);

console.log(bad?bad+' FAILED':n+' passed');process.exit(bad?1:0);
