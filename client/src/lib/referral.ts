// Utility for handling referral codes with 30-day expiry stored in localStorage

const STORAGE_KEY = "referral_code_v1";

interface StoredReferral {
  code: string;
  expiresAt: number; // epoch ms
}

export function setReferralCode(code: string, days: number = 30) {
  try {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
    const payload: StoredReferral = { code, expiresAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function getReferralCode(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredReferral;
    if (!data?.code || !data?.expiresAt) return null;
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data.code;
  } catch {
    return null;
  }
}

export function clearReferralCode() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export function captureReferralFromUrl(search: string) {
  try {
    const params = new URLSearchParams(search || window.location.search);
    const code = params.get("ref") || params.get("referral") || params.get("affiliate");
    if (code && code.trim()) {
      setReferralCode(code.trim());
    }
  } catch {}
}
