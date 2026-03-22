import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f59e0b", // Amber/Orange accent
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1f2937", // Gray-800
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#d97706",
          foreground: "#ffffff",
        },
        sidebar: {
          DEFAULT: "#111827", // Gray-900
          foreground: "#9ca3af",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
