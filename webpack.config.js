const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'max-exchange-api.js',
    globalObject: 'this',
    library: 'MAX',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  target: 'node'
}
