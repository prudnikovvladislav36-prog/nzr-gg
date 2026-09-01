(function () {
  const base = document.body.dataset.base || ".";
  const queue = (document.body.dataset.boot || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  function src(path) {
    return `${base}/${path}`.replace(/\/\.\//g, "/");
  }

  function load(path, bustCache) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src(path) + (bustCache ? `?fresh=${Date.now()}` : "?v=150");
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Не удалось загрузить ${path}`));
      document.body.appendChild(script);
    });
  }

  load("content.js", true)
    .then(async () => {
      for (const path of queue) await load(path, false);
    })
    .catch(err => {
      console.error("NZR.GG bootstrap error:", err);
      const target = document.querySelector("#categoryGrid, #articleBody, #publishLog");
      if (target) target.textContent = "Не удалось загрузить свежие данные NZR.GG. Обновите страницу.";
    });
})();
