// Headless click-through of the v0.3 opening at phone width, from file:// so art/ resolves. Usage: node tools/render.js shot.png
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:390,height:844}});p.setDefaultTimeout(8000);const errs=[];
p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|ERR_FAILED|fonts/.test(m.text()))errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));p.on('dialog',d=>d.accept());
await p.goto('file://'+path.resolve(__dirname,'..','index.html'));await p.waitForTimeout(400);
const txt=async s=>(await p.$eval(s,e=>e.textContent.replace(/\s+/g,' ').trim()).catch(()=>'(none)'));
console.log('0 hozuki:',(await txt('.hoz p')).slice(0,70),'| bottom:',await txt('#bottom'));
await p.click('[data-act="descend"]');await p.waitForTimeout(3500);
console.log('1 floor:',await txt('section.box .kick'),'| enemies:',await p.$$eval('.side:nth-child(2) .f',es=>es.length),'| imgs ok:',await p.$$eval('img.pt',es=>es.every(e=>e.naturalWidth>0)));
// hold Pochi, wait for her gauge, tap Flare
await p.click('[data-act="hold"][data-id="pochi"]');await p.waitForSelector('[data-act="fire"][data-id="pochi"]:not([disabled])',{timeout:40000});
console.log('2 ready: Flare button live; pochi gauge full; held =',await p.$eval('[data-act="hold"][data-id="pochi"]',e=>e.textContent));
await p.click('[data-act="fire"][data-id="pochi"]');await p.waitForTimeout(200);console.log('   after tap, gauge bar width:',await p.$eval('#f-pochi .gg i',e=>e.style.width),'| stamp:',await txt('#stamp'));
// focus an enemy if any, then speed up to reach the first tame
const foe=await p.$('.side:nth-child(2) .f[role=button]');if(foe){await foe.click();console.log('3 focus:',await p.$$eval('.f.focus',es=>es.length));}
await p.click('[data-dbg] summary');await p.click('[data-act="speed"]');await p.click('[data-act="speed"]');
for(let i=0;i<40;i++){await p.waitForTimeout(1000);const t=await txt('.pbp');if(/tamed/.test(t))break;}
console.log('4 ledger:',(await txt('.pbp')).slice(0,160));console.log('   shop rows:',await p.$$eval('.line',es=>es.length),'| mast:',await txt('.mast'));
await p.click('[data-act="level"]:not([disabled])').catch(()=>{});console.log('5 level bought? gold:',await txt('.gold'));
await p.click('[data-act="skip"][data-s="28800"]');await p.waitForTimeout(200);console.log('6 away card:',(await txt('.modal')).slice(0,160));await p.click('[data-act="close"]');
console.log('scrollWidth<=390:',await p.evaluate(()=>document.documentElement.scrollWidth<=390),'| height:',await p.evaluate(()=>document.documentElement.scrollHeight));
await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:process.argv[2]||'shot.png'});console.log('errors:',errs);await b.close();})();
