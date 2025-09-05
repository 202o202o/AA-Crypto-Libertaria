// nav.js - mount navigation and auto-inject stylesheet
(function(){
  function isInPagesPath(){
    // 判斷 URL path 裡是否包含 '/pages/'
    return location.pathname.indexOf('/pages/') !== -1;
  }

  function prefixPath(p){
    // 若在 pages 資料夾內，需要回到上層
    return (isInPagesPath() ? '../' : '') + p;
  }

  window.mountAssets = function(){
    // inject stylesheet only once
    if(document.querySelector('link[data-site-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = prefixPath('assets/css/styles.css');
    link.setAttribute('data-site-style','1');
    document.head.appendChild(link);
  };

  window.mountNav = function(sel){
    const el = document.querySelector(sel);
    if(!el) return;
    const html = `
      <nav class="site-nav">
        <a href="${prefixPath('index.html')}">入口</a> |
        <a href="${prefixPath('tools.html')}">工具</a> |
        <a href="${prefixPath('survival.html')}">生存法</a> |
        <a href="${prefixPath('about.html')}">計劃</a> |
        <a href="${prefixPath('donate.html')}">協力</a> |
        <a href="${prefixPath('statements.html')}">聲明</a>
      </nav>`;
    el.innerHTML = html;
  };
})();
