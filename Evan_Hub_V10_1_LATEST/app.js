'use strict';
/* ================= Evan's Hub V10 ================= */
const KEY='evanHubV10', SUIT='2027-01-25', WEDDING='2027-07-01';
const GYM=['Upper A','Lower A','Upper B','Pull'];
const TYPES=[...GYM,'Cardio','Walk'];          // plan options (Match is added via the match button)
const SHIFT={D:'Day 7am–7pm',N:'Night 7pm–7am',O:'Off'};
const WINDOW={D:'5:00am before shift',N:'After sleep, before shift',O:'Any time',R:'After sleep'};
const TARGET={gym:4,cardio:3};
const isStarter=ws=>ws===weekStart(S.start)&&ws<S.start;
const targetsFor=ws=>{if(!isStarter(ws))return TARGET;const n=diffDays(addDays(ws,6),S.start)+1;return {gym:Math.max(1,Math.round(TARGET.gym*n/7)),cardio:Math.max(1,Math.round(TARGET.cardio*n/7))}};
const SKIP_REASONS=['Too tired','Slept badly','Work ran over','Didn’t prep / no food','Match took over','Sick or injured','Family / life','Just didn’t feel like it'];
const KEPT=['done','short','minimum'];
/* PT programme – all 4 days checked against 'Workout lower.pdf'. [name, sets, reps, PT note, section] */
const W={
'Upper A':[
['Chest Supported DB Lateral Raise',2,'8–12','Pick load to stay within the rep range for all sets. Bench at about 60°. Let the shoulder girdle elevate naturally as the upper arm moves away from the body. Note the rep range change on the working sets.','Warm up'],
['60 Degree DB Shoulder Press',2,'6–9 + 10–12','Bench at 60° – targeting the front (clavicular) fibres. Focus on contracting out of the lengthened position with maximum accuracy.'],
['Gym Shop Machine Chest Press',2,'8–12','Lock shoulder blades down into the pad; bring the upper arm in line with the mid-pec fibres.'],
['Standing Machine Lateral Raise',2,'8–12 + 12–15','Set plate height so hands line up with the handles. Soft knees, slight lean forward, drive arms out to the side, hold 1 second at the top, control the lowering.'],
['Prime Lat Pulldown',2,'8–12','Set plates on the peg that challenges you most (Peg 1 = lengthened, Peg 2 = mid, Peg 3 = shortened range). Lock into the knee pads, brace, sternum up the whole time.'],
['Seated Machine Row',2,'10–12','Don’t bend or twist the spine – keep it neutral. When your spine position changes AND you can’t reach full shoulder extension/retraction, end the set.'],
['Dual Cable Bicep Curl',3,'8–12','Straight sets – adjust load to stay in range and build volume over time. Upper arm vertical, shoulder pulled back; keep the upper arm back as you curl. Single or dual arm. SET 3 = rest-pause to 20 total reps within 3 failure points (e.g. 12-5-3). Hit all 20 → increase the load.'],
['Long Rope Cable Tricep Extension',3,'10–14','Joint alignment is key: extend at the elbow with the shoulder locked down and back; cable runs in line with the upper arm. Loop hand inside a D-handle or use a cuff.'],
['Floor V Sit Up',3,'15–20','On a bench or the floor: brace hard, breathe all out, tuck knees to chest.','Cool down']],
'Lower A':[
['Lower Body Activation Stretch',1,'10–15','Good posture, control breathing, hold and move from one activation to the next. (No rest.)','Warm up'],
['Machine Adduction',2,'12–14','Assess your active range of hip abduction first, then set the machine within that range before the working set.'],
['Pantetta Plate Loaded Seated Leg Curl',2,'8–12','Knees in line with the machine’s pivot. High-intention set – full focus on hamstrings. Thighs locked under the pad, hips locked into the seat. Squeeze hamstrings for 1 second every rep.'],
['Machine Glute Drive 3',2,'8–12','Mind your active range. Set the pad so the knee can hinge; heels locked into the foot plate. Slow lowering, drive up through hamstrings, squeeze glutes at the top.'],
['Hack Squat',2,'8–12','Be meticulous with execution. Feet as quad-dominant as your knee and ankle range allow.'],
['Rear Foot Elevated Split Squat',2,'8–12','Set range so the front leg is at 90° in the bottom position, back leg elevated.'],
['Leg Extension',2,'10–12','High-intention sets – full focus on quads. Hold 1 second and squeeze at the top every rep. Knees in line with the pivot. Use wrist straps on the handles if possible to keep hips down.'],
['Seated Calf Raise',3,'12–15','Never let load compromise the contraction. Keep ankles aligned and contract hard at the top.'],
['Cable Crunch',3,'10–15','Cable high, rope, hips fixed. Brace hard first, then crunch elbows down to knees.','Cool down']],
'Upper B':[
['Pull Ups',2,'AMRAP','Core braced, glutes on to stabilise the full body. Hands just outside shoulder width. Pull up focusing on driving elbows down and back into your back pockets. Chin above the bar; control the lowering.','Warm up'],
['Hammer Strength Incline Chest Press',2,'8–10 + 12–14','Handles at upper-chest level. Align wrist and elbow for good joint integrity. Control the lowering, pause, then press, keeping chest up and bracing through feet, core and the back seat.'],
['Gym Leco Decline Chest Press',2,'8–10','Line handles up with upper-to-mid chest. Drive feet into the floor and brace hard. Use the foot plate to unrack; focus on tempo and contracting hard.'],
['Standing DB Lateral Raise',3,'10–12','Shoulder blades in slight internal rotation (scaption position). Keep tension on the delts 100% of the time – think lifting out wide. Core braced throughout.'],
['U Bar Pulldown',2,'8–12','Lock knees under the pad, keep the upper back up and core braced. Think of pulling down and putting your elbows into your pockets. Keep good shoulder position.'],
['Primal Underhand Bilateral Lat Row',2,'8–12','Machine goes low to high: set the seat so your shoulders stay neutral and don’t get pulled up. Drive the elbow towards the hip. Set the chest pad so you get a full stretch without the weights stacking. Full range, elbow into your pocket. Proud chest, neutral spine, brace into the foot plate, control both directions.'],
['Machine Preacher Curls',3,'8–12','Adjust load to stay in the rep range; build volume gradually over time. Hard at the top (shortened position) with upper arms fixed just in front of the torso. Dumbbell version is fine if it suits your joints better, or swap for a single-arm cable/machine crucifix curl.'],
['Overhead Tricep Extension',3,'10–12','Stretched-position challenge for triceps, keeping the shoulder stable. Start within your active range – you may need a spotter to pass you the load. Wrist, elbow and shoulder in line.'],
['AB Rollouts',3,'10–15','Ab roller: brace core and glutes hard. Roll out and extend slowly. Pause, then think of scooping the floor as you pull back. Neutral spine; never lose the tension or the brace.','Cool down']],
'Pull':[
['Chin Ups',2,'8–12','Core braced, glutes on to stabilise. Hands just shoulder width, palms facing you. Drive elbows down and back into your back pockets. Chin above the bar; control the lowering.','Warm up'],
['Bilateral Machine Pullover',2,'8–12','Torso as upright as comfortable – don’t lean back too much. Shoulder blades and arms move together: depress the shoulder blades as you drive the arms down. Centre weight over the working side’s hip and crunch down towards that side. Don’t overestimate the load – total control, no sloppy reps.'],
['Granite Row',2,'8–12','Seat height in line with the machine’s pulling path. Wrist and elbow in line, shoulders neutral. Torso upright, keep posture, brace against the chest pad.'],
['Primal Bilateral Low Row',2,'8–10 + 12–14','Row goes low to high. Set the seat so the shoulder blades don’t lift too much as you drive. Drive the elbow from low all the way to your pocket. Set the chest pad to your arm length so the weights don’t stack at full stretch. Brace into the floor and chest pad, neutral upper back, control both directions. Pause 1 second fully stretched and 1 second fully squeezed.'],
['Hex Bar Deadlift',2,'8–10','Feet shoulder-width apart. Brace the upper back, create full-body tension and drive your feet through the floor as you lift.'],
['Machine Glute Drive 3',2,'10–12','Mind your active range. Set the pad so the knee can hinge; heels locked into the foot plate. Slow lowering, drive up through hamstrings, squeeze glutes at the top.'],
['Seated Full Rotation Bicep Curls',3,'8–12','Seated, core braced, sit tall. Start palms facing in (neutral), curl up fully and rotate until your little finger faces your bicep. Control is key.'],
['EZ Bar Cable Tricep Pushdown',3,'10–15','EZ or straight bar. Elbows slightly in front of the torso; don’t let the shoulder move – only the elbow bends and straightens.'],
['Decline Bench Crunch',3,'12–15','Set the decline you want and lock feet in. Lower your spine in a rounded motion, one vertebra at a time onto the pad. Brace, then curl up one vertebra at a time, breathing out and squeezing your abs. Reverse slowly. Pause fully stretched, re-brace and go again.','Cool down']]
};
const restFor=n=>n==='Lower Body Activation Stretch'?0:60;

/* ---------- dates ---------- */
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const today=()=>iso(new Date());
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const diffDays=(a,b)=>Math.round((parse(a)-parse(b))/864e5);
const fmt=(s,o={weekday:'short',day:'numeric',month:'short'})=>parse(s).toLocaleDateString('en-IE',o);
const mod=(n,m)=>((n%m)+m)%m;
const weekStart=d=>addDays(d,-mod(parse(d).getDay()-1,7));     // Monday
const weekDays=ws=>Array.from({length:7},(_,i)=>addDays(ws,i));
const range=(a,b)=>{const o=[];for(let d=a;d<=b;d=addDays(d,1))o.push(d);return o};
const n0=v=>Math.round(+v||0).toLocaleString('en-IE');
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

/* ---------- state ---------- */
const blank={v:10,start:'',day1:'2026-11-20',pattern:'DDNNOOOO',shiftOverride:{'2026-11-14':'N','2026-11-15':'N'},
 why:'',tiredRule:'If I’m tired, I still go and do the short version. Showing up is the win.',reward:'',
 baseline:{date:'2026-11-14',kg:112},goalKg:'',heightCm:178,eventKg:{suit:'',wedding:''},
 events:[{id:'suit',name:'Suit fitting',date:'2027-01-25',kg:'',icon:'🤵'},{id:'wedding',name:'Wedding',date:'2027-07-01',kg:'',icon:'💍'}],
 targets:{train:2250,rest:1800,protein:180,water:3000,steps:8000},monthGoals:{},
 weeks:{},logs:[],matches:[],checkins:{},daily:{},health:{},swapMemory:{},syncToken:'',draft:null,rest:null,gymNext:0};
