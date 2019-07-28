const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/,
    enforce: 'pre',
    include: /src/,
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: true
    }
});

const assetsPath = _path => {
    return path.posix.join('static', _path);
};


module.exports = env => {
   let localWebpackConfig = {
        mode: 'none',
        entry: './src/main.js',
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js',
            chunkFilename: assetsPath('js/[name].[hash:7].js'),
            publicPath: './',
            globalObject: 'this'
        },
        module: {
            rules: [
                ...[createLintingRule()],
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        'css-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.vue$/,
                    use: ['vue-loader']
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [
                        resolve('src'),
                        resolve('node_modules/webpack-dev-server/client')
                    ],
                    options: {
                        ...JSON.parse(
                            fs.readFileSync(path.resolve(__dirname, '.babelrc'))
                        )
                    }
                }
            ]
        },
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                '@': path.resolve(__dirname, 'src/')
            },
            extensions: ['*', '.js', '.vue', '.json']
        },
        performance: {
            hints: false
        },
        devtool: '#cheap-module-source-map',
        devServer: {
            clientLogLevel: 'warning',
            historyApiFallback: {
                rewrites: [
                    {
                        from: /.*/,
                        to: path.posix.join('/', 'index.html')
                    }
                ]
            },
            hot: true,
            contentBase: false, // since we use CopyWebpackPlugin.
            compress: true,
            host: 'localhost',
            port: 8080,
            open: false,
            overlay: {
                warnings: false,
                errors: true
            },
            publicPath: '/',
            proxy: {
                '/': {
                    target: 'http://localhost:8081'
                }
            },
            quiet: true, // necessary for FriendlyErrorsPlugin
            watchOptions: {
                poll: false
            },
            disableHostCheck: true
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            }),
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].[hash:7].css',
                chunkFilename: '[name].[hash:7].css'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
            new webpack.NoEmitOnErrorsPlugin(),
            // https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                title: 'Demo',
                favicon: path.resolve(__dirname, './src/assets/img/favicon.png'),
                filename: 'index.html',
                template: 'index.html',
                inject: true
            })
        ]
    };
    return new Promise((resolve, reject) => {
        portfinder.basePort = 8080;
        portfinder.getPort((err, port) => {
            if (err) {
                reject(err);
            } else {
                // add port to devServer config
                localWebpackConfig.devServer.port = port;

                // Add FriendlyErrorsPlugin
                localWebpackConfig.plugins.push(
                    new FriendlyErrorsPlugin({
                        compilationSuccessInfo: {
                            messages: [
                                `Your application is running here: http://${localWebpackConfig.devServer.host}:${port}`
                            ]
                        },
                        onErrors: undefined
                    })
                );

                localWebpackConfig.plugins.push(
                    new webpack.DefinePlugin({
                        'process.env.PLATFORM': JSON.stringify('web'),
                        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
                        'process.env.TYPE': JSON.stringify('dev')
                    })
                );
                resolve(localWebpackConfig);
            }
        });
    });
}