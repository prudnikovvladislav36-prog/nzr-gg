(() => {
  const $ = (id) => document.getElementById(id);
  const form = $("publishForm");
  const log = $("publishLog");

  $("date").value = new Date().toISOString().slice(0,10);

  function slugify(text) {
    const map = {
      а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",
      к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
      х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
    };
    return text.toLowerCase().split("").map(c => map[c] ?? c).join("")
      .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,90);
  }

  $("title").addEventListener("input", () => {
    if (!$("slug").dataset.manual) $("slug").value = slugify($("title").value);
    updatePreview();
  });
  $("slug").addEventListener("input", () => $("slug").dataset.manual = "1");

  ["category","excerpt","tags","body"].forEach(id => $(id).addEventListener("input", updatePreview));
  $("cover").addEventListener("change", updatePreview);

  function updatePreview() {
    $("previewCategory").textContent = $("category").value.toUpperCase();
    $("previewTitle").textContent = $("title").value || "Заголовок материала";
    $("previewExcerpt").textContent = $("excerpt").value || "Здесь появится короткое описание материала.";
    $("previewTags").innerHTML = $("tags").value.split(",").map(x=>x.trim()).filter(Boolean)
      .slice(0,4).map(t=>`<span>#${escapeHtml(t)}</span>`).join("");

    const f = $("cover").files[0];
    if (f) {
      const url = URL.createObjectURL(f);
      $("previewImage").style.backgroundImage = `url("${url}")`;
    } else {
      const cat = window.NZR_CONTENT.categories[$("category").value];
      $("previewImage").style.backgroundImage = `url("../${cat.image}")`;
    }
  }

  $("previewBtn").addEventListener("click", updatePreview);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }

  function apiConfig() {
    return {
      owner: $("repoOwner").value.trim(),
      repo: $("repoName").value.trim(),
      branch: $("repoBranch").value.trim(),
      token: $("githubToken").value.trim()
    };
  }

  async function gh(path, options={}) {
    const cfg = apiConfig();
    const res = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`, {
      ...options,
      headers: {
        "Accept":"application/vnd.github+json",
        "Authorization":`Bearer ${cfg.token}`,
        "X-GitHub-Api-Version":"2022-11-28",
        ...(options.headers||{})
      }
    });
    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try { const j = await res.json(); msg = j.message || msg; } catch {}
      throw new Error(msg);
    }
    return res.status === 204 ? null : res.json();
  }

  $("checkGithub").addEventListener("click", async () => {
    $("githubStatus").textContent = "Проверяю...";
    $("githubStatus").className = "admin-status";
    try {
      const cfg = apiConfig();
      if (!cfg.token) throw new Error("Введи GitHub token");
      const repo = await gh("");
      $("githubStatus").textContent = `OK · ${repo.full_name}`;
      $("githubStatus").className = "admin-status ok";
    } catch(e) {
      $("githubStatus").textContent = `Ошибка: ${e.message}`;
      $("githubStatus").className = "admin-status error";
    }
  });

  function bytesToBase64(bytes) {
    let binary = "";
    const chunk = 0x8000;
    for (let i=0;i<bytes.length;i+=chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i+chunk));
    }
    return btoa(binary);
  }
  function textToBase64(text) {
    return bytesToBase64(new TextEncoder().encode(text));
  }
  function base64ToText(b64) {
    const bin = atob(b64.replace(/\n/g,""));
    const bytes = Uint8Array.from(bin, c=>c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  async function fileToBase64(file) {
    return bytesToBase64(new Uint8Array(await file.arrayBuffer()));
  }

  function ruDate(dateString) {
    const d = new Date(dateString + "T12:00:00");
    return new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric"}).format(d);
  }

  function articleObject(imagePath) {
    return {
      slug: $("slug").value.trim(),
      category: $("category").value,
      published: $("published").checked,
      featured: $("featured").checked,
      date: $("date").value,
      dateLabel: ruDate($("date").value),
      author: "NZR.GG Editorial",
      title: $("title").value.trim(),
      excerpt: $("excerpt").value.trim(),
      image: imagePath,
      comments: 0,
      tags: $("tags").value.split(",").map(x=>x.trim()).filter(Boolean),
      body: $("body").value.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean)
    };
  }

  function toJsObject(obj) {
    return JSON.stringify(obj, null, 2)
      .replace(/^/gm, "    ")
      .replace('"published":', 'published:')
      .replace('"featured":', 'featured:')
      .replace('"comments":', 'comments:');
  }

  async function uploadCover(file, slug) {
    if (!file) {
      return window.NZR_CONTENT.categories[$("category").value].image;
    }
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace("jpeg","jpg");
    const path = `assets/articles/${slug}.${ext}`;
    let sha;
    try {
      const current = await gh(`/contents/${path}?ref=${encodeURIComponent(apiConfig().branch)}`);
      sha = current.sha;
    } catch(e) {
      if (!String(e.message).includes("Not Found")) throw e;
    }

    await gh(`/contents/${path}`, {
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        message:`Upload cover: ${slug}`,
        content:await fileToBase64(file),
        branch:apiConfig().branch,
        ...(sha?{sha}:{})
      })
    });
    return path;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    log.className = "publish-log";
    log.textContent = "Подготовка публикации...";

    try {
      const cfg = apiConfig();
      if (!cfg.token) throw new Error("Нужен GitHub token.");
      if (!/^[a-z0-9-]+$/.test($("slug").value.trim())) throw new Error("Slug должен содержать только a-z, 0-9 и дефисы.");

      // 1. Check duplicate slug from live content
      if (window.NZR_CONTENT.getBySlug($("slug").value.trim())) {
        throw new Error("Такой slug уже существует. Выбери другой.");
      }

      // 2. Upload cover first
      log.textContent = "Загружаю обложку...";
      const imagePath = await uploadCover($("cover").files[0], $("slug").value.trim());

      // 3. Read content.js
      log.textContent = "Читаю базу материалов...";
      const file = await gh(`/contents/content.js?ref=${encodeURIComponent(cfg.branch)}`);
      let source = base64ToText(file.content);

      const marker = "/* ADMIN_INSERT_POINT */";
      if (!source.includes(marker)) throw new Error("В content.js не найден ADMIN_INSERT_POINT. Нужна версия сайта v0.9.");

      // 4. Insert article immediately after marker
      const article = articleObject(imagePath);
      const js = toJsObject(article) + ",";
      source = source.replace(marker, `${marker}\n${js}`);

      // 5. Commit content.js
      log.textContent = "Публикую материал...";
      await gh("/contents/content.js", {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          message:`Publish: ${article.title}`,
          content:textToBase64(source),
          sha:file.sha,
          branch:cfg.branch
        })
      });

      log.className = "publish-log success";
      log.innerHTML = `Готово. Материал отправлен в GitHub.<br><strong>GitHub Pages обновится автоматически.</strong><br>Страница: <code>article/?slug=${escapeHtml(article.slug)}</code>`;
    } catch(err) {
      log.className = "publish-log error";
      log.textContent = `Ошибка: ${err.message}`;
    }
  });

  updatePreview();
})();