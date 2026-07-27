const pages=[...document.querySelectorAll('.page')];
const navItems=[...document.querySelectorAll('.nav-item')];
const sidebar=document.getElementById('sidebar');
function showPage(id){
  pages.forEach(p=>p.classList.toggle('active',p.id===id));
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===id));
  sidebar.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  history.replaceState(null,'',`#${id}`);
}
navItems.forEach(n=>n.addEventListener('click',()=>showPage(n.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.go)));
document.getElementById('menuButton').addEventListener('click',()=>sidebar.classList.toggle('open'));
document.querySelectorAll('[data-anchor]').forEach(b=>b.addEventListener('click',()=>{
  document.getElementById(b.dataset.anchor).scrollIntoView({behavior:'smooth',block:'start'});
}));
const savedTheme=localStorage.getItem('nala-theme');
if(savedTheme==='dark') document.body.classList.add('dark');
document.getElementById('themeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('nala-theme',document.body.classList.contains('dark')?'dark':'light');
});
document.querySelectorAll('.speak-button').forEach(btn=>btn.addEventListener('click',()=>{
  if(!('speechSynthesis' in window)) return alert('当前浏览器不支持朗读功能。');
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(btn.dataset.speak);u.lang='en-US';u.rate=.88;speechSynthesis.speak(u);
}));
document.querySelectorAll('[data-reveal]').forEach(btn=>btn.addEventListener('click',()=>{
  document.getElementById(btn.dataset.reveal).classList.toggle('show');
}));
const answer=document.getElementById('personalAnswer');
answer.value=localStorage.getItem('ep294-personal-answer')||'';
answer.addEventListener('input',()=>localStorage.setItem('ep294-personal-answer',answer.value));
const checks=[...document.querySelectorAll('.progress-check')];
checks.forEach(c=>{
  c.checked=localStorage.getItem(`ep294-${c.dataset.key}`)==='1';
  c.addEventListener('change',()=>{localStorage.setItem(`ep294-${c.dataset.key}`,c.checked?'1':'0');updateProgress();});
});
function updateProgress(){
  const done=checks.filter(c=>c.checked).length;
  const pct=Math.round(done/checks.length*100);
  document.getElementById('sideProgressText').textContent=pct+'%';
  document.getElementById('sideProgressBar').style.width=pct+'%';
  document.getElementById('homeProgress').textContent=pct+'%';
}
document.getElementById('markEpisode').addEventListener('click',()=>{
  checks.forEach(c=>{c.checked=true;localStorage.setItem(`ep294-${c.dataset.key}`,'1')});updateProgress();
  alert('EP294 已标记为完成！');
});
updateProgress();
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.expression-card').forEach(card=>{
    card.style.display=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter?'block':'none';
  });
}));
document.getElementById('quizForm').addEventListener('submit',e=>{
  e.preventDefault();
  const answers={q1:'b',q2:'a',q3:'b',q4:'a',q5:'c'};
  let score=0;
  Object.entries(answers).forEach(([q,a])=>{const pick=document.querySelector(`input[name="${q}"]:checked`);if(pick&&pick.value===a)score++;});
  const box=document.getElementById('quizResult');
  box.textContent=`你的得分：${score}/5 ${score===5?'🎉 完全掌握！':score>=3?'👏 很不错，再复习一下易错点。':'📚 建议重新阅读本期笔记。'}`;
  localStorage.setItem('ep294-quiz-score',score);
  if(score===5){const review=checks.find(c=>c.dataset.key==='output');}
});
const searchable=[
  {title:'Touch grass',text:'少上网，回归现实。语气较强。',page:'ep294',anchor:'touch-grass'},
  {title:'Chronically online',text:'长期花太多时间上网，常用于自嘲。',page:'ep294',anchor:'online'},
  {title:'Terminally online',text:'夸张地形容严重沉迷网络。',page:'ep294',anchor:'online'},
  {title:'Doomscroll',text:'不停刷负面新闻或内容。',page:'ep294',anchor:'vocab'},
  {title:'Lose touch with reality',text:'与现实脱节。',page:'ep294',anchor:'vocab'},
  {title:'That doesn’t shock me one bit.',text:'我一点也不意外。',page:'ep294',anchor:'vocab'}
];
const search=document.getElementById('globalSearch'),panel=document.getElementById('searchPanel');
search.addEventListener('input',()=>{
  const q=search.value.trim().toLowerCase();
  if(!q){panel.classList.remove('show');return;}
  const hits=searchable.filter(x=>(x.title+' '+x.text).toLowerCase().includes(q));
  panel.innerHTML=hits.length?hits.map((x,i)=>`<div class="search-result" data-i="${i}"><strong>${x.title}</strong><small>${x.text}</small></div>`).join(''):'<div class="search-result">没有找到相关内容</div>';
  panel.classList.add('show');
  [...panel.querySelectorAll('[data-i]')].forEach((el,idx)=>el.addEventListener('click',()=>{
    const x=hits[idx];showPage(x.page);setTimeout(()=>document.getElementById(x.anchor).scrollIntoView({behavior:'smooth'}),80);panel.classList.remove('show');search.value='';
  }));
});
document.addEventListener('click',e=>{if(!panel.contains(e.target)&&e.target!==search)panel.classList.remove('show')});
const initial=location.hash.replace('#','');if(initial&&document.getElementById(initial))showPage(initial);
