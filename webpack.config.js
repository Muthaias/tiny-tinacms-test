const CopyPlugin = require("copy-webpack-plugin");
const mode = "production";
const reactLib =  mode === "production" ? "production.min" : "development";
module.exports = {
    mode: mode,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new CopyPlugin([
            { from: "./index.html", to: "./index.html" },
            { from: "./node_modules/react/umd/react." + reactLib + ".js", to: "./vendor/react.js" },
            { from: "./node_modules/react-dom/umd/react-dom." + reactLib + ".js", to: "./vendor/react-dom.js" },
        ]),
    ],
};