let S;
try{S=Object.assign(structuredClone(blank),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S=structuredClone(blank)}
if(!S.start)S.start=today();
if(S.eventKg&&(S.eventKg.suit||S.eventKg.wedding)){S.events.forEach(e=>{if(S.eventKg[e.id]&&!e.kg)e.kg=S.eventKg[e.id]});S.eventKg={suit:'',wedding:''}}
const events=()=>[...S.events].sort((a,b)=>a.date.localeCompare(b.date));
const nextEvent=()=>events().find(e=>e.date>=today());
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let tab='today',planWeek=0,timerInt=null;

/* ---------- rota ---------- */
const cycleIdx=d=>mod(diffDays(d,S.day1),8);
const shiftOf=d=>S.shiftOverride[d]||S.pattern[cycleIdx(d)];
const afterNights=d=>shiftOf(d)==='O'&&shiftOf(addDays(d,-1))==='N';
const shiftLabel=d=>afterNights(d)?'Off – after nights':SHIFT[shiftOf(d)];
const winFor=d=>afterNights(d)?WINDOW.R:WINDOW[shiftOf(d)];

/* ---------- matches ---------- */
const matchesOn=d=>S.matches.filter(m=>m.date===d);

/* ---------- weekly plan ---------- */
function defaultWeek(ws){
 const days=weekDays(ws),items=[],mDays=new Set(S.matches.filter(m=>m.date>=ws&&m.date<=days[6]).map(m=>m.date));
 const score=d=>mDays.has(d)?-9:shiftOf(d)==='O'&&!afterNights(d)?4:shiftOf(d)==='D'?3:2;
 const cand=days.filter(d=>d>=S.start&&d>=today());
 const TG=targetsFor(ws);
 const gymDays=[...cand].sort((a,b)=>score(b)-score(a)||a.localeCompare(b)).filter(d=>!mDays.has(d)).slice(0,TG.gym).sort();
 // order gym sessions; avoid Lower A / Pull the day before a match
 let order=Array.from({length:gymDays.length},(_,i)=>GYM[(S.gymNext+i)%4]);
 gymDays.forEach((d,i)=>{if(mDays.has(addDays(d,1))&&['Lower A','Pull'].includes(order[i])){const j=order.findIndex((s,k)=>k!==i&&!['Lower A','Pull'].includes(s)&&!mDays.has(addDays(gymDays[k],1)));if(j>=0)[order[i],order[j]]=[order[j],order[i]]}});
 gymDays.forEach((d,i)=>items.push({id:uid(),date:d,s:order[i]}));
 const cardioNeed=Math.max(0,TG.cardio-mDays.size);
 const free=cand.filter(d=>!gymDays.includes(d)&&!mDays.has(d)&&!mDays.has(addDays(d,-1))).sort((a,b)=>score(b)-score(a)||a.localeCompare(b));
 let left=cardioNeed;free.slice(0,left).forEach(d=>{items.push({id:uid(),date:d,s:'Cardio'});left--});
 for(const d of gymDays){if(left<=0)break;items.push({id:uid(),date:d,s:'Cardio'});left--}
 mDays.forEach(d=>{const nx=addDays(d,1);if(nx<=days[6]&&!items.some(i=>i.date===nx))items.push({id:uid(),date:nx,s:'Walk'})});
 return items.sort((a,b)=>a.date.localeCompare(b.date));
}
function week(ws){if(!S.weeks[ws]){S.weeks[ws]={items:defaultWeek(ws),committed:null,moves:0,changes:0};save()}return S.weeks[ws]}
const itemsOn=d=>week(weekStart(d)).items.filter(i=>i.date===d);
const logFor=item=>S.logs.find(l=>l.planId===item.id);
function itemStatus(it){const l=logFor(it);if(l)return l.status;if(it.date<S.start)return 'none';return it.date<today()?'missed':'pending'}
const isGymLog=l=>GYM.includes(l.session)&&['done','short'].includes(l.status);
const isCardioLog=l=>(l.kind==='cardio'||l.kind==='match'||l.status==='minimum')&&KEPT.includes(l.status);
function weekStats(ws){
 const days=weekDays(ws),logs=S.logs.filter(l=>l.date>=ws&&l.date<=days[6]);
 const gym=logs.filter(isGymLog).length,cardio=logs.filter(isCardioLog).length,matches=logs.filter(l=>l.kind==='match').length;
 const items=week(ws).items,its=items.map(itemStatus);
 const planned=its.filter(s=>s!=='none'&&s!=='pending'&&s!=='excused').length,kept=its.filter(s=>KEPT.includes(s)).length;
 const reasons={};logs.forEach(l=>{if(l.reason)reasons[l.reason]=(reasons[l.reason]||0)+1});
 const steps=days.map(stepsOn).filter(v=>v!==null),water=days.map(d=>(S.daily[d]||{}).water).filter(v=>v);
 const TG=targetsFor(ws);
 return {tg:TG,starter:isStarter(ws),gym,cardio,matches,hit:gym>=TG.gym&&cardio>=TG.cardio,pct:planned?Math.round(kept/planned*100):null,kept,planned,
  missed:its.filter(s=>s==='missed').length,skipped:its.filter(s=>s==='skipped').length,reasons,moves:week(ws).moves,changes:week(ws).changes,
  steps:steps.reduce((a,b)=>a+b,0),stepDays:steps.length,waterAvg:water.length?water.reduce((a,b)=>a+b,0)/water.length:0,late:logs.filter(l=>l.late).length};
}
function weeklyStreak(){let n=0;for(let ws=addDays(weekStart(today()),-7);ws>=weekStart(S.start);ws=addDays(ws,-7)){if(weekStats(ws).hit)n++;else break}return n+(weekStats(weekStart(today())).hit?1:0)}
function missRun(){
 const its=[];for(let i=1;i<=14;i++){const d=addDays(today(),-i);if(d<S.start)break;its.push(...itemsOn(d).reverse())}
 let r=0;for(const it of its){const s=itemStatus(it);if(s==='excused'||s==='none')continue;if(s==='missed'||s==='skipped'){r++;continue}break}return r;
}

/* ---------- daily essentials ---------- */
const day=d=>S.daily[d]||(S.daily[d]={});
function stepsOn(d){const h=S.health[d];if(h&&h.steps!=null)return +h.steps;const m=(S.daily[d]||{}).steps;return m!=null&&m!==''?+m:null}
function isTrainDay(d){return itemsOn(d).some(i=>GYM.includes(i.s))||S.logs.some(l=>l.date===d&&GYM.includes(l.session))}

/* ---------- monthly steps challenge ---------- */
function monthInfo(d=today()){
 const ym=d.slice(0,7),first=ym+'-01',last=iso(new Date(+ym.slice(0,4),+ym.slice(5,7),0)),days=range(first,last);
 const active=days.filter(x=>x>=S.start),goal=+(S.monthGoals[ym]||S.targets.steps*active.length),perDay=goal/(active.length||1);
 let total=0,bal=0;const rows=[];
 for(const x of days){if(x>d)break;const s=stepsOn(x);if(x<S.start&&s===null)continue;const v=s||0;total+=v;if(x<d||s!==null){bal+=v-perDay;rows.push({d:x,v,diff:v-perDay,bal})}}
 const daysLeft=active.filter(x=>x>=d).length,remaining=Math.max(0,goal-total);
 return {ym,goal,perDay,total,remaining,daysLeft,need:daysLeft?remaining/daysLeft:0,bal,rows,pct:Math.min(100,total/goal*100),done:total>=goal,last};
}

/* ---------- check-ins (Monday) ---------- */
const checkinDue=()=>{const ws=weekStart(today());return !isStarter(ws)&&!S.checkins[ws]};
const weights=()=>[{date:S.baseline.date,kg:S.baseline.kg},...Object.values(S.checkins).filter(c=>c.kg).map(c=>({date:c.date,kg:c.kg}))].sort((a,b)=>a.date.localeCompare(b.date));
const currentKg=()=>weights().at(-1).kg;
function checkinStreak(){let n=0;for(let ws=weekStart(today());ws>=weekStart(S.start);ws=addDays(ws,-7)){const c=S.checkins[ws];if(c&&!c.late)n++;else if(ws===weekStart(today())&&!c)continue;else break}return n}

/* ---------- milestones ---------- */
function milestones(){
 const kg=currentKg(),start=S.baseline.kg,goal=+S.goalKg||0,out=[],ws=weights();
 const firstUnder=t=>{const w=ws.find(x=>x.kg<=t);return w?w.date:null};
 for(let t=start-3;t>=Math.max(goal||start-30,60);t-=3)out.push({type:'kg',label:`Hit ${t} kg`,target:t,done:firstUnder(t),prog:Math.max(0,Math.min(1,(start-kg)/(start-t)))});
 if(goal&&!out.some(o=>o.target===goal))out.push({type:'kg',label:`Goal: ${goal} kg`,target:goal,done:firstUnder(goal),prog:Math.max(0,Math.min(1,(start-kg)/(start-goal)))});
 const streak=weeklyStreak(),ci=checkinStreak();
 [[1,'First full 4 + 3 week'],[3,'3-week streak'],[6,'6-week streak'],[10,'10-week streak'],[20,'20-week streak']].forEach(([n,l])=>out.push({type:'habit',label:l,done:streak>=n?'✓':null,prog:Math.min(1,streak/n),sub:`${Math.min(streak,n)}/${n} weeks`}));
 [[4,'4 Monday check-ins in a row'],[12,'12 Monday check-ins in a row']].forEach(([n,l])=>out.push({type:'habit',label:l,done:ci>=n?'✓':null,prog:Math.min(1,ci/n),sub:`${Math.min(ci,n)}/${n}`}));
 events().filter(e=>e.kg).forEach(e=>{const tg=+e.kg,w=weights().find(x=>x.kg<=tg&&x.date<=e.date);out.push({type:'event',label:`${e.icon||''} ${e.name}: ${tg} kg`,target:tg,done:w?w.date:null,prog:Math.max(0,Math.min(1,(start-kg)/(start-tg||1))),sub:e.date<today()&&!w?'missed':`${daysTo(e.date)} days`})});
 const m=monthInfo();out.push({type:'habit',label:`${fmt(m.ym+'-01',{month:'long'})} step challenge`,done:m.done?'✓':null,prog:m.pct/100,sub:`${n0(m.total)}/${n0(m.goal)}`});
 return out;
}
const nextMilestone=()=>milestones().filter(m=>m.type==='kg'&&!m.done)[0];

/* ---------- photos (IndexedDB, stay on the phone) ---------- */
const DB=typeof indexedDB!=='undefined'?new Promise((res,rej)=>{const r=indexedDB.open('evanHubPhotos',1);r.onupgradeneeded=()=>r.result.createObjectStore('p');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}):null;
const idb=(mode,fn)=>DB?DB.then(db=>new Promise((res,rej)=>{const t=db.transaction('p',mode),r=fn(t.objectStore('p'));t.oncomplete=()=>res(r&&r.result);t.onerror=()=>rej(t.error)})):Promise.resolve(null);
const putPhoto=(k,v)=>idb('readwrite',s=>s.put(v,k));
const getPhoto=k=>idb('readonly',s=>s.get(k));
const allPhotoKeys=()=>idb('readonly',s=>s.getAllKeys());
function compress(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const sc=Math.min(1,1000/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*sc;c.height=im.height*sc;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};im.onerror=rej;im.src=fr.result};fr.onerror=rej;fr.readAsDataURL(file)})}

/* ---------- UI helpers ---------- */
const $=id=>document.getElementById(id);
function openSheet(h){$('sheetBox').innerHTML=h;$('sheet').classList.remove('hidden')}
function closeSheet(){$('sheet').classList.add('hidden')}
function go(t){tab=t;render();scrollTo(0,0)}
function toast(m){const b=document.createElement('div');b.className='toast';b.textContent=m;document.body.appendChild(b);setTimeout(()=>b.remove(),2200)}
const chipTxt={done:'Done ✓',short:'Short ✓',minimum:'Minimum ✓',missed:'Missed',skipped:'Skipped',excused:'Excused',pending:'To do',none:'–'};
const chip=s=>`<span class="chip ${s}">${chipTxt[s]||s}</span>`;
const bar=(p,cls='')=>`<div class="bar"><div class="${cls}" style="width:${Math.max(0,Math.min(100,p))}%"></div></div>`;
const daysTo=s=>diffDays(s,today());
const kindOf=s=>GYM.includes(s)?'gym':s==='Walk'?'walk':s==='Match'?'match':'cardio';

