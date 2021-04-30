module.exports = {
  purge: [
    "..//js/**/*.js",
    "../../layouts/**/*.html",

    "../../../../layouts/**/*.html",
    "../../../../assets/js/**/*.js",
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {},
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
