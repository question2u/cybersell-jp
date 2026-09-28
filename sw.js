// 自毁 Service Worker：旧站（不动产 PWA）曾在访客浏览器注册 /sw.js 并缓存旧页面。
// 浏览器更新到本文件后：清空全部缓存 → 注销自己 → 刷新已打开的页面，之后不再有 SW。
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
