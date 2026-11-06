export interface WhiteLabelBranding {
  organizationName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  candidateInstructions: string;
  supportEmail: string;
  customDomain?: string;
  showPoweredBy: boolean;
  privacyPolicyUrl: string;
}

export const DEFAULT_BRANDING: WhiteLabelBranding = {
  organizationName: "GlobalTalent Corp",
  logoUrl: "",
  primaryColor: "#4f46e5",
  secondaryColor: "#0f172a",
  welcomeMessage: "Welcome to your linguistic proficiency evaluation. Please ensure you are in a quiet room with a working microphone.",
  candidateInstructions: "This test consists of speaking, reading comprehension, and business writing modules. Your responses will be evaluated against CEFR standards.",
  supportEmail: "support@globaltalent.io",
  showPoweredBy: true,
  privacyPolicyUrl: "https://example.com/privacy",
};

