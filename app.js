const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');

menuBtn?.addEventListener('click', () => mainNav.classList.toggle('open'));
searchBtn?.addEventListener('click', () => { searchModal.classList.add('open'); searchModal.setAttribute('aria-hidden','false'); });
closeSearch?.addEventListener('click', () => { searchModal.classList.remove('open'); searchModal.setAttribute('aria-hidden','true'); });
searchModal?.addEventListener('click', e => { if (e.target === searchModal) closeSearch.click(); });

function renderHero(){
  const data=window.NZR_CONTENT;
  if(!data?.getPublished) return;
  const published=data.getPublished();
  const featured=published.find(a=>a.featured) || published[0];
  if(!featured) return;
  const art=document.querySelector('.hero-art-main');
  if(art){ art.style.setProperty('background-image', `url('${featured.image}')`, 'important'); art.style.setProperty('background-size','cover','important'); art.style.setProperty('background-position','center','important'); }
  const cat=document.getElementById('heroCategory'), title=document.getElementById('heroTitle'), excerpt=document.getElementById('heroExcerpt');
  const link=document.getElementById('heroLink'), meta=document.getElementById('heroMeta');
  if(cat) cat.textContent=String(featured.category||'news').toUpperCase();
  if(title) title.textContent=featured.title;
  if(excerpt) excerpt.textContent=featured.excerpt;
  if(link) link.href=`article/?slug=${encodeURIComponent(featured.slug)}`;
  if(meta) meta.textContent=featured.dateLabel || featured.date || '';
}

function renderStoryCards(){
  const data=window.NZR_CONTENT;
  if(!data?.getByCategory) return;
  document.querySelectorAll('[data-story-category]').forEach(card=>{
    const category=card.dataset.storyCategory;
    const article=data.getByCategory(category)[0];
    if(!article) return;
    card.href=`article/?slug=${encodeURIComponent(article.slug)}`;
    const art=card.querySelector('.story-art');
    const title=card.querySelector('h3');
    if(art){ art.style.setProperty('background-image', `url('${article.image}')`, 'important'); art.style.setProperty('background-size','cover','important'); art.style.setProperty('background-position','center','important'); }
    if(title) title.textContent=article.title;
  });
}

function renderLatest(){
  const grid=document.getElementById('latestGrid'), data=window.NZR_CONTENT;
  if(!grid || !data?.getPublished) return;
  grid.innerHTML=data.getPublished().map(a=>`<a href="article/?slug=${encodeURIComponent(a.slug)}" class="news-card" data-category="${a.category}"><div class="thumb" style="background-image:linear-gradient(0deg,rgba(0,0,0,.6),transparent),url('${a.image}');background-size:cover;background-position:center"></div><span class="kicker">${String(a.category||'').toUpperCase()}</span><h3>${a.title}</h3><div class="meta">${a.dateLabel||a.date}</div></a>`).join('');
}
renderHero(); renderStoryCards(); renderLatest();

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const filter=btn.dataset.filter;document.querySelectorAll('#latestGrid .news-card').forEach(card=>card.classList.toggle('hidden-card',!(filter==='all'||card.dataset.category===filter)));}));
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');}));

const searchInput=document.querySelector('.search-box input[type="search"]');
searchInput?.addEventListener('input',()=>{
  let results=document.getElementById('searchResults');
  if(!results){results=document.createElement('div');results.id='searchResults';results.className='search-results';searchInput.insertAdjacentElement('afterend',results)}
  const q=searchInput.value.trim().toLowerCase();
  if(q.length<2){results.innerHTML='';return}
  const items=window.NZR_CONTENT.getPublished().filter(a=>[a.title,a.excerpt,...(a.tags||[])].join(' ').toLowerCase().includes(q)).slice(0,6);
  results.innerHTML=items.length?items.map(a=>`<a href="article/?slug=${encodeURIComponent(a.slug)}"><span>${a.category.toUpperCase()}</span><strong>${a.title}</strong></a>`).join(''):'<p>Ничего не найдено.</p>';
});
