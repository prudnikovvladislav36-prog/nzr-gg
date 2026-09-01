(function(){
  const base = document.body.dataset.base || "..";
  const data = window.NZR_CONTENT;
  const slug = new URLSearchParams(location.search).get("slug");
  const article = data.getBySlug(slug);

  if (!article) {
    document.title = "Материал не найден — NZR.GG";
    document.querySelector(".article-shell").innerHTML = `<section class="not-found"><span class="eyebrow">404 // NZR.GG</span><h1>МАТЕРИАЛ НЕ НАЙДЕН</h1><p>Публикация не существует, была снята с публикации или ссылка устарела.</p><a class="btn" href="${base}/news/">К материалам</a></section>`;
    return;
  }

  document.body.dataset.active = article.category;
  document.title = `${article.title} — NZR.GG`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", article.excerpt);

  const category = String(article.category || 'news');
  const categoryUpper = category.toUpperCase();
  const categoryHref = `${base}/${category}/`;
  document.querySelector("#articleCategory").textContent = categoryUpper;
  document.querySelector("#articleCategoryLink").textContent = categoryUpper;
  document.querySelector("#articleCategoryLink").href = categoryHref;
  document.querySelector("#backToCategory").href = categoryHref;
  document.querySelector("#articleTitle").textContent = article.title;
  document.querySelector("#articleLead").textContent = article.excerpt;

  const words = (article.body || []).join(' ').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(2, Math.ceil(words / 190));
  document.querySelector("#articleMeta").textContent = `${article.dateLabel || article.date} · ${article.author || data.site.author} · ${readMinutes} мин.`;

  document.querySelector("#articleTags").innerHTML = (article.tags||[]).map(t=>`<span>#${t}</span>`).join("");

  const img = document.querySelector("#articleHeroImage");
  img.src = `${base}/${article.image}`;
  img.alt = article.title;

  document.querySelector("#articleBody").innerHTML = article.body.map((p,i) =>
    i === 1 ? `<blockquote>${p}</blockquote>` : `<p>${p}</p>`).join("");

  const source = document.querySelector("#articleSource");
  if (source && article.sourceUrl) {
    const label = article.sourceLabel || "Источник";
    source.innerHTML = `<span>ИСТОЧНИК</span><a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  } else if (source) source.remove();

  const related = data.getPublished().filter(a => a.slug !== article.slug)
    .sort((a,b) => Number(b.category === article.category) - Number(a.category === article.category)).slice(0,3);

  document.querySelector("#relatedGrid").innerHTML = related.map(a => `
    <a class="related-card" href="?slug=${encodeURIComponent(a.slug)}">
      <div class="related-img" style="background-image:url('${base}/${a.image}')"></div>
      <strong>${a.title}</strong><small>${a.dateLabel || a.date}</small>
    </a>`).join("");

  document.querySelector("#copyLink")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      const btn = document.querySelector("#copyLink"); const old = btn.textContent;
      btn.textContent = "ССЫЛКА СКОПИРОВАНА"; setTimeout(()=>btn.textContent=old,1600);
    } catch(e) {}
  });
})();
