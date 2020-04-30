import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: {
    vendor: path.resolve(__dirname, 'src/vendor'),
    main: path.resolve(__dirname, 'src/index')
  },
  target: "web",
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    // generate an external css file with a hash in the filename.
    new ExtractTextPlugin('[name].[contenthash].css'),
    // hash files using MD5 hash so names change when file content changes.
    new WebpackMd5Hash(),
    // use CommonsChunkPlugin to create separate bundle of
    //  vendor libs. note this name matches the "vendor" name in "entry" above.
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor" }),
    // create HTML file that includes references to bundled JS
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      // properties you define here are available in index.html
      // using htmlWebpackPlugin.options.varName
      trackJSToken: 'not-a-real-token'
    }),
    // eliminate duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin(),
    // minifies JS
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap')}
    ]
  }
}
