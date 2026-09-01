
(function(){
  const base = document.body.dataset.base || ".";
  let active = document.body.dataset.active || "";
  if (!active && location.pathname.includes("/article/")) {
    const slug = new URLSearchParams(location.search).get("slug");
    const found = window.NZR_CONTENT?.getBySlug?.(slug) ||
      (window.NZR_CONTENT?.articles || []).find(a => a.slug === slug);
    if (found?.category) {
      active = found.category;
      document.body.dataset.active = active;
    }
  }

  function path(p){ return base + "/" + p; }

  const header = `
  <header class="site-header site-header-inner">
    <a class="brand" href="${path("index.html")}" aria-label="NZR.GG">
      <div class="brand-mark brand-mark-img"><img src="${path("assets/nzr-logo-official.jpg")}" alt="NZR"></div>
      <div class="brand-copy">
        <strong class="wordmark">NZR<span>.GG</span></strong>
        <small>PLAY • COMPETE • INSPIRE</small>
      </div>
    </a>
    <button class="menu-btn" id="menuBtn" aria-label="Открыть меню">☰</button>
    <nav class="main-nav" id="mainNav">
      <a class="${active==="news"?"active":""}" href="${path("news/")}">NEWS</a>
      <a class="${active==="esports"?"active":""}" href="${path("esports/")}">ESPORTS</a>
      <a class="${active==="updates"?"active":""}" href="${path("updates/")}">UPDATES</a>
      <a class="${active==="industry"?"active":""}" href="${path("industry/")}">INDUSTRY</a>
      <a href="${path("index.html#live")}">LIVE</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn theme-toggle" data-theme-toggle type="button" aria-label="Включить светлую тему">☀</button>
      <button class="icon-btn" id="searchBtn" aria-label="Поиск">⌕</button>
      <a class="social" href="#" aria-label="VK">VK</a>
      <a class="social" href="#" aria-label="Telegram">TG</a>
      <a class="social" href="#" aria-label="Twitch">TW</a>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer shell">
    <div class="footer-brand">
      <div class="brand-mark small brand-mark-img"><img src="${path("assets/nzr-logo-official.jpg")}" alt="NZR"></div>
      <div><strong>NZR<span>.GG</span></strong><small>PLAY • COMPETE • INSPIRE</small></div>
    </div>
    <p>NZR.GG — игровое медиа, киберспорт, стримы и будущая соревновательная платформа.</p>
    <div class="footer-links">
      <a href="${path("news/")}">News</a><a href="${path("esports/")}">Esports</a>
      <a href="${path("updates/")}">Updates</a><a href="${path("industry/")}">Industry</a>
      <a href="${path("index.html#live")}">Live</a>
    </div>
  </footer>`;

  const search = `
  <div class="search-modal" id="searchModal" aria-hidden="true">
    <div class="search-box">
      <button class="close-search" id="closeSearch">×</button>
      <span class="kicker">SEARCH</span><h2>Поиск по NZR.GG</h2>
      <input id="siteSearch" type="search" placeholder="Игра, команда, турнир..." />
      <div id="searchResults" class="search-results"></div>
    </div>
  </div>`;

  document.querySelector("[data-site-header]")?.insertAdjacentHTML("afterbegin",header);
  document.querySelector("[data-site-footer]")?.insertAdjacentHTML("afterbegin",footer);
  document.body.insertAdjacentHTML("beforeend",search);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn=>btn.addEventListener('click',()=>window.NZR_THEME?.toggle()));
  window.NZR_THEME?.sync();


  const menuBtn=document.getElementById("menuBtn"), mainNav=document.getElementById("mainNav");
  menuBtn?.addEventListener("click",()=>mainNav.classList.toggle("open"));

  const modal=document.getElementById("searchModal"), open=document.getElementById("searchBtn"), close=document.getElementById("closeSearch");
  open?.addEventListener("click",()=>{modal.classList.add("open"); setTimeout(()=>document.getElementById("siteSearch")?.focus(),50)});
  close?.addEventListener("click",()=>modal.classList.remove("open"));
  modal?.addEventListener("click",e=>{if(e.target===modal) modal.classList.remove("open")});

  const input=document.getElementById("siteSearch"), results=document.getElementById("searchResults");
  input?.addEventListener("input",()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){results.innerHTML=""; return;}
    const matches=(window.NZR_CONTENT?.getPublished?.() || window.NZR_CONTENT?.articles || []).filter(a =>
      (a.title+" "+a.excerpt+" "+a.category).toLowerCase().includes(q)
    ).slice(0,6);
    results.innerHTML=matches.length ? matches.map(a=>`
      <a class="search-result" href="${path("article/")}?slug=${encodeURIComponent(a.slug)}">
        <span>${a.category.toUpperCase()}</span><strong>${a.title}</strong>
      </a>`).join("") : `<p class="search-empty">Ничего не найдено</p>`;
  });
})();
