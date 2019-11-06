const path = require('path');

const PATHS = {
  source: path.resolve(__dirname, 'src'),
  build: path.resolve(__dirname, 'build'),
  root: path.resolve(__dirname)
};

const commonConfig = {
  entry: path.resolve(PATHS.source, 'index.ts'),
  output: {
    library: 'SvgEditor',
    libraryTarget: 'umd',
    path: PATHS.build,
    filename: 'SvgEditor.umd.js'
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': PATHS.source
    }
  },
  module: {
    rules: [
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader'
        },
      }
    ]
  }
};

const devConfig = {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    contentBase: PATHS.root,
    hot: true,
    port: 9000,
    openPage: 'example/example.html'
  }
};

const prodConfig = {
  mode: 'production'
};

module.exports = env => {
  switch (env) {
    case 'production':
      return { ...commonConfig, ...prodConfig };
    case 'development':
      return { ...commonConfig, ...devConfig };
  }
};
