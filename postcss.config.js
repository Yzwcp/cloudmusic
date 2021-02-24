module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 375,  //视窗的宽度，（设计稿的宽度）
      viewportHeight: 667, //视窗的高度，（设计稿的高度）
      unitPrecision: 5,//保留小数位数
      viewportUnit: 'vw',//转换宽度
      selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'],
      minPixelValue: 1,
      mediaQuery: false//允许在媒体查询转换
    }
  }
}
