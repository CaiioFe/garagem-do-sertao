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

// Service worker minimo (sem cache nenhum, ver public/sw.js) so pra habilitar
// o botao nativo de "instalar app" no Android/Chrome. Limpa qualquer cache
// que uma versão antiga do SW possa ter deixado pra trás.
if ("serviceWorker" in navigator) {
  if ("caches" in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