/* ================= TODAY ================= */
function nextAction(){
 const t=today(),dow=parse(t).getDay(),ws=weekStart(t),nws=addDays(ws,7);
 if(checkinDue())return {cls:dow===1?'mon':'late',title:dow===1?'Monday check-in':'Monday check-in missed',sub:dow===1?'Scales + photo, first thing, before food.':'Do it now – it will show as late.',btn:'Check in now',fn:'openCheckin()'};
 if((dow===0||dow===6)&&!S.weeks[nws]?.committed)return {cls:'plan',title:'Plan next week',sub:'Shifts, matches, 4 gym + 3 cardio. 3 minutes.',btn:'Plan my week',fn:"planWeek=1;go('plan')"};
 if(!week(ws).committed)return {cls:'plan',title:'Commit this week',sub:'Your default plan already counts – check it and commit.',btn:'Open plan',fn:"planWeek=0;go('plan')"};
 const p=itemsOn(t).find(i=>itemStatus(i)==='pending');
 if(p)return {cls:'go',title:p.s==='Match'?'Match today':p.s,sub:(GYM.includes(p.s)?'+ 15-min cardio finisher · ':'')+winFor(t),btn:p.s==='Match'?'Match done ✓':'Start',fn:p.s==='Match'?`matchDone('${p.id}')`:`startItem('${p.id}')`};
 return null;
}
function viewToday(){
 const t=today(),ws=weekStart(t),st=weekStats(ws),miss=missRun(),na=nextAction(),m=monthInfo(),ms=nextMilestone(),kg=currentKg();
 let h=`<div class="row between"><div><div class="muted">${fmt(t,{weekday:'long',day:'numeric',month:'long'})}</div><h1>Hi Evan</h1></div><span class="chip ${shiftOf(t)}">${shiftLabel(t)}</span></div>`;
 h+=motivation();
 if(na)h+=`<div class="card action ${na.cls}"><div class="small upper">Next</div><h2>${esc(na.title)}</h2><div class="small">${esc(na.sub)}</div><button class="btn big" onclick="${na.fn}">${na.btn}</button></div>`;
 if(miss>=2)h+=`<div class="banner bad">${miss} sessions missed in a row. Today breaks the run – even the 20-minute minimum counts.</div>`;
 else if(miss===1)h+=`<div class="banner warn">Missed last time. Never miss twice.</div>`;
 // this week
 h+=`<div class="card"><div class="row between"><h2>${st.starter?'Starter week':'This week'}</h2><span class="muted small">Streak: <b>${weeklyStreak()}</b> week${weeklyStreak()===1?'':'s'} 🔥</span></div>
 <div class="grid2"><div><div class="row between small"><span>Gym</span><b>${st.gym}/${st.tg.gym}</b></div>${bar(st.gym/st.tg.gym*100,'g')}</div><div><div class="row between small"><span>Cardio${st.matches?` (${st.matches} match)`:''}</span><b>${st.cardio}/${st.tg.cardio}</b></div>${bar(st.cardio/st.tg.cardio*100,'c')}</div></div>
 <div class="wk">${weekDays(ws).map(d=>{const its=itemsOn(d);return `<div class="wd ${d===t?'today':''}"><b>${fmt(d,{weekday:'narrow'})}</b><span class="chip ${shiftOf(d)} xs">${shiftOf(d)}</span>${its.map(i=>`<div class="wi ${itemStatus(i)}">${esc(i.s==='Match'?'⚽':i.s.replace('Upper ','U').replace('Lower ','L'))}</div>`).join('')||'<div class="wi none">·</div>'}</div>`}).join('')}</div></div>`;
 // today's items
 const its=itemsOn(t);
 if(its.length){h+=`<div class="card"><h2>Today</h2>`;its.forEach(i=>{const s=itemStatus(i);h+=`<div class="itemRow"><div><b>${esc(i.s==='Match'?'⚽ Refereeing':i.s)}</b><div class="muted small">${esc(winFor(t))}</div></div><div>${s==='pending'?(i.s==='Match'?`<button class="btn sm good" onclick="matchDone('${i.id}')">Done ✓</button>`:`<button class="btn sm good" onclick="startItem('${i.id}')">Start</button> <button class="btn sm alt" onclick="tired('${i.id}')">Tired</button> <button class="btn sm alt" onclick="moveItem('${i.id}')">Move</button>`):chip(s)}</div></div>`});
  if(shiftOf(t)==='N'&&its.some(i=>itemStatus(i)==='pending'&&i.s!=='Match'))h+=`<div class="muted small" style="margin-top:6px">🌙 Night shift: sleep → eat → train → work. Rough night? Short version, or move it once this week.</div>`;
  h+=`</div>`}
 const tm=matchesOn(addDays(t,1));if(tm.length&&its.some(i=>['Lower A','Pull'].includes(i.s)&&itemStatus(i)==='pending'))h+=`<div class="banner warn">⚽ Match tomorrow – keep legs light today, or move this session.</div>`;
 if(S.why)h+=`<div class="why">“${esc(S.why)}”</div>`;
 // essentials
 const dd=S.daily[t]||{},stp=stepsOn(t),fromG=S.health[t]&&S.health[t].steps!=null;
 const trainedToday=S.logs.some(l=>l.date===t&&KEPT.includes(l.status)&&l.kind!=='walk'),plannedToday=itemsOn(t).some(i=>i.s!=='Walk'),closed=[(stp||0)>=S.targets.steps,(dd.water||0)>=S.targets.water,(dd.protein||0)>=S.targets.protein,trainedToday||!plannedToday].filter(Boolean).length;
 h+=`<div class="card"><div class="row between"><h2>Daily essentials</h2><span class="chip ${closed===4?'done':'pending'}">${closed}/4 closed</span></div>
 <div class="rings">${ring('👟',(stp||0)/S.targets.steps,stp===null?'–':n0(stp),'steps','#a855f7','stepRing()')}${ring('💧',(dd.water||0)/S.targets.water,((dd.water||0)/1000).toFixed(1)+'L','water','#06b6d4',"addDaily('water',500)")}${ring('🍗',(dd.protein||0)/S.targets.protein,(dd.protein||0)+'g','protein','#eab308',"addDaily('protein',20)")}${ring('🏋️',trainedToday?1:plannedToday?0:1,trainedToday?'Done':plannedToday?'To do':'Rest','training','#22c55e',"go('train')")}</div>
 <div class="muted xs" style="text-align:center;margin-top:4px">Tap a ring: 💧 +500ml · 🍗 +20g · 🏋️ opens Train</div>
 <div class="grid3" style="margin-top:8px"><button class="btn sm alt" onclick="addDaily('water',250)">💧 +250</button><button class="btn sm alt" onclick="addDaily('protein',40)">🍗 +40g</button><button class="btn sm alt" onclick="undoDaily()">↩ Undo</button></div>
 ${S.syncToken?`<div class="row between" style="margin-top:8px"><span class="muted xs">👟 ${fromG?`Garmin synced ${S.health[t].at?new Date(S.health[t].at).toLocaleTimeString('en-IE',{hour:'2-digit',minute:'2-digit'}):''}`:'No Garmin steps yet today'}</span><button class="btn sm alt" onclick="runSync()">↻ Sync steps now</button></div>`:''}
 ${fromG?'':`<div class="row" style="margin-top:8px"><input id="stIn" inputmode="numeric" placeholder="${S.syncToken?'Or type steps':'Steps from Garmin'}" value="${dd.steps??''}"><button class="btn sm" onclick="saveSteps()">Save</button></div>`}
 <div style="margin-top:10px"><div class="row between small"><span>🍽 Eating</span><span class="muted">${isTrainDay(t)?S.targets.train:S.targets.rest} kcal target</span></div>
 <div class="grid3" style="margin-top:6px">${['on','mostly','off'].map(k=>`<button class="btn sm ${dd.food===k?'':'alt'}" onclick="setFood('${k}')">${({on:'On plan',mostly:'Mostly',off:'Off plan'})[k]}</button>`).join('')}</div>
 <div class="muted small" style="margin-top:4px">${shiftOf(t)==='N'?'Nights: main meal before 7pm, night pack in the bag.':shiftOf(t)==='D'?'Day shift: boxed lunch + snacks in the bag.':'Off day: normal meals.'}</div></div></div></div>`;
 // step challenge mini
 h+=`<div class="card tap" onclick="go('progress')"><div class="row between"><h2>${fmt(m.ym+'-01',{month:'long'})} step challenge</h2><span class="chip ${m.bal>=0?'done':'missed'}">${m.bal>=0?'+':''}${n0(m.bal)}</span></div>${bar(m.pct,'s')}
 <div class="muted small">${n0(m.total)} of ${n0(m.goal)} · ${m.done?'Challenge complete ✓':`need ${n0(m.need)}/day for ${m.daysLeft} days`}</div></div>`;
 if(ms)h+=`<div class="card tap" onclick="go('progress')"><div class="row between"><h2>Next milestone</h2><b>${esc(ms.label)}</b></div>${bar(ms.prog*100,'g')}<div class="muted small">${(kg-ms.target).toFixed(1)} kg to go · now ${kg} kg</div></div>`;
 h+=`<div class="grid3"><button class="btn alt" onclick="addMatch()">⚽ Match</button><button class="btn alt" onclick="addShift()">🕐 Extra shift</button><button class="btn alt" onclick="shareWeek()">📤 Share</button></div>`;
 return h;
}
let lastAdd=null;
function addDaily(k,v){const d=day(today());d[k]=Math.max(0,(d[k]||0)+v);lastAdd=[k,v];save();render()}
function undoDaily(){if(!lastAdd)return toast('Nothing to undo');const [k,v]=lastAdd;lastAdd=null;const d=day(today());d[k]=Math.max(0,(d[k]||0)-v);save();render()}
function stepRing(){const e=$('stIn');if(e)e.focus();else toast('Steps come from Garmin')}
function ring(icon,p,val,label,col,fn){const r=34,c=2*Math.PI*r,pp=Math.max(0,Math.min(1,p||0)),full=pp>=1;
 return `<button class="ring ${full?'full':''}" onclick="${fn}"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="${r}" stroke="#1b2740" stroke-width="9" fill="none"/><circle cx="42" cy="42" r="${r}" stroke="${col}" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pp)}" transform="rotate(-90 42 42)"/><text x="42" y="40" text-anchor="middle" font-size="18">${icon}</text><text x="42" y="58" text-anchor="middle" font-size="12" font-weight="800" fill="#eef2f8">${esc(val)}</text></svg><span>${full?'✓ ':''}${label}</span></button>`}
function setFood(k){day(today()).food=k;save();render()}
function saveSteps(){const v=$('stIn').value.replace(/\D/g,'');day(today()).steps=v===''?null:+v;save();toast('Steps saved');render()}

