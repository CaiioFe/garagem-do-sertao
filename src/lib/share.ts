import { toPng } from "html-to-image";

export async function captureCardPng(el: HTMLElement): Promise<Blob | null> {
  try {
    await document.fonts?.ready;
    // Safari costuma retornar em branco na primeira chamada; repetir resolve.
    await toPng(el, { pixelRatio: 2, cacheBust: true });
    await toPng(el, { pixelRatio: 2, cacheBust: true });
    const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch (e) {
    console.error("captureCardPng failed", e);
    return null;
  }
}

export async function shareCard(el: HTMLElement, filename: string, text: string) {
  const blob = await captureCardPng(el);
  if (!blob) return false;
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Garagem do Sertão", text });
      return true;
    } catch {
      return false;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
