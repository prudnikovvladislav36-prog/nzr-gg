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

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.news-card').forEach(card => {
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