/* ---------- motivation banner ---------- */
const QUOTES=['Discipline is choosing what you want most over what you want now.','You don’t have to feel like it. You just have to start.','The 5am version of you is the one who gets results.','Nobody remembers the session you skipped. You’ll remember the ones you didn’t.','Small sessions, every week, beat perfect plans that never happen.','Tired is a feeling. Done is a fact.','You’ve started before. This time, you finish.','Ref the game, own the week.','Win the morning, win the day.','Every session is a vote for the man in the wedding photos.','Motivation gets you started. Habit keeps you going.','It doesn’t have to be perfect. It has to be done.'];
function motivation(){
 const t=today(),dIdx=diffDays(t,'2026-01-01'),q=QUOTES[mod(dIdx,QUOTES.length)],ws=weekStart(t),st=weekStats(ws),ne=nextEvent(),wed=S.events.find(e=>e.id==='wedding');
 const left=st.tg.gym-st.gym+Math.max(0,st.tg.cardio-st.cardio),kg=currentKg(),lost=S.baseline.kg-kg,dl=wed?daysTo(wed.date):null;
 const dow=parse(t).getDay(),daysLeftWk=dow===0?1:8-dow;
 let line;
 if(st.hit)line='Week target smashed. Anything else is a bonus 💪';
 else if(left>daysLeftWk)line=`${left} sessions left, ${daysLeftWk} days. Doubles needed – no more slack this week.`;
 else if(lost>=1)line=`${lost.toFixed(1)} kg down already. Keep stacking weeks.`;
 else line=`${left} sessions to hit this week. One at a time.`;
 return `<div class="hero"><div class="heroTop">${dl!==null?`<div><b>${dl}</b><span>days to the<br>wedding 💍</span></div>`:''}${ne&&ne.id!=='wedding'?`<div><b>${daysTo(ne.date)}</b><span>days to<br>${esc(ne.name)} ${ne.icon||''}</span></div>`:''}<div><b>${weeklyStreak()}</b><span>week<br>streak 🔥</span></div></div>
 <div class="quote">“${esc(S.why&&mod(dIdx,3)===0?S.why:q)}”</div><div class="heroLine">${esc(line)}</div></div>`;
}

/* ---------- tired / move / skip ---------- */
function findItem(id){for(const ws in S.weeks){const it=S.weeks[ws].items.find(i=>i.id===id);if(it)return [it,ws]}return [null,null]}
function tired(id){
 const [it]=findItem(id),hd=S.health[it.date];
 openSheet(`<h2>Tired. Understood.</h2><div class="note">Your rule: “${esc(S.tiredRule)}”</div>${S.why?`<div class="note">Your why: “${esc(S.why)}”</div>`:''}
 ${hd&&hd.sleepHours&&hd.sleepHours<5?`<div class="banner warn">Garmin: ${hd.sleepHours}h sleep. The short version is the smart call.</div>`:''}
 <div class="stack" style="margin-top:12px">
 ${GYM.includes(it.s)?`<button class="btn good" onclick="closeSheet();startItem('${id}',true)">Short version – 25 mins, counts as gym ✓</button>`:''}
 <button class="btn" onclick="minimum('${id}')">20-min walk/bike – counts as cardio${GYM.includes(it.s)?' (not gym)':''}</button>
 <button class="btn alt" onclick="moveItem('${id}')">Move it to another day</button>
 <button class="btn bad" onclick="skipFlow('${id}')">Skip it</button></div>`);
}
function minimum(id){openSheet(`<h2>Minimum session</h2><label>What?</label><select id="mk"><option>Incline walk</option><option>Bike</option><option>Outdoor walk</option><option>StairMaster</option></select><label>Minutes</label><input id="mm" type="number" inputmode="numeric" value="20"><button class="btn good" style="margin-top:12px" onclick="saveMinimum('${id}')">Done – save</button>`)}
function saveMinimum(id){const [it]=findItem(id),m=+$('mm').value||0;if(m<15)return alert('Minimum is 15–20 minutes.');addLog({planId:id,date:it.date,session:it.s,kind:'cardio',status:'minimum',type:$('mk').value,min:m});closeSheet();toast('Minimum done – habit kept ✓');render()}
function moveItem(id){
 const [it,ws]=findItem(id),w=week(ws),opts=weekDays(ws).filter(d=>d>=today()&&d!==it.date);
 if(!opts.length)return alert('No days left this week to move it to. Short version or minimum instead?');
 openSheet(`<h2>Move ${esc(it.s)}</h2>${w.committed&&w.moves>=1?`<div class="banner warn">You’ve already moved one session this week. This one will show in your Sunday review.</div>`:`<div class="muted">You get one free move a week.</div>`}
 <label>New day</label><select id="mvD">${opts.map(d=>`<option value="${d}">${fmt(d)} · ${shiftLabel(d)}${itemsOn(d).length?' · has '+itemsOn(d).map(i=>i.s).join('+'):''}</option>`).join('')}</select>
 <button class="btn good" style="margin-top:12px" onclick="doMove('${id}')">Move it</button>`);
}
function doMove(id){const [it,ws]=findItem(id),w=week(ws);it.date=$('mvD').value;if(w.committed)w.moves++;save();closeSheet();toast('Moved to '+fmt(it.date));render()}
function skipFlow(id){
 const [it]=findItem(id),rt=reasonTally(56);
 openSheet(`<h2>Skipping ${esc(it.s)}</h2><div class="muted">This shows as <b>Skipped</b> and counts against your week.</div>
 ${rt.length?`<div class="note">Your top reasons lately: ${rt.slice(0,3).map(r=>esc(r[0])+' ×'+r[1]).join(', ')}</div>`:''}
 ${shiftOf(it.date)==='N'?`<div class="banner warn">On nights you planned this for after your sleep. Tired after sleep usually means the short version, not a skip.</div>`:''}
 <label>Honest reason</label><select id="sr">${SKIP_REASONS.map(r=>`<option>${r}</option>`).join('')}</select>
 <label>What makes the next one happen?</label><input id="sn" placeholder="e.g. bag in the car tonight">
 <div class="stack" style="margin-top:12px"><button class="btn good" onclick="minimum('${id}')">Actually – I’ll do the 20-min minimum</button><button class="btn bad" onclick="saveSkip('${id}')">Confirm skip</button></div>`);
}
function saveSkip(id){const [it]=findItem(id),r=$('sr').value;addLog({planId:id,date:it.date,session:it.s,kind:kindOf(it.s),status:r==='Sick or injured'?'excused':'skipped',reason:r,note:$('sn').value});closeSheet();render()}
function reasonTally(days){const c={},from=addDays(today(),-days);S.logs.forEach(l=>{if(l.reason&&l.date>=from)c[l.reason]=(c[l.reason]||0)+1});return Object.entries(c).sort((a,b)=>b[1]-a[1])}
function addLog(l){l.id=uid();l.savedAt=new Date().toISOString();l.late=today()>l.date;S.logs=S.logs.filter(x=>!(l.planId&&x.planId===l.planId));S.logs.push(l);save()}

/* ---------- matches & shifts ---------- */
function addMatch(){openSheet(`<h2>Add a match</h2><div class="muted">Counts as cardio. The hub adjusts your plan and food.</div><label>Date</label><input id="md" type="date" value="${today()}"><label>Kick-off</label><input id="mt" type="time"><label>Where (optional)</label><input id="mv"><button class="btn good" style="margin-top:12px" onclick="saveMatch()">Save match</button>`)}
function saveMatch(){
 const d=$('md').value;if(!d)return;const m={id:uid(),date:d,time:$('mt').value,venue:$('mv').value};S.matches.push(m);
 const w=week(weekStart(d)),its=w.items.filter(i=>i.date===d);
 w.items.push({id:m.id,date:d,s:'Match'});
 // swap a same-day cardio into the match; flag heavy legs
 let c=its.find(i=>i.s==='Cardio'&&!logFor(i));
 if(!c){const tg=targetsFor(weekStart(d)).cardio,cnt=w.items.filter(i=>i.s==='Cardio'||i.s==='Match').length;if(cnt>tg)c=[...w.items].reverse().find(i=>i.s==='Cardio'&&!logFor(i)&&i.date>=today())}
 if(c)w.items=w.items.filter(i=>i!==c);
 const nx=addDays(d,1);if(nx<=addDays(weekStart(d),6)&&!w.items.some(i=>i.date===nx))w.items.push({id:uid(),date:nx,s:'Walk'});
 save();closeSheet();toast(c?`Match added – replaces cardio on ${fmt(c.date)}`:'Match added');
 const heavy=w.items.find(i=>i.date===addDays(d,-1)&&['Lower A','Pull'].includes(i.s)&&!logFor(i));if(heavy)setTimeout(()=>alert(`Heads up: ${heavy.s} is the day before this match. Consider moving it.`),300);
 render();
}
function matchDone(id){const [it]=findItem(id),m=S.matches.find(x=>x.id===id);addLog({planId:id,date:it.date,session:'Match',kind:'match',status:'done',venue:m?.venue});toast('Match logged as cardio ✓');render()}
function addShift(){openSheet(`<h2>Extra shift or swap</h2><div class="muted">Picked up overtime or swapped? Your session stays – the time moves.</div><label>Date</label><input id="xd" type="date" value="${today()}"><label>Shift</label><select id="xs"><option value="D">Day 7am–7pm</option><option value="N">Night 7pm–7am</option><option value="O">Not working (swapped off)</option></select><button class="btn good" style="margin-top:12px" onclick="saveShift()">Save shift</button>`)}
function saveShift(){const d=$('xd').value,v=$('xs').value;if(!d)return;if(v===S.pattern[cycleIdx(d)])delete S.shiftOverride[d];else S.shiftOverride[d]=v;save();closeSheet();toast('Shift saved – session now: '+winFor(d));render()}

