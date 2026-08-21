const OWNED_KEY = "tds_owned"; // { [teamId]: editToken }
const COLLECTION_KEY = "tds_collection"; // string[] slugs
const FINGERPRINT_KEY = "tds_fp";
const ADMIN_KEY = "tds_admin"; // pin

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function getOwned(): Record<string, string> {
  try {
    return JSON.parse(safeGet(OWNED_KEY) ?? "{}");
  } catch {
    return {};
  }
}
export function setOwnedToken(teamId: string, token: string) {
  const owned = getOwned();
  owned[teamId] = token;
  safeSet(OWNED_KEY, JSON.stringify(owned));
}
export function getOwnedToken(teamId: string): string | undefined {
  return getOwned()[teamId];
}
export function isOwner(teamId: string): boolean {
  return !!getOwnedToken(teamId);
}

export function getCollection(): string[] {
  try {
    return JSON.parse(safeGet(COLLECTION_KEY) ?? "[]");
  } catch {
    return [];
  }
}
export function addToCollection(slug: string) {
  const c = getCollection();
  if (!c.includes(slug)) {
    c.push(slug);
    safeSet(COLLECTION_KEY, JSON.stringify(c));
  }
}
export function isInCollection(slug: string): boolean {
  return getCollection().includes(slug);
}

export function getFingerprint(): string {
  let fp = safeGet(FINGERPRINT_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    safeSet(FINGERPRINT_KEY, fp);
  }
  return fp;
}

export function getAdminPin(): string | null {
  return safeGet(ADMIN_KEY);
}
export function setAdminPin(pin: string) {
  safeSet(ADMIN_KEY, pin);
}
export function isAdmin(): boolean {
  return !!getAdminPin();
}
