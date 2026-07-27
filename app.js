
const pages=[...document.querySelectorAll('.page')],nav=[...document.querySelectorAll('.nav')],sidebar=document.getElementById('sidebar');
function showPage(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));nav.forEach(n=>n.classList.toggle('active',n.dataset.page===id));sidebar.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'','#'+id)}
nav.forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
document.getElementById('menu').addEventListener('click',()=>sidebar.classList.toggle('open'));
if(localStorage.getItem('nala-theme-v3')==='dark')document.body.classList.add('dark');
document.getElementById('theme').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('nala-theme-v3',document.body.classList.contains('dark')?'dark':'light')});
document.querySelectorAll('.speak').forEach(b=>b.addEventListener('click',()=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.speak);u.lang='en-US';u.rate=.88;speechSynthesis.speak(u)}));
document.querySelectorAll('.view').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');const c=document.getElementById('readerContent');c.classList.remove('view-en','view-zh');if(b.dataset.view==='en')c.classList.add('view-en');if(b.dataset.view==='zh')c.classList.add('view-zh')}));
document.getElementById('readerSearch').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.reader-section').forEach(x=>x.style.display=!q||x.dataset.search.includes(q)?'block':'none')});
const progress=[...document.querySelectorAll('[data-progress]')];
progress.forEach(c=>{c.checked=localStorage.getItem('nala-'+c.dataset.progress)==='1';c.addEventListener('change',()=>{localStorage.setItem('nala-'+c.dataset.progress,c.checked?'1':'0');update()})});
const answer=document.getElementById('answer');answer.value=localStorage.getItem('nala-ep294-answer')||'';
function countWords(){const n=(answer.value.trim().match(/\b[\w’'-]+\b/g)||[]).length;document.getElementById('wordCount').textContent=n+' words'}
answer.addEventListener('input',()=>{localStorage.setItem('nala-ep294-answer',answer.value);countWords();update()});countWords();
function update(){
 const done=progress.filter(x=>x.checked).length,total=progress.length,pct=Math.round(done/total*100);
 const read=progress.filter(x=>x.dataset.progress.startsWith('read-')&&x.checked).length;
 const practices=['vocab','shadowing','speaking','review'].filter(k=>localStorage.getItem('nala-'+k)==='1').length;
 const outputDone=localStorage.getItem('nala-speaking')==='1'||answer.value.trim().length>20;
 document.getElementById('sidePct').textContent=pct+'%';document.getElementById('sideBar').style.width=pct+'%';
 document.getElementById('heroPct').textContent=pct+'%';document.getElementById('heroRing').style.background=`conic-gradient(var(--accent) ${pct*3.6}deg,#dce3db 0deg)`;
 document.getElementById('completedSteps').textContent=done+' / '+total+' steps';
 document.getElementById('libraryPct').textContent=pct+'%';document.getElementById('readerPct').textContent=Math.round(read/8*100)+'%';
 document.getElementById('progressRead').textContent=read+' / 8';document.getElementById('practiceDone').textContent=practices+' / 4';document.getElementById('progressTotal').textContent=pct+'%';
 document.getElementById('comprehensionBar').style.width=Math.round(read/8*100)+'%';
 document.getElementById('readStatus').textContent=read===8?'Completed':read?read+' / 8 sections':'Not started';
 document.getElementById('outputStatus').textContent=outputDone?'Completed':'Not started';document.getElementById('outputCount').textContent=outputDone?'1':'0';
 document.getElementById('spokenValue').textContent=outputDone?'1 completed':'0 completed';document.getElementById('spokenBar').style.width=outputDone?'100%':'0%';
 document.getElementById('outputOutcome').textContent=outputDone?'1 completed response':'Not completed';
}
update();
const searchable=[
 {title:'EP294 Full Reader',desc:'Complete English and Chinese transcript',page:'reader'},
 {title:'Touch grass',desc:'Internet slang: reconnect with real life',page:'vocabulary'},
 {title:'Chronically online',desc:'Spending too much time online',page:'vocabulary'},
 {title:'Terminally online',desc:'An exaggerated form of online overuse',page:'vocabulary'},
 {title:'Shadowing Studio',desc:'Six practice sentences',page:'shadowing'},
 {title:'Speaking Workspace',desc:'Build your own answer',page:'speaking'},
 {title:'Progress Dashboard',desc:'See visible learning outcomes',page:'progress'}
];
const global=document.getElementById('globalSearch'),results=document.getElementById('searchResults');
global.addEventListener('input',()=>{const q=global.value.trim().toLowerCase();if(!q){results.style.display='none';return}const hits=searchable.filter(x=>(x.title+' '+x.desc).toLowerCase().includes(q));results.innerHTML=hits.length?hits.map((x,i)=>`<div class="search-item" data-i="${i}"><b>${x.title}</b><small>${x.desc}</small></div>`).join(''):'<div class="search-item">No results</div>';results.style.display='block';results.querySelectorAll('[data-i]').forEach((el,i)=>el.addEventListener('click',()=>{showPage(hits[i].page);results.style.display='none';global.value=''}))});
document.addEventListener('click',e=>{if(!results.contains(e.target)&&e.target!==global)results.style.display='none'});
const initial=location.hash.slice(1);if(initial&&document.getElementById(initial))showPage(initial);