/* ================= PLAN ================= */
function viewPlan(){
 const ws=addDays(weekStart(today()),planWeek*7),w=week(ws),days=weekDays(ws),t=today(),st=weekStats(ws),locked=d=>d<t||(w.committed&&d===t&&itemsOn(d).some(i=>logFor(i)));
 const prev=addDays(ws,-7),ps=weekStats(prev);
 let h=`<h1>Plan</h1><div class="row" style="margin:8px 0"><button class="btn alt sm" onclick="planWeek--;render()">‹</button><div style="flex:1;text-align:center;font-weight:700">${fmt(ws)} – ${fmt(days[6])}<div class="muted small">${planWeek===0?'This week':planWeek===1?'Next week':''}</div></div><button class="btn alt sm" onclick="planWeek++;render()">›</button></div>`;
 if(planWeek>=1&&prev>=weekStart(S.start)){h+=`<div class="card"><h2>Last week review</h2>${reviewHtml(prev,ps)}</div>`}
 h+=`<div class="card"><div class="row between"><h2>Targets</h2><span class="small">Gym <b>${w.items.filter(i=>GYM.includes(i.s)).length}/${targetsFor(ws).gym}</b> · Cardio <b>${w.items.filter(i=>i.s==='Cardio'||i.s==='Match').length}/${targetsFor(ws).cardio}</b></span></div>
 <div class="muted small">1. Check shifts (tap to change). 2. Add known matches. 3. Place 4 gym + 3 cardio. A match counts as cardio.</div>`;
 days.forEach(d=>{
  const its=w.items.filter(i=>i.date===d);
  h+=`<div class="planDay"><div><b>${fmt(d,{weekday:'short'})}</b><div class="muted small">${fmt(d,{day:'numeric',month:'short'})}</div></div>
  <button class="chip ${shiftOf(d)} shiftBtn" onclick="cycleShift('${d}')">${shiftOf(d)}${S.shiftOverride[d]?'*':''}</button>
  <div>${its.map(i=>{const s=itemStatus(i);return `<div class="pi"><span>${esc(i.s==='Match'?'⚽ Match':i.s)}</span>${s!=='pending'?chip(s):d<t?'':`<button class="x" onclick="removeItem('${i.id}')">×</button>`}</div>`}).join('')}
  ${d<t?'':`<select class="add" onchange="addItem('${d}',this.value);this.value=''"><option value="">+ add</option>${TYPES.map(x=>`<option>${x}</option>`).join('')}</select>`}
  <div class="muted xs">${esc(winFor(d))}${matchesOn(d).length&&!its.some(i=>i.s==='Match')?' · ⚽ match':''}</div></div></div>`;
 });
 h+=`</div>`;
 const warn=planWarnings(ws);if(warn.length)h+=`<div class="banner warn">${warn.map(esc).join('<br>')}</div>`;
 h+=`<div class="grid2"><button class="btn alt" onclick="addMatch()">⚽ Add match</button><button class="btn alt" onclick="addShift()">🕐 Extra shift</button></div>`;
 h+=w.committed?`<div class="banner good">Committed ${fmt(w.committed.slice(0,10))} · moves used: ${w.moves} · changes after commit: ${w.changes}</div>`:`<button class="btn good big" onclick="commitWeek('${ws}')">Commit to this week</button>`;
 h+=`<div class="card"><div class="row between"><h2>Food prep</h2><span class="muted">${prepDone(ws)}</span></div><button class="btn alt" onclick="openPrep('${ws}')">Open prep list</button></div>`;
 return h;
}
function planWarnings(ws){
 const w=week(ws),tg=targetsFor(ws),out=[],g=w.items.filter(i=>GYM.includes(i.s)).length,c=w.items.filter(i=>i.s==='Cardio'||i.s==='Match').length;
 if(g<tg.gym)out.push(`Only ${g} gym sessions planned – target is ${tg.gym}.`);if(c<tg.cardio)out.push(`Only ${c} cardio sessions – target is ${tg.cardio}.`);
 w.items.filter(i=>['Lower A','Pull'].includes(i.s)).forEach(i=>{if(matchesOn(addDays(i.date,1)).length)out.push(`${i.s} on ${fmt(i.date)} is the day before a match.`)});
 w.items.filter(i=>['Lower A','Pull'].includes(i.s)).forEach(i=>{if(matchesOn(i.date).length)out.push(`${i.s} (legs) and a match on ${fmt(i.date)} – swap to an upper session or move it.`)});
 const last2=w.items.filter(i=>i.date>=addDays(ws,5)&&i.s!=='Walk').length;if(last2>=4)out.push(`${last2} sessions crammed into Sat–Sun. Spread them out.`);
 return out;
}
function addItem(d,s){if(!s)return;const w=week(weekStart(d));w.items.push({id:uid(),date:d,s});if(w.committed)w.changes++;save();render()}
function removeItem(id){const [it,ws]=findItem(id),w=week(ws);if(w.committed&&!confirm('You committed to this. Remove it? (It will show in your review.)'))return;w.items=w.items.filter(i=>i.id!==id);if(w.committed)w.changes++;save();render()}
function cycleShift(d){const o=['D','N','O'],nx=o[(o.indexOf(shiftOf(d))+1)%3];if(nx===S.pattern[cycleIdx(d)])delete S.shiftOverride[d];else S.shiftOverride[d]=nx;save();render()}
function commitWeek(ws){S.weeks[ws].committed=new Date().toISOString();save();toast('Committed. Now the prep list.');openPrep(ws);render()}
function prepItems(ws){
 const days=weekDays(ws),D=days.filter(d=>shiftOf(d)==='D').length,N=days.filter(d=>shiftOf(d)==='N').length,out=[];
 if(D)out.push(`${D} day-shift lunches + snacks boxed`);if(N)out.push(`${N} night packs (meal + 2 snacks + 1.5L water)`);
 if(D)out.push('5am breakfasts ready (overnight oats / shake)');
 S.matches.filter(m=>m.date>=ws&&m.date<=days[6]).forEach(m=>out.push(`Match ${fmt(m.date)}: meal 2–3h before + grab-and-go option`));
 out.push('Shopping done','Gym bag + clothes ready','Alarms set for every session','Water bottle(s) clean');return out;
}
const prepDone=ws=>{const p=(week(ws).prep||{}),it=prepItems(ws);return it.filter(i=>p[i]).length+'/'+it.length};
function openPrep(ws){const p=week(ws).prep||{};openSheet(`<h2>Prep for ${fmt(ws)} week</h2><div class="muted">One hour on Sunday saves the 3am vending machine.</div>
 ${prepItems(ws).map((x,i)=>`<label class="check"><input type="checkbox" ${p[x]?'checked':''} onchange="togglePrep('${ws}',${i},this.checked)"><span>${esc(x)}</span></label>`).join('')}
 <h3>Batch meals</h3><div class="note">Chicken, rice + veg · Chilli · Turkey bolognese · Chicken fajita bowls. Cook 2, box them.</div>
 <h3>Night pack</h3><div class="note">Boxed meal · Greek yogurt + fruit · protein shake · chicken wraps · rice cakes · 1.5L water. No energy drinks after 2am.</div>
 <h3>Running late / match day</h3><div class="note">Chicken fillet roll (no mayo) · supermarket chicken + salad · protein yogurt · banana · tuna wrap.</div>
 <button class="btn" style="margin-top:12px" onclick="closeSheet();render()">Close</button>`)}
function togglePrep(ws,i,v){const w=week(ws);w.prep=w.prep||{};w.prep[prepItems(ws)[i]]=v;save()}
function reviewHtml(ws,s){
 const rs=Object.entries(s.reasons).sort((a,b)=>b[1]-a[1]),ci=S.checkins[ws];
 const tip={'Too tired':'Plan the short version on night-shift days.','Slept badly':'Move sessions to after sleep.','Didn’t prep / no food':'Tick off the prep list before Monday.','Work ran over':'Train before work, not after.','Just didn’t feel like it':'Use the 20-min minimum – it only has to start.','Match took over':'Add matches as soon as you get the call.'};
 return `<div class="grid3"><div class="stat"><b>${s.gym}/${s.tg.gym}</b><span>gym</span></div><div class="stat"><b>${s.cardio}/${s.tg.cardio}</b><span>cardio</span></div><div class="stat"><b>${s.hit?'✓':'✗'}</b><span>${s.hit?'week hit':'week missed'}</span></div></div>
 <div class="muted small" style="margin-top:8px">${s.missed} missed · ${s.skipped} skipped · ${s.moves} moved · ${s.changes} plan changes · ${s.late} logged late · ${n0(s.steps)} steps · water avg ${(s.waterAvg/1000).toFixed(1)}L · check-in ${ci?(ci.late?'late':'✓'):'✗'}</div>
 ${rs.length?`<div class="note">Reasons: ${rs.map(r=>esc(r[0])+' ×'+r[1]).join(', ')}${tip[rs[0][0]]?`<br><b>Next week:</b> ${tip[rs[0][0]]}`:''}</div>`:''}`;
}

