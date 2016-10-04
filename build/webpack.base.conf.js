const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//todo 根据这个来判断是否开发环境
const isProd = process.env.NODE_ENV === 'production';
const versions = '1.0.0';
const hash = '[hash:8]';
console.log(isProd);

// css sass less 分离
const lessExtractor = new ExtractTextPlugin('style/less-[name].css');
const cssExtractor = new ExtractTextPlugin('style/css-[name].css');

const basePlugins = isProd ? [ //打包环境
    //文件顶部注释说明
    new webpack.BannerPlugin(`构建版本号：${versions}, 构建时间： ${new Date().toString()}`),
    // 这个插件用来阻止Webpack把过小的文件打成单独的包
    new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 51200, // ~50kb
    }),
    //提公用js到common.js文件中
    new webpack.optimize.CommonsChunkPlugin('/common'),
    //去除所有注释
    new webpack.optimize.UglifyJsPlugin({
        //output: {
            //comments: false, todo 打开将不会有任务注释
        //},
        compress: {
            warnings: false
        }
    }),
    //压缩
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: false
    })
] : [ //开发环境
    //自动在项目首页加上需要的内容 比如JS引入就不必了
    new HtmlWebpackPlugin({
        title: 'webpack-browser-sync-vue2-demo',
        filename: './index.html',
        template: './index.html',
        inject:true,
    })
];
//公共插件选项
const commonPlugins = [
    // ExtractTextPlugin 分离CSS文件
    lessExtractor,
    cssExtractor
]

module.exports = {
    devtool: isProd ? '#source-map' : '#eval-source-map',
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '/static/',
        filename: '/js/[name].js'
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
            },
        ]
    },
    plugins: basePlugins.concat(commonPlugins)
}