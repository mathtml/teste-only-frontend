import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0080FF",
        text: "#00264D",
        caption: "#698096",
        gray: "#BFCCD9",
        lightgray: "#E3EBF3",
        white: "#FFFFFF",
        overlay: "rgba(18, 57, 82, 0.95)",
        yellow: "#F2BF09",
        red: "#FF0000", 
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: "var(--font-poppins)", // Usa a variável do Next.js
      },
      screens:{
        'xl': '1500px'
      }
    },
  },
  plugins: [],
} satisfies Config;
