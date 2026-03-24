/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dourado: {
          DEFAULT: "#C9A84C",
          claro: "#DFC27A",
          escuro: "#A07830",
        },
        creme: {
          DEFAULT: "#FDF6EC",
          escuro: "#F5E8D0",
        },
        lavanda: {
          DEFAULT: "#B8B5D4",
          claro: "#D5D3E8",
          escuro: "#8E8BB8",
        },
        marrom: {
          DEFAULT: "#3D2B1F",
          claro: "#6B4C3B",
        },
      },
      fontFamily: {
        cormorant: ["Cormorant Garamond", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "silva-gradient": "linear-gradient(135deg, #FDF6EC 0%, #F5E8D0 50%, #E8D5B8 100%)",
        "dourado-gradient": "linear-gradient(135deg, #DFC27A 0%, #C9A84C 50%, #A07830 100%)",
        "hero-pattern": "linear-gradient(to bottom right, #FDF6EC, #D5D3E8, #FDF6EC)",
      },
      boxShadow: {
        "dourado": "0 4px 20px rgba(201, 168, 76, 0.3)",
        "dourado-lg": "0 8px 40px rgba(201, 168, 76, 0.4)",
        "elegante": "0 4px 30px rgba(61, 43, 31, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
