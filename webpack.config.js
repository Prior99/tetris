const GitRevisionPlugin = require("git-revision-webpack-plugin");
const path = require('path');
const { HotModuleReplacementPlugin, DefinePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const gitRevision = new GitRevisionPlugin({ lightweightTags: true });

module.exports = {
    entry: {
        bundle: path.join(__dirname, "src"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "dist/"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        modules: [
            path.join(__dirname, "node_modules"),
            path.join(__dirname, "src"),
            path.join(__dirname, "."),
        ],
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
                exclude: [/__tests__/],
                options: {
                    configFile: "tsconfig-webpack.json",
                },
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { publicPath: "." },
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            sourceMap: true
                        },
                    }, {
                        loader: "sass-loader",
                        options: { sourceMap: true },
                    },
                ]
            },
        ],
    },
    devtool: "source-map",
    devServer: {
        port: 6100,
        historyApiFallback: true,
        hot: true,
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new DefinePlugin({
            // Taken and adapted from the official README.
            // See: https://www.npmjs.com/package/git-revision-webpack-plugin
            "SOFTWARE_VERSION": JSON.stringify(gitRevision.version()),
        }),
        new MiniCssExtractPlugin(),

    ],
};
