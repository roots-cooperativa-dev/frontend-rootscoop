import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Nueva paleta ROOTS Comunidad - sin gradientes
        roots: {
          // Colores principales
          aguamarina: "#017C75",
          bordo: "#942E4F",
          blanco: "#FFFFFF",

          // Colores por categoría
          amarillo: "#FFBA08",
          lima: "#B6E300",
          naranja: "#F39C12",
          violeta: "#662D91",
          fucsia: "#E63946",

          // Colores 8M
          rosa: "#FF2D55",
          coral: "#FF7E5F",
          durazno: "#FEB47B",

          // Colores de contraste para texto
          gris: "#2D3748",
          grisClaro: "#718096",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#017C75",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#942E4F",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-cooperativo": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1.05)",
            opacity: "0.8",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-cooperativo": "pulse-cooperativo 2s ease-in-out infinite",
      },
      backgroundImage: {
        "texture-mural":
          'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter></defs><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.1"/></svg>\')',
      },
      fontFamily: {
        cooperativo: ["Baloo 2", "Chewy", "cursive"],
        popular: ["Montserrat", "Raleway", "sans-serif"],
        stencil: ["Oswald", "Impact", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
