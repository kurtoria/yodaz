module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react']
        },
        test: /\.js$/
      },
      {
        exclude: /node_modules/,
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname
  }
}
