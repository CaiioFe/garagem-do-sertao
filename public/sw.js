// Kill switch: desinstala qualquer service worker antigo que ainda esteja
// ativo em algum aparelho. Não cacheia mais nada (ver src/main.tsx).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      await self.registration.unregister();
      const clientsList = await self.clients.matchAll({ type: "window" });
      clientsList.forEach((c) => c.navigate(c.url));
    })(),
  );
});
