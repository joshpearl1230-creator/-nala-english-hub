
const episodeConfig={ep251:{reads:8,total:12},ep294:{reads:8,total:12},ep350:{reads:11,total:15}};
const searchItems=[
 {title:'Simplified Speech #251 – Popular Baby Names',desc:'Names, family traditions, culture, and identity',url:rootPath()+'episodes/ep251.html'},
 {title:'Chatterbox #350 – Hyperblanding',desc:'Globalization, culture, AI, and sameness',url:rootPath()+'episodes/ep350.html'},
 {title:'Catch Word #294 – Touch Grass',desc:'Internet slang and online life',url:rootPath()+'episodes/ep294.html'},
 {title:'Vocabulary Database',desc:'28 reusable language assets',url:rootPath()+'vocabulary.html'},
 {title:'Episode Library',desc:'Browse all complete learning units',url:rootPath()+'library.html'},
 {title:'Progress Dashboard',desc:'See reading and output completion',url:rootPath()+'progress.html'}
];
function rootPath(){return location.pathname.includes('/episodes/')?'../':''}
const sidebar=document.getElementById('sidebar');document.getElementById('menu')?.addEventListener('click',()=>sidebar.classList.toggle('open'));
if(localStorage.getItem('nala-v4-theme')==='dark')document.body.classList.add('dark');
document.getElementById('theme')?.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('nala-v4-theme',document.body.classList.contains('dark')?'dark':'light')});
document.querySelectorAll('.choice-row button').forEach(b=>b.addEventListener('click',()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')}));
document.querySelectorAll('.speak').forEach(b=>b.addEventListener('click',()=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.speak);u.lang='en-US';u.rate=.88;speechSynthesis.speak(u)}));
function key(ep,step){return `nala-v4-${ep}-${step}`}
document.querySelectorAll('[data-episode][data-step]').forEach(c=>{c.checked=localStorage.getItem(key(c.dataset.episode,c.dataset.step))==='1';c.addEventListener('change',()=>{localStorage.setItem(key(c.dataset.episode,c.dataset.step),c.checked?'1':'0');updateAll()})});
document.querySelectorAll('.episode-answer').forEach(a=>{const k='nala-v4-answer-'+a.dataset.answer;a.value=localStorage.getItem(k)||'';const wc=a.closest('.speaking-card').querySelector('.word-count');const updateCount=()=>{wc.textContent=(a.value.trim().match(/\b[\w’'-]+\b/g)||[]).length+' words'};a.addEventListener('input',()=>{localStorage.setItem(k,a.value);updateCount();updateAll()});updateCount()});
function episodeProgress(ep){
 const cfg=episodeConfig[ep];let done=0;
 for(let i=1;i<=cfg.reads;i++)if(localStorage.getItem(key(ep,'read-'+i))==='1')done++;
 ['vocab','shadowing','speaking','review'].forEach(s=>{if(localStorage.getItem(key(ep,s))==='1')done++});
 return {done,total:cfg.total,pct:Math.round(done/cfg.total*100),readsDone:[...Array(cfg.reads)].filter((_,i)=>localStorage.getItem(key(ep,'read-'+(i+1)))==='1').length}
}
function updateAll(){
 Object.keys(episodeConfig).forEach(ep=>{const p=episodeProgress(ep);
 document.querySelectorAll(`[data-card-pct="${ep}"]`).forEach(x=>x.textContent=p.pct+'%');
 document.querySelectorAll(`[data-wide-bar="${ep}"]`).forEach(x=>x.style.width=p.pct+'%');
 document.querySelectorAll(`[data-reader-pct="${ep}"]`).forEach(x=>x.textContent=Math.round(p.readsDone/episodeConfig[ep].reads*100)+'%');
 document.querySelectorAll(`[data-progress-label="${ep}"]`).forEach(x=>x.textContent=p.done+' of '+p.total+' steps');
 document.querySelectorAll(`[data-ring="${ep}"]`).forEach(x=>{x.style.background=`conic-gradient(var(--accent) ${p.pct*3.6}deg,#dce3db 0deg)`;x.querySelector('span').textContent=p.pct+'%'});
 });
 const totalReads=episodeProgress('ep251').readsDone+episodeProgress('ep294').readsDone+episodeProgress('ep350').readsDone;
 const moduleDone=['ep251','ep294','ep350'].reduce((sum,ep)=>sum+['vocab','shadowing','speaking','review'].filter(s=>localStorage.getItem(key(ep,s))==='1').length,0);
 const outputs=['ep251','ep294','ep350'].filter(ep=>{const a=localStorage.getItem('nala-v4-answer-'+ep)||'';return localStorage.getItem(key(ep,'speaking'))==='1'||a.trim().length>20}).length;
 document.getElementById('readTotal')&&(document.getElementById('readTotal').textContent=totalReads+' / 19');
 document.getElementById('outputTotal')&&(document.getElementById('outputTotal').textContent=moduleDone+' / 8');
 document.getElementById('writtenOutputs')&&(document.getElementById('writtenOutputs').textContent=outputs+' completed responses');
 document.getElementById('outputMetric')&&(document.getElementById('outputMetric').textContent=outputs+' completed');
 document.getElementById('outputBar')&&(document.getElementById('outputBar').style.width=(outputs/2*100)+'%');
}
updateAll();
document.querySelectorAll('.reader-view').forEach(b=>b.addEventListener('click',()=>{const toolbar=b.closest('.reader-toolbar');toolbar.querySelectorAll('.reader-view').forEach(x=>x.classList.remove('active'));b.classList.add('active');const content=toolbar.parentElement.querySelector('.reader-content');content.classList.remove('view-en','view-zh');if(b.dataset.view==='en')content.classList.add('view-en');if(b.dataset.view==='zh')content.classList.add('view-zh')}));
document.querySelectorAll('.font-control').forEach(b=>b.addEventListener('click',()=>{const content=b.closest('.reader-toolbar').parentElement.querySelector('.reader-content');content.classList.remove('font-large','font-small');if(b.dataset.font==='+')content.classList.add('font-large');else content.classList.add('font-small')}));
document.querySelectorAll('.reader-search').forEach(input=>input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();input.closest('section').querySelectorAll('.reader-section').forEach(s=>s.style.display=!q||s.dataset.readerSearch.includes(q)?'block':'none')}));
document.querySelectorAll('.vocab-search').forEach(input=>input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();input.closest('section').querySelectorAll('.word-card').forEach(s=>s.style.display=!q||s.dataset.filterText.includes(q)?'block':'none')}));
document.getElementById('globalVocabSearch')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.global-word').forEach(s=>s.style.display=!q||s.dataset.filterText.includes(q)?'block':'none')});
const siteSearch=document.getElementById('siteSearch'),panel=document.getElementById('searchPanel');
siteSearch?.addEventListener('input',()=>{const q=siteSearch.value.trim().toLowerCase();if(!q){panel.classList.remove('show');return}const hits=searchItems.filter(x=>(x.title+' '+x.desc).toLowerCase().includes(q));panel.innerHTML=hits.length?hits.map(x=>`<a class="search-item" href="${x.url}"><b>${x.title}</b><small>${x.desc}</small></a>`).join(''):'<div class="search-item">No results</div>';panel.classList.add('show')});
document.addEventListener('click',e=>{if(panel&&!panel.contains(e.target)&&e.target!==siteSearch)panel.classList.remove('show')});
