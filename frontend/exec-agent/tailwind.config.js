/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0F1A2A",
          700: "#1E3A5F",
          500: "#3A5A80",
          300: "#7C93AC",
        },
        slate: {
          25: "#F7F8FA",
          50: "#F2F4F7",
          100: "#E4E7EC",
          200: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          800: "#1D2939",
          900: "#101828",
        },
        forest: {
          50: "#EEF6F1",
          100: "#D6EBDD",
          500: "#2F6F4E",
          600: "#255A3E",
        },
        amber: {
          50: "#FDF3E7",
          100: "#FBE6C9",
          500: "#B7791F",
          600: "#96620F",
        },
        rose: {
          50: "#FBEAE8",
          100: "#F5CFC9",
          500: "#B42318",
          600: "#912018",
        },
        azure: {
          50: "#EBF1FA",
          100: "#D3E2F3",
          500: "#1E3A5F",
          600: "#16293F",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};
