export interface OrganismeBranding {
  name: string;
  shortName?: string;
  logo?: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  description?: string;
  website?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export const DEFAULT_ORGANISME_BRANDING: OrganismeBranding = {
  name: "Administration Gabonaise",
  shortName: "Admin GA",
  colors: {
    primary: "#10B981",
    secondary: "#065F46",
    accent: "#34D399",
  },
  description: "Plateforme d'administration numérique du Gabon",
  website: "https://admin.ga",
  contact: {
    email: "contact@admin.ga",
    phone: "+241 XX XX XX XX",
    address: "Libreville, Gabon",
  },
};

export const ORGANISMES_BRANDING: Record<string, OrganismeBranding> = {
  "default": DEFAULT_ORGANISME_BRANDING,
  "presidence": {
    name: "Présidence de la République",
    shortName: "Présidence",
    colors: {
      primary: "#1E40AF",
      secondary: "#1E3A8A",
      accent: "#3B82F6",
    },
    description: "Présidence de la République Gabonaise",
  },
  "primature": {
    name: "Primature",
    shortName: "PM",
    colors: {
      primary: "#7C2D12",
      secondary: "#92400E",
      accent: "#EA580C",
    },
    description: "Services du Premier Ministre",
  },
  "ministere-interieur": {
    name: "Ministère de l'Intérieur",
    shortName: "Min. Intérieur",
    colors: {
      primary: "#991B1B",
      secondary: "#7F1D1D",
      accent: "#DC2626",
    },
    description: "Ministère de l'Intérieur et de la Sécurité",
  },
  "ministere-justice": {
    name: "Ministère de la Justice",
    shortName: "Min. Justice",
    colors: {
      primary: "#581C87",
      secondary: "#4C1D95",
      accent: "#7C3AED",
    },
    description: "Ministère de la Justice et des Droits de l'Homme",
  },
};

export function getOrganismeBranding(organismeId?: string): OrganismeBranding {
  if (!organismeId) {
    return DEFAULT_ORGANISME_BRANDING;
  }

  return ORGANISMES_BRANDING[organismeId] || DEFAULT_ORGANISME_BRANDING;
}

export function getOrganismeThemeClasses(organismeId?: string): string {
  const branding = getOrganismeBranding(organismeId);

  return `
    --primary-color: ${branding.colors.primary};
    --secondary-color: ${branding.colors.secondary || branding.colors.primary};
    --accent-color: ${branding.colors.accent || branding.colors.primary};
  `;
}
