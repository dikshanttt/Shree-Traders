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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#e11d48", // Rose 600 - rich traditional festive red/rose for sarees & kurtas
          hover: "#be123c",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f59e0b", // Warm gold / amber accent
          hover: "#d97706",
          foreground: "#1f2937",
        },
        emerald: {
          DEFAULT: "#059669",
          hover: "#047857",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
