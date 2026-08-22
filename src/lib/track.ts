import { supabase } from "./supabase";
import { getFingerprint } from "./storage";

export type ViewKind = "team" | "vehicle" | "partner" | "page";

// Fire and forget: nunca trava a UI nem mostra erro pro usuario.
export function trackView(kind: ViewKind, refId: string) {
  const fingerprint = getFingerprint();
  supabase.from("page_views").insert({ kind, ref_id: refId, fingerprint }).then(
    () => {},
    () => {},
  );
}
