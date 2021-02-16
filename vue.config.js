module.exports = {
    configureWebpack:{
        resolve:{
            alias: {
                // 路径别名
                'assets':'@/assets',
                'common':'@/common',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views',
                'plugins':'@plugins',

                // 'node':''
            }
        },
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.1.94:3000',
                ws: false,
                changeOrigin:true,//允许跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        },


    },



}
