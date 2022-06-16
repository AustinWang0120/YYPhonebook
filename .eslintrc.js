module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    // "extends": "eslint:recommended",
    extends: "airbnb",
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
    },
}
