// Tailwind CSS v4: use the separate PostCSS plugin package
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {}, // keep if you still want explicit autoprefixer; can remove if relying on Lightning CSS pipeline
  },
};
