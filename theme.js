(function(){
  const stored = localStorage.getItem('nzr-theme');
  const theme = stored === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  function sync(){
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      const light = document.documentElement.dataset.theme === 'light';
      btn.textContent = light ? '☾' : '☀';
      btn.setAttribute('aria-label', light ? 'Включить тёмную тему' : 'Включить светлую тему');
      btn.setAttribute('title', light ? 'Тёмная тема' : 'Светлая тема');
    });
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', lightColor());
  }
  function lightColor(){ return document.documentElement.dataset.theme === 'light' ? '#f2efe8' : '#090909'; }
  window.NZR_THEME={
    sync,
    toggle(){
      const next=document.documentElement.dataset.theme==='light'?'dark':'light';
      document.documentElement.dataset.theme=next;
      localStorage.setItem('nzr-theme',next);
      sync();
    }
  };
  document.addEventListener('DOMContentLoaded',sync);
})();