/* ================= TRAIN ================= */
function startItem(id,short=false){const [it]=findItem(id);startSession(it.date,it.s,short,id)}
function startSession(d,s,short=false,planId=null){
 if(!planId){const it=itemsOn(d).find(i=>i.s===s&&!logFor(i));if(it)planId=it.id}
 if(!S.draft||S.draft.session!==s||S.draft.date!==d)S.draft={date:d,session:s,short,planId,sets:{},swaps:{},fin:{},startedAt:Date.now()};
 else S.draft.short=short||S.draft.short;
 save();go('train');
}
function exHistory(name,before){return S.logs.filter(l=>l.sets&&l.sets[name]&&l.date<before).sort((a,b)=>a.date.localeCompare(b.date))}
const lastSets=(name,before)=>{const h=exHistory(name,before);return h.length?h.at(-1).sets[name]:null};
const repTop=(reps,i)=>{const p=String(reps).split('+'),n=p[Math.min(i,p.length-1)].match(/\d+/g);return n?+n.at(-1):null};
const setScore=x=>{const r=+(x&&x[1])||0,w=parseFloat(x&&x[0]);return r?(isNaN(w)?r:w*r):0};
function overloadTip(name,reps,sets,prev){
 if(!prev||!prev.some(x=>x&&x[1]))return {cls:'info',t:'First time: pick a weight that gets you to the top of the range with good form. That’s your baseline.'};
 let all=true;for(let i=0;i<sets;i++){const p=prev[i],top=name==='Dual Cable Bicep Curl'&&i===2?20:repTop(reps,i);if(!p||!p[1]||top===null||+p[1]<top)all=false}
 return all?{cls:'good',t:'⬆ Top of the range on every set last time – add weight today (2.5–5kg), then build reps back up.'}:{cls:'info',t:'🎯 Beat last time: same weight, +1 rep on at least one set.'};
}
function viewTrain(){
 const dr=S.draft;let h=`<h1>Train</h1>`;
 if(!dr){
  const ws=weekStart(today()),pend=week(ws).items.filter(i=>itemStatus(i)==='pending'&&i.s!=='Match');
  h+=`<div class="card"><h2>This week’s plan</h2>${pend.length?pend.map(i=>`<div class="itemRow"><div><b>${esc(i.s)}</b><div class="muted small">${fmt(i.date)} · ${esc(winFor(i.date))}</div></div><button class="btn sm ${i.date===today()?'good':'alt'}" onclick="startItem('${i.id}')">Start</button></div>`).join(''):'<div class="muted">Nothing left this week 👊</div>'}</div>`;
  h+=`<div class="card"><h2>Extra session</h2><div class="grid2">${[...GYM,'Cardio','Walk'].map(s=>`<button class="btn alt" onclick="startSession(today(),'${s}')">${s}</button>`).join('')}</div>
  <button class="btn alt" style="margin-top:8px" onclick="lateLog()">Forgot to log yesterday? (shows as late)</button></div>`;
  h+=`<h3>History</h3>`+[...S.logs].sort((a,b)=>b.date.localeCompare(a.date)||b.savedAt.localeCompare(a.savedAt)).slice(0,30).map(l=>`<div class="card row between"><div><b>${esc(l.session==='Match'?'⚽ Match':l.session||'')}</b><div class="muted small">${fmt(l.date)}${l.min?' · '+l.min+' min':''}${l.reason?' · '+esc(l.reason):''}${l.of?` · beat ${l.beat}/${l.of}`:''}${l.fin&&l.fin.kcal?` · ${esc(l.fin.type||'StairMaster')} ${esc(l.fin.kcal)} kcal`:''}</div></div><div>${chip(l.status)}${l.late?' <span class="chip late">Late</span>':''}${KEPT.includes(l.status)&&verified(l)?' <span class="chip done">Garmin ✓</span>':''}</div></div>`).join('');
  return h;
 }
 const s=dr.session;
 h+=`<div class="row between"><h2>${esc(s)} · ${fmt(dr.date)}${dr.date<today()?' <span class="chip late">Late</span>':''}</h2><button class="btn alt sm" onclick="cancelDraft()">Cancel</button></div><div class="muted small" id="elapsed"></div>`;
 if(!GYM.includes(s)){
  h+=`<div class="card"><div class="muted">${s==='Walk'?'Recovery walk – easy pace, 30 mins.':'Cardio – incline walk, StairMaster or bike at a pace you can just about talk. 30 mins.'}</div>
  <label>Type</label><select id="ck">${['Incline walk','StairMaster','Bike','Outdoor walk','Rower','Run'].map(k=>`<option>${k}</option>`).join('')}</select>
  <label>Minutes</label><input id="cm" type="number" inputmode="numeric" value="30"><label>Calories (optional)</label><input id="cc" type="number" inputmode="numeric">
  <button class="btn good big" onclick="finishCardio()">Finish + save</button></div>`;return h;
 }
 if(dr.short)h+=`<div class="banner info">Short version: one hard set on the first 5 exercises, then home. Counts as gym. No finisher.</div>`;
 let sec='';
 W[s].forEach(([orig,sets,reps,note,section],ei)=>{
  if(dr.short&&(ei>5||section))return;
  const sc=section||'Workout';if(sc!==sec){sec=sc;h+=`<h3>${sc}</h3>`}
  const name=dr.swaps[orig]||orig,prev=lastSets(name,dr.date)||[],cur=dr.sets[name]||[],extra=(dr.extra||{})[name]||0,n=(dr.short?1:sets)+extra,base=dr.short?1:sets,rp=orig==='Dual Cable Bicep Curl',o=overloadTip(name,reps,base,prev),wu=(dr.warm||{})[name]||[];
  h+=`<div class="card ex"><div class="row between"><div><b>${esc(name)}</b>${name!==orig?`<div class="muted xs">swapped for ${esc(orig)}</div>`:''}</div><span class="muted small">${sets} × ${esc(reps)}</span></div>
  <div class="tip ${o.cls}">${o.t}${rp?' Set 3 = rest-pause to 20 total reps.':''}</div>
  ${wu.map((x,k)=>`<div class="setRow warm"><span class="muted small">W${k+1}</span><input inputmode="decimal" placeholder="kg" value="${esc(x[0])}" onchange="setWarm(${ei},${k},0,this.value)"><input inputmode="numeric" placeholder="reps" value="${esc(x[1])}" onchange="setWarm(${ei},${k},1,this.value)"><button class="tick" onclick="delWarm(${ei},${k})">×</button></div>`).join('')}
  ${Array.from({length:n},(_,i)=>{const c=cur[i],pv=prev[i]||['',''],carry=!c,w=c?c[0]:pv[0],r=c?c[1]:pv[1],dn=c&&c[2];return `<div class="setRow ${dn?'done':''} ${i>=base?'extra':''}"><span class="muted small">${i>=base?'+'+(i-base+1):rp&&i===2?'RP':'Set '+(i+1)}</span>
   <input id="w${ei}_${i}" class="${carry?'carry':''}" inputmode="decimal" placeholder="kg" value="${esc(w)}" onfocus="if(this.classList.contains('carry'))this.select()" oninput="this.classList.remove('carry')">
   <input id="r${ei}_${i}" class="${carry?'carry':''}" inputmode="numeric" placeholder="${rp&&i===2?'/20':'reps'}" value="${esc(r)}" onfocus="if(this.classList.contains('carry'))this.select()" oninput="this.classList.remove('carry')">
   <button class="tick ${dn?'on':''}" onclick="tickSet(${ei},${i})">✓</button></div>`}).join('')}
  <div class="setBtns"><button onclick="addWarm(${ei})">+ Warm-up set</button><button onclick="addExtra(${ei})">+ Extra set</button>${extra?`<button onclick="delExtra(${ei})">− Extra</button>`:''}</div>
  <div class="exBtns"><button onclick="exInfo(${ei})">PT notes</button><button onclick="exHist(${ei})">History</button><button onclick="swapEx(${ei})">Swap</button></div></div>`;
 });
 if(!dr.short)h+=`<div class="card"><h2>15-min cardio finisher</h2><div class="pills">${['StairMaster','Run','Row'].map(k=>`<button class="${(dr.fin.type||'StairMaster')===k?'sel':''}" onclick="S.draft.fin.type='${k}';save();render()">${({StairMaster:'🪜',Run:'🏃',Row:'🚣'})[k]} ${k}</button>`).join('')}</div><div class="muted small" style="margin-top:6px">${({StairMaster:'Steady pace you can hold for 15 mins.',Run:'Treadmill – easy jog or 1 min fast / 1 min walk.',Row:'Steady 15 mins, or 250m hard / 1 min easy.'})[dr.fin.type||'StairMaster']} Log the machine’s calories – or say why not.</div><div class="grid2"><div><label>Calories</label><input inputmode="numeric" value="${esc(dr.fin.kcal||'')}" onchange="S.draft.fin.kcal=this.value;save()"></div><div><label>Or reason</label><input value="${esc(dr.fin.reason||'')}" onchange="S.draft.fin.reason=this.value;save()"></div></div></div>`;
 h+=`<button class="btn good big" onclick="finishStrength()">Finish + save</button>`;
 return h;
}
const exName=ei=>{const o=W[S.draft.session][ei][0];return S.draft.swaps[o]||o};
function addExtra(ei){const d=S.draft,n=exName(ei);d.extra=d.extra||{};d.extra[n]=(d.extra[n]||0)+1;save();render()}
function delExtra(ei){const d=S.draft,n=exName(ei),base=d.short?1:W[d.session][ei][1];d.extra[n]=Math.max(0,(d.extra[n]||0)-1);if(d.sets[n])d.sets[n]=d.sets[n].slice(0,base+d.extra[n]);save();render()}
function addWarm(ei){const d=S.draft,n=exName(ei);d.warm=d.warm||{};(d.warm[n]=d.warm[n]||[]).push(['','']);save();render()}
function setWarm(ei,k,j,v){const d=S.draft,n=exName(ei);d.warm[n][k][j]=v.trim();save()}
function delWarm(ei,k){const d=S.draft,n=exName(ei);d.warm[n].splice(k,1);save();render()}
function tickSet(ei,i){
 const d=S.draft,name=exName(ei),w=$('w'+ei+'_'+i).value.trim(),r=$('r'+ei+'_'+i).value.trim();
 if(!r)return alert('Enter your reps first.');
 d.sets[name]=d.sets[name]||[];const was=d.sets[name][i]&&d.sets[name][i][2];d.sets[name][i]=[w,r,!was];
 if(!was){const rest=restFor(W[d.session][ei][0]);if(rest)S.rest={end:Date.now()+rest*1000,label:name}}
 save();render();
}
function exInfo(ei){const e=W[S.draft.session][ei];openSheet(`<h2>${esc(e[0])}</h2><div class="muted">${e[1]} sets × ${esc(e[2])} · rest ${restFor(e[0])?'1 min':'none'}</div><div class="note">${esc(e[3])}</div><button class="btn" style="margin-top:12px" onclick="closeSheet()">Close</button>`)}
function exHist(ei){const n=exName(ei),h=exHistory(n,'9999').slice(-5).reverse();openSheet(`<h2>${esc(n)} – last ${h.length||0}</h2>${h.length?h.map(l=>`<div class="note"><b>${fmt(l.date)}</b> · ${l.warm&&l.warm[n]&&l.warm[n].length?`<span class="muted">warm-up ${l.warm[n].map(x=>`${x[0]||'BW'}×${x[1]}`).join(', ')} · </span>`:''}${l.sets[n].filter(Boolean).map(x=>`${x[0]||'BW'}×${x[1]}`).join(', ')}</div>`).join(''):'<div class="muted">No history yet.</div>'}<button class="btn" style="margin-top:12px" onclick="closeSheet()">Close</button>`)}
function swapEx(ei){
 const o=W[S.draft.session][ei][0],mem=S.swapMemory[o]||[];
 openSheet(`<h2>Swap ${esc(o)}</h2><div class="muted">Machine taken? Pick a swap. It keeps its own history.</div><div class="stack" style="margin-top:10px">
 ${S.draft.swaps[o]?`<button class="btn alt" onclick="doSwap(${ei},'')">Back to ${esc(o)}</button>`:''}${mem.map((m,k)=>`<button class="btn alt" onclick="doSwap(${ei},${k})">${esc(m)}</button>`).join('')}</div>
 <label>New swap</label><input id="swN" placeholder="e.g. Smith Machine Incline Press"><button class="btn good" style="margin-top:10px" onclick="doSwap(${ei},'new')">Use this</button>`);
}
function doSwap(ei,k){const o=W[S.draft.session][ei][0];let n;if(k==='')n='';else if(k==='new'){n=$('swN').value.trim();if(!n)return;S.swapMemory[o]=[...new Set([...(S.swapMemory[o]||[]),n])]}else n=S.swapMemory[o][k];if(n)S.draft.swaps[o]=n;else delete S.draft.swaps[o];save();closeSheet();render()}
function cancelDraft(){if(confirm('Discard this session?')){S.draft=null;S.rest=null;save();render()}}
function finishStrength(){
 const d=S.draft,total=W[d.session].reduce((a,e)=>a+e[1],0);let n=0;Object.values(d.sets).forEach(a=>a.forEach(x=>{if(x&&x[1]&&x[2])n++}));
 if(!n)return alert('Tick at least one set.');let st=d.short?'short':'done';
 if(!d.short){if(n/total<.7){if(!confirm(`Only ${n}/${total} sets ticked. Save as the short version?`))return;st='short'}else if(!d.fin.kcal&&!d.fin.reason)return alert('Log the finisher calories, or a reason you skipped it.')}
 if(!d.fin.type)d.fin.type='StairMaster';
 let beat=0,of=0;for(const [nm,a] of Object.entries(d.sets)){const pv=lastSets(nm,d.date);if(!pv)continue;of++;if(Math.max(...a.map(setScore))>Math.max(...pv.map(setScore)))beat++}
 addLog({planId:d.planId,date:d.date,session:d.session,kind:'gym',status:st,sets:d.sets,warm:d.warm||{},swaps:d.swaps,fin:d.fin,beat,of,mins:Math.round((Date.now()-d.startedAt)/6e4)});
 S.gymNext=(GYM.indexOf(d.session)+1)%4;S.draft=null;S.rest=null;save();
 toast((st==='done'?'Session done ✓':'Short version ✓')+(of?` · beat last time on ${beat}/${of}`:''));go('today');
}
function finishCardio(){const d=S.draft,m=+$('cm').value||0;if(m<15)return alert('Under 15 minutes doesn’t count – keep going.');addLog({planId:d.planId,date:d.date,session:d.session,kind:d.session==='Walk'?'walk':'cardio',status:m>=(d.session==='Walk'?20:25)?'done':'short',type:$('ck').value,min:m,kcal:$('cc').value});S.draft=null;save();toast('Logged ✓');go('today')}
function lateLog(){const y=addDays(today(),-1),its=[...itemsOn(y),...itemsOn(addDays(y,-1))].filter(i=>!logFor(i)&&i.s!=='Match');openSheet(`<h2>Log a late session</h2><div class="muted">Only for sessions you actually did. It will show as <b>Late</b>.</div><div class="stack" style="margin-top:10px">${its.length?its.map(i=>`<button class="btn alt" onclick="closeSheet();startItem('${i.id}')">${esc(i.s)} · ${fmt(i.date)}</button>`).join(''):'<div class="muted">Nothing unlogged in the last 2 days.</div>'}</div>`)}
const verified=l=>l.kind==='match'||((S.health[l.date]||{}).workoutMinutes||0)>=15;
function tickTimer(){
 const r=S.rest,el=$('restBar');
 if(S.draft&&$('elapsed'))$('elapsed').textContent='Session time '+Math.floor((Date.now()-S.draft.startedAt)/6e4)+' min';
 if(!el)return;if(!r){el.classList.add('hidden');return}
 const left=Math.ceil((r.end-Date.now())/1000);
 if(left<=0){el.innerHTML=`<b>Rest done – next set 💪</b><button onclick="S.rest=null;save();tickTimer()">OK</button>`;el.classList.remove('hidden');el.classList.add('doneR');return}
 el.classList.remove('hidden','doneR');el.innerHTML=`<span>Rest · ${esc(r.label)}</span><b>${Math.floor(left/60)}:${pad(left%60)}</b><button onclick="S.rest.end+=30000;save();tickTimer()">+30s</button><button onclick="S.rest=null;save();tickTimer()">Skip</button>`;
}

