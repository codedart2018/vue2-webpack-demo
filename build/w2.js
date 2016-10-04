const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isProd = process.env.NODE_ENV === 'production';
const versions = '1.0.0';
const hash = '[hash:8]';
//todo 根据这个来判断
console.log(isProd);

const entry = './src/main.js';
const devEntry = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?reload=true',
    entry,
];

// css sass less 分离
const lessExtractor = new ExtractTextPlugin('style/less-[name].css');
const cssExtractor = new ExtractTextPlugin('style/css-[name].css');

const basePlugins = isProd ? [
    //文件顶部注释说明
    new webpack.BannerPlugin(`构建版本号：${versions}, 构建时间： ${new Date().toString()}`),
    // 这个插件用来阻止Webpack把过小的文件打成单独的包
    new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200, // ~50kb
    }),
    //提公用js到common.js文件中
    // new webpack.optimize.CommonsChunkPlugin('js/common'),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: false
    })
] : [
    //自动在项目首页加上需要的内容 比如JS引入就不必了
    new HtmlWebpackPlugin({
        title: 'webpack-browser-sync-vue2-demo',
        filename: 'index.html',
        template: 'index.html',
        // inject: false,
        prod: isProd,
        minify: isProd ? {
            removeComments: true,
            collapseWhitespace: true
        } : null,
    })
];

//公共插件选项
const commonPlugins = [
    // ExtractTextPlugin 分离CSS文件
    lessExtractor,
    cssExtractor,
    new webpack.HotModuleReplacementPlugin()
]

module.exports = {
    devtool: isProd ? '#source-map' : '#eval-source-map',
    //入口文件
    entry: isProd ? entry : devEntry,
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: cssExtractor.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/i,
                loader: lessExtractor.extract(['css','less'])
            }
        ]
    },
    plugins: basePlugins.concat(commonPlugins)
}