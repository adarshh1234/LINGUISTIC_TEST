import { WhiteLabelBranding, DEFAULT_BRANDING } from "@/types/branding.types";

const STORAGE_KEY = "verbalis_branding";

class BrandingService {
  getBranding(): WhiteLabelBranding {
    if (typeof window === "undefined") return DEFAULT_BRANDING;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return DEFAULT_BRANDING;
    try {
      return { ...DEFAULT_BRANDING, ...JSON.parse(item) };
    } catch {
      return DEFAULT_BRANDING;
    }
  }

  saveBranding(branding: WhiteLabelBranding): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
  }

  resetToDefaults(): WhiteLabelBranding {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    return DEFAULT_BRANDING;
  }
}

export const brandingService = new BrandingService();

