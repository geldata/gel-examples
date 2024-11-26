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
        text: "#c5c5c5",
        elem: "#28283b",
        purple: "#48486a",
        green: "#408c7b",
        bg: "#14141d",
        action: "#8484ac",
        btn: "#5b5b87",
        placeholder: "#7a7a7a",
      },
    },
  },
};
export default config;
