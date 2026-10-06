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
          bg: "#FFF5F8",
          surface: "#FFFFFF",
          "surface-alt": "#FCE7F3",
          border: "#FBCFE8",
          "border-dark": "#F472B6",
          text: "#1F1116",
          "text-muted": "#835368",
          primary: "#EC4899", // Vibrant Pink
          "primary-hover": "#DB2777",
          "primary-dark": "#BE185D",
          "primary-light": "#FDF2F8",
          danger: "#E11D48", // Rose Red
          "danger-hover": "#BE123C",
          warning: "#F59E0B",
          "warning-hover": "#D97706",
        },
      },
    },
  },
  plugins: [],
};
export default config;
