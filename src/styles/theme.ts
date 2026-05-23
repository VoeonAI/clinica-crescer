export const clinicTheme = {
  palette: {
    ink: "#262033",
    inkSoft: "#5d546b",
    white: "#ffffff",
    porcelain: "#fbfafc",
    lilac: {
      50: "#f8f2ff",
      100: "#efe2ff",
      200: "#dec7ff",
      300: "#c7a5f2",
      500: "#8d63c7",
      700: "#5b3d86",
    },
    yellow: {
      100: "#fff3c7",
      300: "#ffd96f",
      500: "#f3b82e",
    },
    blue: {
      50: "#f1f9ff",
      100: "#dff1ff",
      300: "#9bd6f3",
      500: "#4d9fc9",
    },
    coral: {
      50: "#fff4ef",
      100: "#ffe1d5",
      300: "#ffb69e",
      500: "#e8795f",
    },
    sage: {
      50: "#f3faf6",
      200: "#cce8d7",
      500: "#6ba47d",
    },
  },
  shadows: {
    soft: "0 14px 45px rgba(62, 46, 89, 0.08)",
    medium: "0 22px 70px rgba(62, 46, 89, 0.12)",
    lift: "0 18px 55px rgba(141, 99, 199, 0.18)",
  },
  radii: {
    xs: "8px",
    sm: "12px",
    md: "18px",
    lg: "28px",
    xl: "36px",
    pill: "999px",
  },
  spacing: {
    sectionY: "clamp(4.5rem, 8vw, 8rem)",
    sectionYCompact: "clamp(3rem, 6vw, 5.5rem)",
    gutter: "clamp(1rem, 4vw, 2rem)",
  },
  maxWidths: {
    page: "1180px",
    content: "760px",
    narrow: "620px",
    wide: "1360px",
  },
  gradients: {
    page: "linear-gradient(180deg, #fbfafc 0%, #ffffff 42%, #f8f2ff 100%)",
    lilacMist: "linear-gradient(135deg, rgba(248, 242, 255, 0.96), rgba(241, 249, 255, 0.86))",
    warmCare: "linear-gradient(135deg, rgba(255, 243, 199, 0.9), rgba(255, 225, 213, 0.72))",
    premium: "linear-gradient(135deg, #5b3d86 0%, #8d63c7 54%, #4d9fc9 100%)",
  },
  transitions: {
    fast: "160ms ease",
    base: "220ms ease",
    slow: "420ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  assets: {
    bucket: "site-images",
    publicBaseUrl: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images",
  },
} as const;

export type ClinicTheme = typeof clinicTheme;

export const siteImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${clinicTheme.assets.publicBaseUrl}/${path.replace(/^\/+/, "")}`;
};
