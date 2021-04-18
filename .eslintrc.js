module.exports = {
    root: true,

    //required!; use the previously installed parser; it allows ESLint to understand
    //TypeScript syntax; it converts TypeScript into an ESTree-compatible form so it
    //can be used in ESLint
    parser: '@typescript-eslint/parser',

    parserOptions: {
        project: ['./tsconfig.json'],  //required for "type-aware linting"
    },

    plugins: [
        //load the previously installed plugin; allows me to use the rules within my codebase
        "@typescript-eslint",
        "prettier",
        "unicorn" ,
        "import"
    ],

    extends: [  // 'eslint-config-' can be ommited ex. in eslint-config-standard

        //enable all ESLint rules (for example to explore); todo: what with Typescipt?
        //'eslint:all',

        //ESLint's inbuilt "recommended" config - a small, sensible set of rules
        //'eslint:recommended',

        //disables a few of the recommended rules from the 'eslint:recommended' that
        //are already covered by TypeScript's typechecker
        //'plugin:@typescript-eslint/eslint-recommended',

        //Typescript ESLint "recommended" config - it's just like eslint:recommended,
        //except it only turns on rules from our TypeScript-specific plugin
        //'plugin:@typescript-eslint/recommended',

        //"type-aware linting" - rules reporting errors based on type information
        //recommended; takes longer if run from CMD for large project
        //see: https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md
        //'plugin:@typescript-eslint/recommended-requiring-type-checking',

        //if I use it, then comment all above extensions i.e. 'eslint:recommended',
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:unicorn/recommended",
        "plugin:prettier/recommended",
        "prettier"
    ],

    rules: {
        "import/prefer-default-export": 0,
        "@typescript-eslint/indent": ["error", 4],
        "object-curly-spacing": ["error", "always"],
        "class-methods-use-this": 0,
        "max-len": ["error", { "code": 120 }],
        "@typescript-eslint/ban-ts-comment": 0,
        "consistent-return": 0,
        "no-shadow": "off",
        "unicorn/filename-case": "off"
    }
};