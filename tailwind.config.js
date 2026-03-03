/** @type {import('tailwindcss').Config} */
export default {
  content: ["./extension/src/**/*.{ts,tsx,html}"],
  prefix: "li-",
  theme: {
    extend: {
      colors: {
        lockin: {
          primary: "#6C5CE7",
          secondary: "#00CEC9",
          accent: "#FD79A8",
          dark: "#2D3436",
          light: "#F8F9FA",
        },
      },
    },
  },
  plugins: [],
};
