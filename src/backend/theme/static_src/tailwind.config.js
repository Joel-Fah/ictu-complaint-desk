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
        '../templates/**/*.html',

        /*
         * Main templates directory of the project (BASE_DIR/templates).
         * Adjust the following line to match your project structure.
         */
        '../../templates/**/*.html',

        /*
         * Templates in other django apps (BASE_DIR/<any_app_name>/templates).
         * Adjust the following line to match your project structure.
         */
        '../../**/templates/**/*.html',

        /**
         * Python files. Paths to Django form files that will contain Tailwind CSS classes.
         */
        '../../**/forms.py',

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
                sans: ['Archivo', 'sans-serif'],
                heading: ['"Pilcrow Rounded"', 'sans-serif']
            },
            colors: {
                // Primaries
                primary: {
                    DEFAULT: '#050040',
                    50: '#e2ebfd',
                    100: '#d0ddff',
                    200: '#a8beff',
                    300: '#7593ff',
                    400: '#3d51fe',
                    500: '#1313fe',
                    600: '#0400ff',
                    700: '#0400ff',
                    800: '#0400e4',
                    900: '#0900b0',
                    950: '#050040',
                },

                // Secondaries || Accents
                secondary: {
                    DEFAULT: '#ff7023',
                    50: '#fff6ed',
                    100: '#ffead4',
                    200: '#ffd2a8',
                    300: '#ffb170',
                    400: '#ff8537',
                    500: '#ff7023',
                    600: '#f04806',
                    700: '#c73407',
                    800: '#9e290e',
                    900: '#7f250f',
                    950: '#450f05',
                },

                // Neutrals
                darkColor: '#0b0b0b',
                whiteColor: '#fbfbfd',
                greyColor: '#8c8c8c',

                // States
                success: '#0d9c57',
                error: '#da4336',
                warning: '#f5b503',
                info: '#4285f4',
            }
        },
    },
    plugins: [
        /**
         * '@tailwindcss/forms' is the forms plugin that provides a minimal styling
         * for forms. If you don't like it or have own styling for forms,
         * comment the line below to disable '@tailwindcss/forms'.
         */
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
