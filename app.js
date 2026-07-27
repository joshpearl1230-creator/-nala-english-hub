const pages=[...document.querySelectorAll('.page')], nav=[...document.querySelectorAll('nav button[data-page]')], aside=document.querySelector('aside');
function go(id){pages.forEach(x=>x.classList.toggle('active',x.id===id));nav.forEach(x=>x.classList.toggle('active',x.dataset.page===id));aside.classList.remove('open');scrollTo(0,0);location.hash=id}
nav.forEach(x=>x.onclick=()=>go(x.dataset.page));document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>go(x.dataset.go));
document.getElementById('menu').onclick=()=>aside.classList.toggle('open');
if(localStorage.getItem('theme')==='dark')document.body.classList.add('dark');
document.getElementById('theme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('theme',document.body.classList.contains('dark')?'dark':'light')};
document.querySelectorAll('.view').forEach(b=>b.onclick=()=>{document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');const c=document.getElementById('transcriptContent');c.classList.remove('hide-en','hide-zh');if(b.dataset.view==='en')c.classList.add('hide-zh');if(b.dataset.view==='zh')c.classList.add('hide-en')});
document.getElementById('findText').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.transcript-block').forEach(x=>x.style.display=!q||x.innerText.toLowerCase().includes(q)?'block':'none')};
document.querySelectorAll('.speak').forEach(b=>b.onclick=()=>{speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(b.dataset.speak);u.lang='en-US';u.rate=.88;speechSynthesis.speak(u)});
const a=document.getElementById('answer');a.value=localStorage.getItem('ep294-answer')||'';a.oninput=()=>localStorage.setItem('ep294-answer',a.value);
const h=location.hash.slice(1);if(h&&document.getElementById(h))go(h);