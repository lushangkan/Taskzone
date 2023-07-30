/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,vue,less,css}",
    "./index.html",
  ],
  theme: {
    extend: {

    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        theme1: {
          "primary": "#63e6be",
          "secondary": "#faa2c1",
          "accent": "#c0eb75",
          "neutral": "#495057",
          "base-100": "#fff",
          "info": "#2789F9",
          "success": "#80D263",
          "warning": "#FFEE4B",
          "error": "#FF6B54",
        }
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
  },
}

