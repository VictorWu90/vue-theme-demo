// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:promise/recommended',
        'prettier'
    ],
    // parser: "babel-eslint",
    parserOptions: {
        parser: "babel-eslint",
        ecmaVersion: 2017,
        sourceType: "module"
    },
    // required to lint *.vue files
    plugins: [
        'vue',
        'prettier',
        'import',
        'promise'
    ],
    // add your custom rules here
    rules: {
        "prettier/prettier": "error",
        "standard/computed-property-even-spacing": 0
    },
    globals: {
    },
    settings: {
        "import/resolver": {
            node: {
                paths: ["@", "vue$"],
                extensions: ['*', '.js', '.vue', '.json']
            }
        }
    }
}
