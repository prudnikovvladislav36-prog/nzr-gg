
(function(){
  const base=document.body.dataset.base || "..";
  const slug=new URLSearchParams(location.search).get("slug");
  const article=(window.NZR_CONTENT?.articles||[]).find(a=>a.slug===slug) || window.NZR_CONTENT.articles[0];
  document.body.dataset.active=article.category;
  document.title=`${article.title} — NZR.GG`;

  document.querySelector("#articleCategory").textContent=article.category.toUpperCase();
  document.querySelector("#articleTitle").textContent=article.title;
  document.querySelector("#articleLead").textContent=article.excerpt;
  document.querySelector("#articleMeta").textContent=`${article.date} · NZR.GG`;
  document.querySelector("#articleHero").style.backgroundImage=
    `linear-gradient(0deg,rgba(0,0,0,.86),rgba(0,0,0,.08)),url("${base}/${article.image}")`;
  document.querySelector("#articleBody").innerHTML=article.body.map((p,i)=>i===1
    ? `<blockquote>${p}</blockquote>` : `<p>${p}</p>`).join("");

  const related=window.NZR_CONTENT.articles.filter(a=>a.slug!==article.slug).slice(0,3);
  document.querySelector("#relatedGrid").innerHTML=related.map(a=>`
    <a class="related-card" href="?slug=${encodeURIComponent(a.slug)}">
      <div class="related-img" style="background-image:url('${base}/${a.image}')"></div>
      <span>${a.category.toUpperCase()}</span><strong>${a.title}</strong>
    </a>`).join("");
})();
