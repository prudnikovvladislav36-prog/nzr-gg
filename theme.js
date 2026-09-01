(function(){
  const KEY='nzr-theme';
  const root=document.documentElement;
  const saved=localStorage.getItem(KEY);
  const preferred=saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  root.dataset.theme=preferred;

  function themeColor(){ return root.dataset.theme==='light' ? '#f4f1ea' : '#090909'; }
  function sync(){
    const light=root.dataset.theme==='light';
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      btn.textContent=light?'☾':'☀';
      btn.setAttribute('aria-label', light?'Включить тёмную тему':'Включить светлую тему');
      btn.setAttribute('title', light?'Тёмная тема':'Светлая тема');
      btn.setAttribute('aria-pressed', String(light));
    });
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content',themeColor());
  }
  function toggle(){
    root.dataset.theme=root.dataset.theme==='light'?'dark':'light';
    localStorage.setItem(KEY,root.dataset.theme);
    sync();
  }
  function bind(){
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      if(btn.dataset.themeBound==='1') return;
      btn.dataset.themeBound='1';
      btn.addEventListener('click',toggle);
    });
    sync();
  }
  window.NZR_THEME={sync,toggle,bind};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
})();
