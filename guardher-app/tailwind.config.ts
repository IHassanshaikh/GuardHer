import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        guardher: {
          bg: "#F9FAFB",
          surface: "#FFFFFF",
          "surface-alt": "#F3F4F6",
          border: "#E5E7EB",
          "border-dark": "#D1D5DB",
          text: "#111827",
          "text-muted": "#6B7280",
          primary: "#EC4899", // Pink
          "primary-hover": "#DB2777",
          danger: "#DC2626", // Red
          "danger-hover": "#B91C1C",
          warning: "#D97706", // Amber
          "warning-hover": "#B45309",
        },
      },
    },
  },
  plugins: [],
};
export default config;
