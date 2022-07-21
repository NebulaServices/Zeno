module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {}
  },
  plugins: [
    ({ addVariant }) => {
      addVariant("light", ".light &");
    }
  ],
  safelist: [
    "transition-colors",
    "duration-200",
    "overflow-hidden",
  ]
};
