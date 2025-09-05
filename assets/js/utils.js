// utils.js - helper functions for site (create card, escape, download, client-side encrypt)
const DEFENSE_TIPS = [
  "不要點擊未知連結；先在沙盒/測試錢包小額實驗。",
  "驗證來源/官方通告；使用多因素驗證(MFA)。",
  "使用硬體錢包或冷錢包儲存大量資產。",
  "在不信任環境下使用 VPN/Tor，避免透露真實位置。",
  "建立資訊來源的常態檢查與日誌習慣。"
];

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function createCaseCard({title,date,source,summary,link}, tip){
  return `
  <article class="card">
    <h3>${escapeHtml(title)}</h3>
    <small>${escapeHtml(date)} | ${escapeHtml(source||'來源未知')}</small>
    <p>${escapeHtml(summary||'無摘要')}</p>
    <p><strong>防範建議：</strong> ${escapeHtml(tip||DEFENSE_TIPS[Math.floor(Math.random()*DEFENSE_TIPS.length)])}</p>
    ${link?`<p><a class="btn" href="${escapeHtml(link)}" target="_blank" rel="noopener">查看原文</a></p>`:''}
  </article>`;
}

// 下載 JSON 檔 (純文本)
function downloadJSON(obj, filename='submission.json'){
  const blob = new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
  const u = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = u; a.download = filename; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(u);
}

// 客戶端加密並下載 .enc 檔，使用 PBKDF2 + AES-GCM
async function encryptAndDownloadJSON(obj, password, filename='submission.enc'){
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({
    name:'PBKDF2',
    salt,
    iterations:200000,
    hash:'SHA-256'
  }, baseKey, { name:'AES-GCM', length:256 }, true, ['encrypt']);
  const data = enc.encode(JSON.stringify(obj));
  const cipher = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, data);
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + cipher.byteLength);
  combined.set(salt,0); combined.set(iv, salt.byteLength); combined.set(new Uint8Array(cipher), salt.byteLength+iv.byteLength);
  const blob = new Blob([combined], {type:'application/octet-stream'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
