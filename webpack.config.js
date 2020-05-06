const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    mode: "production",

    entry: {
        main: './src/index.tsx'
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css"]
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
                test: /\.css$/,
                use: [
                    'style-loader',
                    {loader: 'css-loader', options: { importLoaders: 1 }},
                    'postcss-loader'
                ]
            },
            {
                enforce: "pre",
                test: /\.ts(x?)$/,
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
            { from: "./node_modules/react/umd/react.production.min.js", to: "./vendor/react.js" },
            { from: "./node_modules/react-dom/umd/react-dom.production.min.js", to: "./vendor/react-dom.js" },
        ]),
    ],
};
