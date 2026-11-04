const posts = window.PHOTO_POSTS || [];
const grid = document.querySelector('#grid');
const filters = document.querySelector('#filters');
const input = document.querySelector('#search');
const labels = {personal:'개인촬영',event:'행사장',events:'행사별',models:'모델별',search:'검색'};
function render(){
  const [mode='',query=''] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(query), selected=params.get('filter')||'', q=params.get('q')||'';
  input.value=q;
  document.querySelector('#archive-title').textContent=labels[mode]||'전체 사진';
  document.querySelectorAll('nav a').forEach(a=>{if((a.hash.slice(1)||'')===mode)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  filters.replaceChildren();
  const field=mode==='events'?'event':mode==='models'?'models':null;
  if(field){
    const options=[...new Set(posts.flatMap(p=>p[field]))].sort((a,b)=>a.localeCompare(b,'ko'));
    for(const name of ['',...options]){
      const a=document.createElement('a');a.textContent=name||'전체';
      a.href='#'+mode+'?'+new URLSearchParams({filter:name,q});
      a.setAttribute('aria-current',String(name===selected));filters.append(a);
    }
  }
  const visible=posts.filter(p=>{
    if(mode==='personal'&&!p.categories.some(c=>['갠촬','개인촬영'].includes(c)))return false;
    if(mode==='event'&&!p.categories.includes('행사장'))return false;
    if(field&&selected&&!(Array.isArray(p[field])?p[field].includes(selected):p[field]===selected))return false;
    return `${p.title} ${p.categories.join(' ')} ${p.models.join(' ')}`.toLocaleLowerCase().includes(q.trim().toLocaleLowerCase());
  });
  grid.replaceChildren();
  for(const p of visible){
    const a=document.createElement('a');a.className='card';a.href=p.url;
    const img=document.createElement('img');img.src=p.preview;img.alt=p.title;img.loading='lazy';img.decoding='async';
    const title=document.createElement('h2');title.textContent=p.title;
    const model=document.createElement('p');model.textContent=p.models.join(', ');
    a.append(img,title,model);grid.append(a);
  }
  document.querySelector('#count').textContent=`(${visible.length})`;
  document.querySelector('#empty').hidden=visible.length!==0;
}
document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();location.hash='search?'+new URLSearchParams({q:input.value});});
window.addEventListener('hashchange',render);
render();
