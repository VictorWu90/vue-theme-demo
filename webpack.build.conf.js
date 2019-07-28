const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const needAnalyzer = false;

const HtmlWebpackPlugin = require('html-webpack-plugin');


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


module.exports = {
    mode: 'none',
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        chunkFilename: assetsPath('js/[name].[hash:7].js')
    },
    module: {
        rules: [
            ...[createLintingRule()],
            {
                test: /\.css$/,
                use: [
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: {
                    //         publicPath: '../../'
                    //     }
                    // },
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: {
                    //         publicPath: '../../'
                    //     }
                    // },
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
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1,
                    name: 'static/fonts/[name].[hash:7].[ext]'
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
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(
            ['dist'], // 匹配删除的文件
            {
                root: path.resolve(__dirname, './'), // 根目录
                verbose: true, // 开启在控制台输出信息
                dry: false // 启用删除文件
            }
        ),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash:7].css',
            chunkFilename: 'static/css/[name].[hash:7].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            title: 'Demo',
            favicon: path.resolve(__dirname, '../src/assets/img/favicon.png'),
            filename: 'index.html',
            inject: true
        })
    ],
    optimization: {
        minimizer: [],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendors'
                },
                normal: {
                    name: 'theme-normal',
                    test: (m, c) => {
                        if (
                            m.constructor.name === 'CssModule' &&
                            new RegExp(
                                '/src/assets/styles/theme/theme-normal.scss|theme=normal'
                            ).test(m._identifier)
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    chunks: 'all',
                    enforce: true
                },
                green: {
                    name: 'theme-green',
                    test: (m, c) => {
                        if (
                            m.constructor.name === 'CssModule' &&
                            new RegExp(
                                '/src/assets/styles/theme/theme-green.scss|theme=green'
                            ).test(m._identifier)
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]);
    module.exports.optimization.minimizer.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: true,
            parallel: true
        })
    );
    module.exports.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
} else if (process.env.NODE_ENV === 'development') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        })
    ]);
}

if (needAnalyzer) {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new BundleAnalyzerPlugin()
    ]);
}
