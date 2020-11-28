const path = require('path')

module.exports = {
    publicPath: './',
    outputDir: process.env.NODE_ENV === 'PRODUCTION'
    ? '/usr/local/apache/htdocs/'
    : path.resolve(__dirname, '../server/public/')
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:3333'
    //         }
    //     }
    // }
}