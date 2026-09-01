
(function(){
  const data=window.NZR_CONTENT;
  const category=document.body.dataset.active;
  const base=document.body.dataset.base || "..";
  const info=data.categories[category];
  document.title = `${info.title} — NZR.GG`;
  document.querySelector("#categoryTitle").textContent=info.title;
  document.querySelector("#categorySubtitle").textContent=info.subtitle;
  document.querySelector("#categoryHero").style.backgroundImage =
    `linear-gradient(90deg,rgba(0,0,0,.2),rgba(0,0,0,.82)),url("${base}/${info.image}")`;

  const list=data.articles.filter(a=>a.category===category);
  document.querySelector("#categoryGrid").innerHTML=list.map(a=>`
    <a class="media-card" href="${base}/article/?slug=${encodeURIComponent(a.slug)}">
      <div class="media-card-image" style="background-image:linear-gradient(0deg,rgba(0,0,0,.72),transparent 62%),url('${base}/${a.image}')"></div>
      <div class="media-card-body">
        <span class="kicker">${a.category.toUpperCase()}</span>
        <h2>${a.title}</h2>
        <p>${a.excerpt}</p>
        <div class="meta">${a.date} · ◌ ${a.comments}</div>
      </div>
    </a>`).join("");
})();
