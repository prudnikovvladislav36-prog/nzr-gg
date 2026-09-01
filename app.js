const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');

menuBtn?.addEventListener('click', () => mainNav.classList.toggle('open'));
searchBtn?.addEventListener('click', () => {
  searchModal.classList.add('open');
  searchModal.setAttribute('aria-hidden', 'false');
});
closeSearch?.addEventListener('click', () => {
  searchModal.classList.remove('open');
  searchModal.setAttribute('aria-hidden', 'true');
});
searchModal?.addEventListener('click', (e) => {
  if (e.target === searchModal) closeSearch.click();
});

function renderLatest() {
  const grid = document.getElementById('latestGrid');
  const data = window.NZR_CONTENT;
  if (!grid || !data?.getPublished) return;

  const articles = data.getPublished();
  grid.innerHTML = articles.map(a => `
    <a href="article/?slug=${encodeURIComponent(a.slug)}" class="news-card" data-category="${a.category}">
      <div class="thumb" style="background-image:linear-gradient(0deg,rgba(0,0,0,.6),transparent),url('${a.image}');background-size:cover;background-position:center"></div>
      <span class="kicker">${String(a.category || '').toUpperCase()}</span>
      <h3>${a.title}</h3>
      <div class="meta">${a.dateLabel || a.date} · ◌ ${a.comments || 0}</div>
    </a>`).join('');
}

renderLatest();

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('#latestGrid .news-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden-card', !show);
    });
  });
});

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
  });
});
