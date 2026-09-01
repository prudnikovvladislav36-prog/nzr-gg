(function(){
  const data = window.NZR_CONTENT;
  const category = document.body.dataset.active;
  const base = document.body.dataset.base || "..";
  const info = data.categories[category];

  document.title = `${info.title} — NZR.GG`;
  document.querySelector("#categoryTitle").textContent = info.title;
  document.querySelector("#categorySubtitle").textContent = info.subtitle;
  document.querySelector("#categoryHero").style.backgroundImage =
    `linear-gradient(90deg,rgba(0,0,0,.2),rgba(0,0,0,.82)),url("${base}/${info.image}")`;

  const list = data.getByCategory(category);
  document.querySelector("#categoryGrid").innerHTML = list.length ? list.map(a => `
    <a class="media-card" href="${base}/article/?slug=${encodeURIComponent(a.slug)}">
      <div class="media-card-image" style="background-image:linear-gradient(0deg,rgba(0,0,0,.72),transparent 62%),url('${base}/${a.image}')"></div>
      <div class="media-card-body">
        <span class="kicker">${a.category.toUpperCase()}</span>
        <h2>${a.title}</h2>
        <p>${a.excerpt}</p>
        <div class="tag-row">${(a.tags||[]).slice(0,3).map(t=>`<span>#${t}</span>`).join("")}</div>
        <div class="meta">${a.dateLabel || a.date} · ◌ ${a.comments || 0}</div>
      </div>
    </a>`).join("") : `<div class="empty-state"><span class="eyebrow">NZR.GG</span><h2>Материалы готовятся</h2><p>В этой рубрике пока нет опубликованных материалов.</p></div>`;
})();