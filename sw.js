// Ecos de Valdoria — service worker: o jogo abre sem internet e cada atualização enviada ao GitHub chega sozinha.
// Estratégia "rede primeiro": com internet, sempre busca a versão mais nova (revalidando o cache do navegador);
// sem internet (ou se a rede demorar mais de 4 s), usa a cópia guardada. Por isso não é preciso mudar nada aqui a cada atualização.
// Na instalação, guarda o index.html e todo arquivo local que ele cita (scripts, estilo, ícones do manifesto), sem lista manual:
// um script novo no index.html entra sozinho.
const SW_CACHE='valdoria-v1'; // mude só para jogar fora todas as cópias guardadas nos aparelhos
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(SW_CACHE);
 const r=await fetch('./',{cache:'no-cache'}),html=await r.clone().text();await c.put('./',r);
 const locais=new Set([...html.matchAll(/(?:src|href)="([^"#:?]+)"/g)].map(m=>m[1]));
 try{const mf=await(await fetch('manifest.json',{cache:'no-cache'})).json();for(const i of mf.icons||[])locais.add(i.src);}catch(_){}
 await Promise.all([...locais].map(u=>c.add(new Request(u,{cache:'no-cache'})).catch(()=>{})));
 await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==SW_CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const fonte=/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(u.origin!==location.origin&&!fonte)return;
 e.respondWith(fonte?swFonte(r):swRede(r));});
// arquivos do jogo: rede primeiro, cópia guardada como reserva
async function swRede(r){const c=await caches.open(SW_CACHE);
 const net=fetch(r.url,{cache:'no-cache'}).then(resp=>{if(resp.ok)c.put(r,resp.clone());return resp;});net.catch(()=>{});
 try{return await Promise.race([net,new Promise((_,no)=>setTimeout(no,4000))]);}
 catch(_){const m=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('./'):null);return m||net;}}
// fontes do Google: não mudam, então a cópia guardada vem primeiro
async function swFonte(r){const c=await caches.open(SW_CACHE),m=await c.match(r);if(m)return m;
 const resp=await fetch(r);if(resp.ok||resp.type==='opaque')c.put(r,resp.clone());return resp;}
