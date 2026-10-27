/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#39FF14",
          pressed: "#2FE010",
          dim: "rgba(57,255,20,0.12)",
        },
        secondary: "#00C853",
        bg: "#0B0F14",
        surface: {
          DEFAULT: "#1A1F2B",
          elevated: "#212736",
        },
        line: "#2A3142",
        content: {
          DEFAULT: "#E5E7EB",
          muted: "#9CA3AF",
          inverse: "#0B0F14",
        },
        danger: "#FF4D4D",
        success: "#00C853",
      },
      fontFamily: {
        regular: ["Nunito_400Regular"],
        semibold: ["Nunito_600SemiBold"],
        bold: ["Nunito_700Bold"],
        extrabold: ["Nunito_800ExtraBold"],
      },
      fontSize: {
        display: ["34px", { lineHeight: "40px" }],
        title: ["26px", { lineHeight: "32px" }],
        heading: ["20px", { lineHeight: "26px" }],
        body: ["15px", { lineHeight: "22px" }],
        button: ["16px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
      borderRadius: {
        md: "14px",
        lg: "20px",
        card: "14px",
      },
      height: {
        cta: "52px",
        input: "52px",
      },
      maxWidth: {
        content: "340px",
      },
    },
  },
  plugins: [],
};
