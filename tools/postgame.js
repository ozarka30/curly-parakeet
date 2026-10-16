// Post-tutorial sampler: what the board looks like after the tutorial. Usage: node tools/postgame.js index.html
const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8').match(/<script id="engine">([\s\S]*?)<\/script>/)[1];
function fresh(){const m={exports:{}};new Function('module',src)(m);return m.exports;}
function playTutorial(E){E.newGame();const G=E.G;const r1=G.requests.find(r=>r.id==='r1');E.accept(r1.uid);E.buyMat('charcoal');E.buyMold('teapot');
 E.placeOrder('teapot',['charcoal'],[],E.boxSpirits()[0].id);E.deliver(r1.uid,E.roster()[0].id);const r4=G.requests.find(r=>r.id==='r4');E.accept(r4.uid);
 E.placeOrder('whisk',['straw'],[],'shop:0');E.buyMold('treadle');E.placeOrder('treadle',[],[],'shop:0');const w=E.roster().find(v=>v.mold==='whisk');const tr=E.machines()[0];
 E.feed(w.id,'potato');E.train(tr.id,w.id,'Pace');E.send(w.id,'river');E.nextIssue();E.returnHome();E.deliver(r4.uid,w.id);return G;}
// which molds could satisfy a request's form/tag constraints at all
const canForm=(E,r,m)=>{const M=E.MOLDS[m];return r.cons.every(([t,k])=>t==='tag'?M.tags.includes(k):t==='size'?(M.size||(M.tier===1?'small':'medium'))===k:true);};
const N=2000;const first={};let holdsIssues=[],anyIssues=[];let cartMatch=0,cartMatchN=0;let hardFirst=0;
for(let i=0;i<N;i++){const E=fresh();const G=playTutorial(E);
 E.nextIssue();const nr=G.requests.find(r=>!['r1','r4'].includes(r.id));const id=nr?nr.id:'none';first[id]=(first[id]||0)+1;if(['r6','r7','r8'].includes(id))hardFirst++;
 // does the cart (this issue) or the shelf offer a mold whose form fits the new request?
 if(nr){cartMatchN++;const offers=[...Object.keys(G.inv.mold).filter(m=>G.inv.mold[m]>0),...G.stock.molds.map(m=>m.id),...G.stock.dealer.map(m=>m.id)];if(offers.some(m=>canForm(E,nr,m)))cartMatch++;}
 // issues until a "holds" creature mold is on the cart, and until any creature mold besides the candle
 let k=0,h=null,a=null;while(k<12&&(h==null||a==null)){const ids=G.stock.molds.map(m=>m.id);if(h==null&&ids.some(m=>E.MOLDS[m].tags.includes('holds')))h=k;if(a==null&&ids.length)a=k;E.nextIssue();k++;}
 holdsIssues.push(h==null?12:h);anyIssues.push(a==null?12:a);}
const pct=x=>Math.round(x/N*100)+'%';
console.log('post-tutorial: gold',(()=>{const E=fresh();return playTutorial(E).gold})(),'rep',(()=>{const E=fresh();return playTutorial(E).rep})());
console.log('first new request:',Object.entries(first).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+pct(v)).join(', '));
console.log('first request is r6/r7/r8 (needs grade B or a quell pair):',pct(hardFirst));
console.log('a mold fitting the new request\'s form is on the shelf or cart that issue:',Math.round(cartMatch/cartMatchN*100)+'%');
const med=a=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];const mean=a=>(a.reduce((s,x)=>s+x,0)/a.length).toFixed(1);
console.log('issues until a HOLDS mold is on the cart: median',med(holdsIssues),'mean',mean(holdsIssues),'| >=4 issues:',pct(holdsIssues.filter(x=>x>=4).length));
// what food alone can do to the candle for Tokiwa (Heart C, Quiet, small) and Noguchi (glows, Wits C)
const E=fresh();const G=playTutorial(E);G.inv.mold.candle=1;G.inv.food.milk=4;G.inv.food.plum=2;G.stock.spirits[0]={name:'T',temper:0,mood:0};E.placeOrder('candle',[],[],'shop:0');const c=E.roster().find(v=>v.mold==='candle');const s=E.spiritOf(c);
for(let i=0;i<4;i++)E.feed(c.id,'milk');console.log('candle + 4 warm milk: Heart',s.v.Heart,'mood',s.mood,'tox',s.tox,'-> Tokiwa',E.fit({cons:[['stat','Heart','C'],['mood','Quiet'],['size','small']]},c).every(x=>x.ok));
for(let i=0;i<2;i++)E.feed(c.id,'plum');console.log('then + 2 plum: Wits',s.v.Wits,'tox',s.tox,'-> Noguchi',E.fit({cons:[['tag','glows'],['stat','Wits','C']]},c).every(x=>x.ok));
// board at issue 3 under ladders: how often does it hold a grade-B request?
const hard=id=>{const R=E0.REQ[id];return !!R&&R.cons.some(c=>(c[0]==='aff'||c[0]==='stat')&&'BAS'.includes(c[2]));};const E0=fresh();
let hardBoard=0,boards={};for(let i=0;i<N;i++){const E=fresh();const G=playTutorial(E);E.nextIssue();const ids=G.requests.map(r=>r.id).sort().join('+');boards[ids]=(boards[ids]||0)+1;if(G.requests.some(r=>hard(r.id)))hardBoard++;}
console.log('board at issue 3 holds a grade-B request:',pct(hardBoard));console.log('boards:',Object.entries(boards).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>k+' '+pct(v)).join(', '));
// how many issues until the first grade-B rung can appear, playing every rung the issue it lands (optimistic)
let firstHard=[];for(let i=0;i<200;i++){const E=fresh();const G=playTutorial(E);let k=0,h=null;while(k<30&&h==null){E.nextIssue();k++;for(const r of G.requests.slice()){if(hard(r.id)){h=G.issue;break;}G.deliveries++;G.cust[r.c].step++;G.cust[r.c].ready=G.issue+E.CONFIG.cooldown;G.requests=G.requests.filter(q=>q!==r);G.done[r.id]=G.issue;}}firstHard.push(h||99);}
console.log('earliest issue a grade-B rung can post if you clear every rung instantly: median',med(firstHard));
