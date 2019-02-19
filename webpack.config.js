const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCSS = new ExtractTextPlugin('bundle.css');

module.exports = {
    mode: "development",
    entry:  path.join(__dirname, "src"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/dist/"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        alias: {
            "typeorm": "typeorm/browser",
        }
    },
    module: {
        rules: [
            {
                test: /\.(woff|woff2)$/,
                loader: "url-loader",
            }, {
                test: /\.(png|svg|ttf|eot)$/,
                loader: "file-loader",
                options: {
                    name: "[name]-[sha512:hash:hex:8].[ext]",
                },
            }, {
                test: /\.tsx?/,
                loader: "ts-loader",
                exclude: [/__tests__/ ],
                options: {
                    configFile: "tsconfig-webpack.json",
                },
            }, {
                test: /\.css$/,
                loader: extractCSS.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: { sourceMap: true },
                        }, {
                            loader: "resolve-url-loader",
                        },
                    ],
                }),
            }, {
                test: /\.scss$/,
                loader: extractCSS.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                importLoaders: 1,
                                sourceMap: true
                            },
                        }, {
                            loader: "resolve-url-loader"
                        }, {
                            loader: "sass-loader",
                            options: { sourceMap: true },
                        },
                    ],
                }),
            },
        ],
    },
    devtool: "source-map",
    devServer: {
        port: 6000,
        historyApiFallback: true
    },
    plugins: [
        extractCSS,
    ],
};