/* ================= PROGRESS ================= */
function viewProgress(){
 const ws=weights(),kg=currentKg(),start=S.baseline.kg,hM=S.heightCm/100,m=monthInfo(),t=today();
 let h=`<h1>Progress</h1>`;
 h+=`<div class="card"><div class="row between"><h2>Monday check-ins</h2><span class="muted small">On-time streak: <b>${checkinStreak()}</b></span></div>
 <div class="grid3"><div class="stat"><b>${kg}</b><span>kg now</span></div><div class="stat"><b>${(kg-start).toFixed(1)}</b><span>kg since start</span></div><div class="stat"><b>${(kg/(hM*hM)).toFixed(1)}</b><span>BMI</span></div></div>${chart(ws)}
 <button class="btn ${checkinDue()?'good':'alt'}" style="margin-top:8px" onclick="openCheckin()">${checkinDue()?'Do this week’s check-in':'Edit this week’s check-in'}</button>
 <div id="photoCompare" class="photoCmp"></div></div>`;
 // events
 h+=`<div class="card"><div class="row between"><h2>Big days</h2><button class="btn sm alt" onclick="editEvent()">+ Add</button></div>${eventsHtml(kg)}</div>`;
 // milestones
 const ml=milestones(),open=ml.filter(x=>!x.done),done=ml.filter(x=>x.done);
 h+=`<div class="card"><h2>Milestones</h2>${open.slice(0,4).map(x=>`<div style="margin:8px 0"><div class="row between small"><span>${esc(x.label)}</span><span class="muted">${x.sub||Math.round(x.prog*100)+'%'}</span></div>${bar(x.prog*100,x.type==='kg'?'g':'c')}</div>`).join('')}
 ${done.length?`<h3>Achieved</h3>${done.map(x=>`<div class="small">🏅 ${esc(x.label)}${x.done!=='✓'?' · '+fmt(x.done):''}</div>`).join('')}`:''}${S.reward?`<div class="note">Reward at a 4-week streak: <b>${esc(S.reward)}</b></div>`:''}</div>`;
 // step challenge
 h+=`<div class="card"><div class="row between"><h2>${fmt(m.ym+'-01',{month:'long'})} step challenge</h2><span class="chip ${m.done?'done':m.bal>=0?'done':'missed'}">${m.done?'Complete ✓':(m.bal>=0?'Ahead ':'Behind ')+n0(Math.abs(m.bal))}</span></div>
 ${bar(m.pct,'s')}<div class="grid3" style="margin-top:8px"><div class="stat"><b>${n0(m.total)}</b><span>of ${n0(m.goal)}</span></div><div class="stat"><b>${n0(m.remaining)}</b><span>to go</span></div><div class="stat"><b>${m.done?'✓':n0(m.need)}</b><span>${m.done?'done':'needed / day'}</span></div></div>
 <div class="muted small" style="margin-top:6px">Daily target ${n0(m.perDay)} · ${m.daysLeft} days left (incl. today)</div>
 <table class="bal"><tr><th>Day</th><th>Steps</th><th>+/−</th><th>Balance</th></tr>${[...m.rows].reverse().map(r=>`<tr><td>${fmt(r.d,{weekday:'short',day:'numeric'})}</td><td>${n0(r.v)}</td><td class="${r.diff>=0?'pos':'neg'}">${r.diff>=0?'+':''}${n0(r.diff)}</td><td class="${r.bal>=0?'pos':'neg'}">${r.bal>=0?'+':''}${n0(r.bal)}</td></tr>`).join('')}</table></div>`;
 // weeks
 h+=`<h3>Weekly scores</h3>`;for(let i=0;i<6;i++){const w=addDays(weekStart(t),-7*i);if(w<weekStart(S.start))break;const s=weekStats(w);h+=`<details class="card"><summary class="row between"><b>${fmt(w)}</b><span>${s.starter?'Starter · ':''}${s.gym}/${s.tg.gym} gym · ${s.cardio}/${s.tg.cardio} cardio ${s.hit?'<span class="chip done">Hit</span>':i===0?'<span class="chip pending">In progress</span>':'<span class="chip missed">Missed</span>'}</span></summary>${reviewHtml(w,s)}</details>`}
 // overload
 const hist={};[...S.logs].sort((a,b)=>a.date.localeCompare(b.date)).forEach(l=>{if(l.sets)Object.entries(l.sets).forEach(([n,a])=>{const sc=Math.max(...a.map(setScore));if(sc)(hist[n]=hist[n]||[]).push({sc,best:Math.max(...a.map(x=>parseFloat(x&&x[0])||0))})})});
 const stalled=Object.entries(hist).filter(([n,a])=>a.length>=4&&Math.max(...a.slice(-3).map(x=>x.sc))<=Math.max(...a.slice(0,-3).map(x=>x.sc))).map(e=>e[0]);
 const rec=S.logs.filter(l=>l.of).slice(-8),bt=rec.reduce((a,l)=>[a[0]+l.beat,a[1]+l.of],[0,0]);
 h+=`<h3>Strength</h3><div class="card"><div class="grid2"><div class="stat"><b>${bt[1]?Math.round(bt[0]/bt[1]*100)+'%':'–'}</b><span>exercises beaten vs last time (8 sessions)</span></div><div class="stat"><b>${stalled.length}</b><span>stalled 3+ sessions</span></div></div>
 ${stalled.length?`<div class="note">Stalled: ${stalled.map(esc).join(', ')}. Check sleep + food first, then ask the PT.</div>`:''}
 ${Object.entries(hist).map(([n,a])=>`<div class="row between small" style="padding:4px 0"><span>${esc(n)}</span><b>${a[0].best} → ${Math.max(...a.map(x=>x.best))} kg</b></div>`).join('')||'<div class="muted small" style="margin-top:6px">Lifts show here after your first sessions.</div>'}</div>`;
 h+=`<button class="btn alt" onclick="shareWeek()">📤 Share my week</button>`;
 setTimeout(loadCompare,0);return h;
}
function eventsHtml(kg){
 return events().map(e=>{const past=e.date<today(),tg=+e.kg,wk=Math.max(1,daysTo(e.date)/7),hitW=tg&&weights().find(w=>w.kg<=tg&&w.date<=e.date);
  return `<div class="itemRow ${past?'past':''}" onclick="editEvent('${e.id}')"><div><b>${e.icon||'📅'} ${esc(e.name)}</b><div class="muted small">${fmt(e.date,{day:'numeric',month:'short',year:'numeric'})} · ${past?'done':daysTo(e.date)+' days'}</div></div>
  <div class="small" style="text-align:right">${tg?(hitW?`<span class="chip done">${tg}kg hit ✓</span>`:past?`<span class="chip missed">target ${tg}kg</span>`:`target ${tg}kg<br><b>${kg>tg?((kg-tg)/wk).toFixed(2)+' kg/wk needed':'on target ✓'}</b>`):'<span class="muted">tap to set target</span>'}</div></div>`}).join('');
}
function editEvent(id){
 const e=S.events.find(x=>x.id===id)||{id:'',name:'',date:'',kg:'',icon:'🎉'},fixed=['suit','wedding'].includes(id);
 openSheet(`<h2>${id?'Edit':'Add a big day'}</h2><div class="muted">Stag, holiday, family wedding, birthday – anything worth a mini target.</div>
 <label>Name</label><input id="evN" value="${esc(e.name)}" placeholder="e.g. Stag in Lisbon" ${fixed?'readonly':''}>
 <label>Date</label><input id="evD" type="date" value="${e.date}"><label>Target weight on the day (kg, optional)</label><input id="evK" type="number" inputmode="decimal" step="0.5" value="${e.kg}">
 <label>Icon</label><select id="evI">${['🎉','🍻','✈️','🤵','💍','🎂','⚽','🏖️','📸'].map(i=>`<option ${i===e.icon?'selected':''}>${i}</option>`).join('')}</select>
 <button class="btn good big" onclick="saveEvent('${id||''}')">Save</button>${id&&!fixed?`<button class="btn bad" style="margin-top:8px" onclick="delEvent('${id}')">Delete</button>`:''}`);
}
function saveEvent(id){const n=$('evN').value.trim(),d=$('evD').value;if(!n||!d)return alert('Add a name and date.');let e=S.events.find(x=>x.id===id);if(!e){e={id:uid()};S.events.push(e)}Object.assign(e,{name:n,date:d,kg:$('evK').value,icon:$('evI').value});save();closeSheet();toast('Saved');render()}
function delEvent(id){S.events=S.events.filter(e=>e.id!==id);save();closeSheet();render()}
function chart(ws){if(ws.length<2)return '<div class="muted small" style="margin-top:8px">Chart starts after your first Monday check-in.</div>';
 const p=ws.slice(-20),mn=Math.min(...p.map(x=>x.kg))-1,mx=Math.max(...p.map(x=>x.kg))+1,Wd=320,H=120,xy=p.map((x,i)=>[10+i*(Wd-20)/(p.length-1),10+(mx-x.kg)/(mx-mn)*(H-20)]);
 return `<svg viewBox="0 0 ${Wd} ${H}" style="width:100%;margin-top:10px"><polyline fill="none" stroke="#3b82f6" stroke-width="3" points="${xy.map(q=>q.join(',')).join(' ')}"/>${xy.map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="#93c5fd"/>`).join('')}<text x="4" y="10">${mx.toFixed(0)}</text><text x="4" y="${H-2}">${mn.toFixed(0)}</text></svg>`}
async function loadCompare(){
 const el=$('photoCompare');if(!el)return;const keys=(await allPhotoKeys()||[]).filter(k=>k.endsWith('_front')).sort();if(!keys.length){el.innerHTML='<div class="muted small" style="margin-top:8px">Photo comparison appears after your first photo check-in.</div>';return}
 const a=await getPhoto(keys[0]),b=keys.length>1?await getPhoto(keys.at(-1)):null;
 el.innerHTML=`<div class="grid2" style="margin-top:10px"><figure><img src="${a}"><figcaption>${fmt(keys[0].slice(0,10))}</figcaption></figure>${b?`<figure><img src="${b}"><figcaption>${fmt(keys.at(-1).slice(0,10))}</figcaption></figure>`:'<div class="muted small">Next photo shows here side by side.</div>'}</div>`;
}

/* ---------- Monday check-in ---------- */
function openCheckin(){
 const ws=weekStart(today()),c=S.checkins[ws]||{},late=parse(today()).getDay()!==1;
 openSheet(`<h2>Monday check-in</h2><div class="muted">First thing in the morning, after the toilet, before food or drink. Same spot, same light, same clothes for photos.</div>
 ${late?'<div class="banner warn">This is late – it will be marked late. Next Monday, do it before anything else.</div>':''}
 <label>Weight (kg)</label><input id="ciKg" type="number" inputmode="decimal" step="0.1" value="${c.kg||''}">
 <label>Front photo</label><input id="ciF" type="file" accept="image/*" capture="user">
 <label>Side photo</label><input id="ciS" type="file" accept="image/*" capture="user">
 <div class="muted xs">Photos stay on this phone only. They’re never uploaded.</div>
 <button class="btn good big" onclick="saveCheckin()">Save check-in</button>`);
}
async function saveCheckin(){
 const kg=parseFloat($('ciKg').value);if(!kg||kg<40||kg>250)return alert('Enter your weight.');
 const ws=weekStart(today()),f=$('ciF').files[0],sd=$('ciS').files[0],prev=S.checkins[ws]||{};let photos=prev.photos||0;
 try{if(f){await putPhoto(today()+'_front',await compress(f));photos++}if(sd){await putPhoto(today()+'_side',await compress(sd));photos++}}catch(e){alert('Photo could not be saved – weight saved anyway.')}
 if(!photos&&!confirm('No photo this week? Photos show changes the scales miss. Save without?'))return;
 S.checkins[ws]={date:today(),kg,photos,late:parse(today()).getDay()!==1};save();closeSheet();
 const ms=milestones().filter(m=>m.type==='kg'&&m.done===today());toast(ms.length?`🏅 Milestone: ${ms[0].label}!`:'Check-in saved ✓');render();
}

/* ---------- share ---------- */
function weekSummary(ws=weekStart(today())){
 const s=weekStats(ws),ci=S.checkins[ws],kg=currentKg(),m=monthInfo();
 return `Evan – week of ${fmt(ws,{day:'numeric',month:'short'})}
