/**
 * This is a minimal config.
 *
 * If you need the full config, get it from here:
 * https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js
 */

module.exports = {
  content: [
    /**
     * HTML. Paths to Django template files that will contain Tailwind CSS classes.
     */

    /*  Templates within theme app (<tailwind_app_name>/templates), e.g. base.html. */
    "../templates/**/*.html",

    /*
     * Main templates directory of the project (BASE_DIR/templates).
     * Adjust the following line to match your project structure.
     */
    "../../templates/**/*.html",

    /*
     * Templates in other django apps (BASE_DIR/<any_app_name>/templates).
     * Adjust the following line to match your project structure.
     */
    "../../**/templates/**/*.html",

    /**
     * Python files. Paths to Django form files that will contain Tailwind CSS classes.
     */
    "../../**/forms.py",

    /**
     * JS: If you use Tailwind CSS in JavaScript, uncomment the following lines and make sure
     * patterns match your project structure.
     */
    /* JS 1: Ignore any JavaScript in node_modules folder. */
    // '!../../**/node_modules',
    /* JS 2: Process all JavaScript files in the project. */
    // '../../**/*.js',

    /**
     * Python: If you use Tailwind CSS classes in Python, uncomment the following line
     * and make sure the pattern below matches your project structure.
     */
    // '../../**/*.py'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Archivo", "sans-serif"],
        heading: ['"Pilcrow Rounded"', "sans-serif"],
      },
      colors: {
        // Primaries
        primary: {
          DEFAULT: "oklch(0.17 0.1144 269.85)",
          50: "oklch(0.94 0.0262 264.44)",
          100: "oklch(0.9 0.0502 269.26)",
          200: "oklch(0.81 0.0955 269.76)",
          300: "oklch(0.69 0.163663 270.0784)",
          400: "oklch(0.54 0.2528 269.91)",
          500: "oklch(0.46 0.3054 265.49)",
          600: "oklch(0.45 0.312777 264.316)",
          700: "oklch(0.45 0.312777 264.316)",
          800: "oklch(0.42 0.287415 264.3072)",
          900: "oklch(0.34 0.2355 265.4)",
          950: "oklch(0.17 0.1144 269.85)",
        },

        // Secondaries || Accents
        secondary: {
          DEFAULT: "oklch(0.71 0.1925 44.04)",
          50: "oklch(0.98 0.0154 67.65)",
          100: "oklch(0.95 0.037 68.66)",
          200: "oklch(0.89 0.074753 64.6619)",
          300: "oklch(0.82 0.1223 59.71)",
          400: "oklch(0.74 0.1721 49.38)",
          500: "oklch(0.71 0.1925 44.04)",
          600: "oklch(0.64 0.2131 36.63)",
          700: "oklch(0.55 0.1895 34.81)",
          800: "oklch(0.46 0.1573 33.72)",
          900: "oklch(0.4 0.128 34.53)",
          950: "oklch(0.26 0.0847 33.27)",
        },

        // Neutrals
        darkColor: "oklch(0.15 0 0)",
        whiteColor: "oklch(0.99 0.0026 286.35)",
        greyColor: "oklch(0.64 0 0)",

        // States
        success: "oklch(0.61 0.1507 154.1)",
        error: "oklch(0.6 0.1898 28.87)",
        warning: "oklch(0.81 0.166182 82.7023)",
        info: "oklch(0.63 0.18 259.96)",
      },
    },
  },
  plugins: [
    /**
     * '@tailwindcss/forms' is the forms plugin that provides a minimal styling
     * for forms. If you don't like it or have own styling for forms,
     * comment the line below to disable '@tailwindcss/forms'.
     */
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
