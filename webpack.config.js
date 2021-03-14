const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: [/node_modules/]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "webjvm.bundle.js",
        library: {
            type: "umd2",
            name: "webjvm"
        }
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}