🏋️ Gym ${s.gym}/${s.tg.gym} · 🏃 Cardio ${s.cardio}/${s.tg.cardio}${s.matches?` (${s.matches} match${s.matches>1?'es':''})`:''} ${s.hit?'✅':''}
🔥 Weekly streak: ${weeklyStreak()}
👟 Steps: ${n0(s.steps)} this week · month ${n0(m.total)}/${n0(m.goal)} (${m.bal>=0?'+':''}${n0(m.bal)})
💧 Water avg: ${(s.waterAvg/1000).toFixed(1)}L
⚖️ ${kg}kg (${(kg-S.baseline.kg).toFixed(1)} since start) · Monday check-in ${s.starter?'starts next Monday':ci?(ci.late?'late':'✓'):'✗'}
${s.skipped||s.missed?`Missed/skipped: ${s.missed+s.skipped}`:'No missed sessions 👊'}
⏳ ${events().filter(e=>e.date>=today()).slice(0,3).map(e=>`${daysTo(e.date)} days to ${e.name}`).join(' · ')}`;
}
async function shareWeek(){const text=weekSummary();try{if(navigator.share){await navigator.share({text});return}}catch(e){if(e&&e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(text);toast('Copied – paste into a message')}catch(e){openSheet(`<h2>Share my week</h2><textarea rows="10">${esc(text)}</textarea>`)}}

/* ================= SETTINGS ================= */
function viewMore(){
 const f=(id,l,v,t='text',ph='')=>`<label>${l}</label><input id="${id}" type="${t}" value="${esc(v)}" placeholder="${ph}">`;
 return `<h1>Settings</h1>
 <div class="card"><h2>Your rules</h2><div class="muted small">In your own words. Shown back to you when you’re about to skip.</div>
 <label>Why I’m doing this</label><textarea id="sw" rows="2" placeholder="e.g. Feel great in the suit and on the wedding day">${esc(S.why)}</textarea>
 <label>My tired rule</label><textarea id="st" rows="2">${esc(S.tiredRule)}</textarea>${f('sr2','Reward for a 4-week streak',S.reward,'text','e.g. new ref watch')}</div>
 <div class="card"><h2>Goals</h2><div class="grid2">${f('tg','Goal weight kg',S.goalKg,'number')}${f('th','Height cm',S.heightCm,'number')}</div><div class="muted small">Suit fitting, wedding, stag and other big days: Progress → Big days.</div></div>
 <div class="card"><h2>Daily targets</h2><div class="grid2">${f('tsteps','Steps / day',S.targets.steps,'number')}${f('tw','Water ml',S.targets.water,'number')}${f('tp','Protein g',S.targets.protein,'number')}${f('tt','Gym-day kcal',S.targets.train,'number')}${f('tr','Other-day kcal',S.targets.rest,'number')}${f('tm','This month’s step goal',S.monthGoals[today().slice(0,7)]||'','number','auto: steps/day × days')}</div><div class="muted small">Calorie targets are a trial – review after 2–3 weeks against weight trend, hunger and energy.</div></div>
 <div class="card"><h2>Shift rota</h2>${f('sd','First day shift of any block',S.day1,'date')}<div class="muted small">2 days, 2 nights, 4 off. Extra shifts: 🕐 button on Today/Plan.</div></div>
 <div class="card"><h2>Garmin sync</h2><div class="muted small">Garmin Connect → Apple Health → iPhone Shortcut → hub.</div>${f('tk','Sync key',S.syncToken)}
 <button class="btn alt" style="margin-top:8px" onclick="saveSettings();syncHealth(true)">Test connection</button>
 <details><summary>Shortcut setup</summary><div class="note"><b>A. Garmin → Apple Health</b><br>Garmin Connect app → More → Settings → Connected Apps → Apple Health → turn on Steps, Sleep, Workouts.<br><br>
 <b>B. Shortcut named exactly “Evan Steps”</b> (Shortcuts app → +):<br>
 1. <i>Find Health Samples</i> → Steps, Start Date is Today → <i>Calculate Statistics</i> Sum → <i>Set Variable</i> Today.<br>
 2. Same again with Start Date is Yesterday → variable Yesterday.<br>
 3. <i>Get Contents of URL</i>: <code>${location.origin}/.netlify/functions/health</code> · Method POST · Header <code>x-token</code> = your sync key · Request Body JSON: <code>date</code> = Current Date (format yyyy-MM-dd), <code>steps</code> = Today, <code>yesterdaySteps</code> = Yesterday.<br>
 4. Optional: add Sleep (hours) and Workouts (minutes) the same way as <code>sleepHours</code> / <code>workoutMinutes</code>.<br><br>
 <b>C. Automations</b> (Shortcuts → Automation → + → Time of Day): 7am, 12pm, 4pm, 8pm, 11pm → run “Evan Steps” → <b>Run Immediately</b>, notifications off.<br><br>
 The ↻ button on Today runs it on demand. Steps only ever go up within a day, and yesterday’s total is topped up each morning.</div></details></div>
 <div class="card"><h2>Reminders</h2><div class="muted small">Adds weekly alerts to his Calendar: Monday 6:30am check-in, Sunday 6pm plan + prep, Sunday 8pm share week.</div><button class="btn alt" style="margin-top:8px" onclick="downloadICS()">Add reminders to Calendar</button></div>
 <button class="btn good big" onclick="saveSettings()">Save settings</button>
 <div class="card"><h2>Backup</h2><div class="muted small">Everything (incl. photos) lives on this phone. Export every couple of weeks.</div><div class="grid2" style="margin-top:8px"><button class="btn alt" onclick="exportData()">Export</button><button class="btn alt" onclick="$('imp').click()">Import</button></div><input id="imp" type="file" accept=".json" class="hidden" onchange="importData(this.files[0])"></div>`;
}
function saveSettings(){
 const v=id=>$(id).value.trim();S.why=v('sw');S.tiredRule=v('st')||blank.tiredRule;S.reward=v('sr2');S.goalKg=v('tg');S.heightCm=+v('th')||178;
 S.targets={steps:+v('tsteps')||8000,water:+v('tw')||3000,protein:+v('tp')||180,train:+v('tt')||2250,rest:+v('tr')||1800};
 const ym=today().slice(0,7);if(v('tm'))S.monthGoals[ym]=+v('tm');else delete S.monthGoals[ym];
 if(v('sd'))S.day1=v('sd');S.syncToken=v('tk');save();toast('Saved');syncHealth();render();
}
async function exportData(){const photos={};for(const k of (await allPhotoKeys()||[]))photos[k]=await getPhoto(k);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({...S,photos})],{type:'application/json'}));a.download='evan-hub-backup-'+today()+'.json';a.click()}
function importData(file){if(!file)return;file.text().then(async t=>{try{const d=JSON.parse(t);if(!d.v)throw 0;if(!confirm('Replace everything on this phone with the backup?'))return;const ph=d.photos||{};delete d.photos;for(const k in ph)await putPhoto(k,ph[k]);S=Object.assign(structuredClone(blank),d);save();render();toast('Backup restored')}catch(e){alert('Not a valid backup.')}})}
function downloadICS(){
 const t=today(),nextDow=n=>{let d=t;while(parse(d).getDay()!==n)d=addDays(d,1);return d.replace(/-/g,'')},st=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
 const ev=[[1,'0630','Monday check-in: scales + photo before food'],[0,'1800','Plan next week + food prep (Evan’s Hub)'],[0,'2000','Share your week (Evan’s Hub)']];
 let s='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EvanHub//EN\r\n';
 ev.forEach(([dw,tm,ti],i)=>{s+=`BEGIN:VEVENT\r\nUID:evanhub10-${i}@hub\r\nDTSTAMP:${st}\r\nDTSTART:${nextDow(dw)}T${tm}00\r\nDURATION:PT15M\r\nRRULE:FREQ=WEEKLY\r\nSUMMARY:${ti}\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:PT0M\r\nDESCRIPTION:${ti}\r\nEND:VALARM\r\nEND:VEVENT\r\n`});
 s+='END:VCALENDAR\r\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([s],{type:'text/calendar'}));a.download='evan-reminders.ics';a.click();
}
async function syncHealth(report=false){
 if(!S.syncToken||location.protocol==='file:'){if(report)alert('Add the sync key first (and open the hub from its Netlify address).');return}
 try{const r=await fetch('/.netlify/functions/health',{headers:{'x-token':S.syncToken}});
  if(report){if(r.status===404)return alert('Sync function not found (404). The Netlify function isn’t deployed – see README: deploy via GitHub or Netlify CLI.');if(r.status===401)return alert('Sync key doesn’t match HEALTH_TOKEN in Netlify.')}
  if(!r.ok)return;const d=await r.json();Object.assign(S.health,d);save();if(tab!=='train'||!S.draft)render();
  if(report){const days=Object.keys(d).sort(),last=days.at(-1);alert(days.length?`Connected ✓ ${days.length} day(s) received. Latest: ${fmt(last)} – ${n0(d[last].steps)} steps.`:'Connected ✓ but no data yet. Run the Shortcut once on the phone.')}}
 catch(e){if(report)alert('Could not reach the sync function.')}
}
function runSync(){S.syncAsked=Date.now();save();location.href='shortcuts://run-shortcut?name='+encodeURIComponent('Evan Steps')}

/* ================= render ================= */
const TABS=[['today','◉','Today'],['plan','▦','Plan'],['train','▲','Train'],['progress','↗','Progress'],['more','⚙︎','Settings']];
function render(){
 $('app').innerHTML=({today:viewToday,plan:viewPlan,train:viewTrain,progress:viewProgress,more:viewMore})[tab]();
 $('nav').innerHTML=TABS.map(([k,i,l])=>`<button class="${tab===k?'sel':''}" onclick="go('${k}')"><span>${i}</span>${l}${k==='progress'&&checkinDue()?'<i class="dotB"></i>':''}</button>`).join('');
 tickTimer();
}
function boot(){week(weekStart(today()));if(S.draft)tab='train';render();syncHealth();if(!timerInt)timerInt=setInterval(tickTimer,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();syncHealth()}})}
