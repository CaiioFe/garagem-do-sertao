// Service worker minimo, so pra habilitar o botao de instalar no Android/Chrome.
// Nao cacheia NADA de propósito (foi o que travou o app em tela preta antes).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
