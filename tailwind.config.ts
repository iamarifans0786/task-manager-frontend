import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Professional blue
          light: '#3b82f6',
          dark: '#1e40af',
        },
        secondary: {
          DEFAULT: '#64748b', // Neutral grayish
          light: '#94a3b8',
          dark: '#475569',
        },
        background: '#f8fafc', // Soft light background
        text: '#1e293b', // Dark text for contrast
      },
    },
  },
  plugins: [],
} satisfies Config;
