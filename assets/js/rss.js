// rss.js - load RSS -> JSON via rss2json (示範); 建議未來換成自建代理
async function loadRssToContainer(rssUrl, containerSelector, max=6){
  const container = document.querySelector(containerSelector);
  if(!container) return;
  container.innerHTML = '<p>載入中...</p>';
  const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  try{
    const res = await fetch(api);
    if(!res.ok) throw new Error('RSS fetch failed');
    const json = await res.json();
    const items = json.items?.slice(0,max) || [];
    container.innerHTML = '';
    items.forEach((it, idx)=>{
      const cardHtml = createCaseCard({
        title: it.title,
        date: new Date(it.pubDate).toLocaleDateString(),
        source: it.author || json.feed?.title,
        summary: it.contentSnippet,
        link: it.link
      }, DEFENSE_TIPS[idx % DEFENSE_TIPS.length]);
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  }catch(e){
    console.error('RSS load error', e);
    container.innerHTML = '<p>無法抓取最新案例，請稍後再試。</p>';
  }
}
