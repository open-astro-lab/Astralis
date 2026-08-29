/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0B0E1A",
        panel: "#12162A",
        panelLight: "#1B2140",
        nebula: "#7C6CF0",
        nebulaSoft: "#A79AF5",
        starlight: "#F2C572",
        text: "#EDEFF7",
        muted: "#8B93AE",
        verified: "#3FD6B0",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 108, 240, 0.55)",
        glowGold: "0 0 30px -8px rgba(242, 197, 114, 0.5)",
      },
    },
  },
  plugins: [],
}
