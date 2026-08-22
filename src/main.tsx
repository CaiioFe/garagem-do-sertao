import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Se alguém deixou a aba aberta durante um deploy novo, o chunk lazy-load da
// rota antiga some do servidor e o import falha. Em vez de travar em tela
// preta, recarrega a página uma vez (com trava pra não entrar em loop).
window.addEventListener("vite:preloadError", reloadOnce);
window.addEventListener("error", (e) => {
  if (String(e.message).includes("dynamically imported module")) reloadOnce();
});
window.addEventListener("unhandledrejection", (e) => {
  if (String(e.reason).includes("dynamically imported module")) reloadOnce();
});

function reloadOnce() {
  const key = "chunk-reload-once";
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  window.location.reload();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// O service worker cacheava bundles antigos e travava o app em tela preta depois
// de um novo deploy (chunk lazy-load apontando pra um hash que não existe mais).
// Sem esse risco valer a pena pra um app que depende de dado ao vivo, então
// desregistra qualquer instalação anterior em vez de registrar um novo.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
  if ("caches" in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
}
