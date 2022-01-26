module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          // remUnit 通常我们是根据设计图宽度十分之一来定这个值
          // 假如设计图给的宽度是750，我们通常就会把remUnit设置为75，这样我们写样式时，可以直接按照设计图标注的宽高来1:1还原开发。
          require('postcss-px2rem')({
            remUnit: 80
          })
        ]
      }
    }
  }
}
