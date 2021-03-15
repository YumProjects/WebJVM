module.exports = function (api) {
    api.cache(true);
  
    return {
        "presets": [
            ["@babel/env", { "useBuiltIns": "usage", "corejs": { "version": "3.9.1", "proposals": true } }],
            ["@babel/preset-typescript", { "allExtensions": true, "isTSX": true }],
        ],
        "plugins": [
            "@babel/plugin-syntax-dynamic-import",
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread"
        ]
    }
}