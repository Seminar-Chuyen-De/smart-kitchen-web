import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./Frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf6ec",
          100: "#fbe8ca",
          200: "#f6cc8f",
          300: "#f1ab4e",
          400: "#ec8c1e",
          500: "#d97006",
          600: "#b35a04",
          700: "#8c4308",
          800: "#71360e",
          900: "#5d2d0f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
