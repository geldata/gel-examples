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
        bg: "#09090a",
        border: "#27272A",
        placeholder: "#A1A1AA",
        purple: "#48486a",
        green: "#408c7b",
        text: "#E5E5E5",
        elem: "#27272A80",
      },
    },
  },
};
export default config;
