
// 微信工具方法

/**
 * 设置微信验证签名方法
 * @param {*} weChatInfo
 */
export const configWeChat = (weChatInfo) => {
  if (!weChatInfo && !window.wx) {
    return false
  }
 wx.config({
    debug: false, // TODO: 需要查看问题时可以修改
    appId: weChatInfo.appId,
    timestamp: weChatInfo.timestamp,
    nonceStr: weChatInfo.nonceStr,
    signature: weChatInfo.signature,
    jsApiList: [ // 用到的微信jssdk方法列表
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'onMenuShareAppMessage',
      'onMenuShareTimeline',
      'hideMenuItems',
      'showOptionMenu',
      'closeWindow'
    ]
  })
  // 设置微信
  wx.ready(function () {
    // 隐藏的菜单
    hideMenuItems()
  })
}

/**
 * 隐藏微信菜单
 */
export const hideMenuItems = () => {
  //  批量隐藏菜单项
  wx.hideMenuItems({
    menuList: [
      'menuItem:readMode', // 阅读模式
      'menuItem:copyUrl', // 复制链接
      'menuItem:openWithQQBrowser', // 在QQ浏览器里打开
      'menuItem:openWithSafari', // 在safari 中打开
      'menuItem:share:email', // 邮件
      'menuItem:share:qq', // 分享到 QQ
      'menuItem:share:weiboApp', // 分享到微博
      'menuItem:share:QZone', // 分享到qq空间
      'menuItem:refresh', // 刷新
      'menuItem:favorite', // 收藏
      'menuItem:refresh',
      'menuItem:exposeArticle' // 举报
    ],
    success: function (res) {
      // console.log('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮')
    },
    fail: function (res) {
      // console.log(JSON.stringify(res))
    }
  })
}

/**
 * 配置自定已微信分享信息
 * @param {Object} shareInfo 分享信息
 * @param {String} shareInfo.title 分享标题
 * @param {String} shareInfo.link
 * @param {String} shareInfo.imgUrl
 * @param {Function} shareInfo.success
 * @example
 * configWeChatShare({
 * title:'',
 * link:'',
 * imgUrl:'',
 * success:function(){}
 * })
 */
export const configWeChatShare = (shareInfo) => {
  if (!shareInfo) {
    return false
  }
  shareInfo = JSON.parse(JSON.stringify(shareInfo))
  // 设置微信
  wx.ready(function () {
    // 旧版微信 调用
    if (wx.onMenuShareTimeline) {
      wx.onMenuShareTimeline({
        title: shareInfo.title, // 分享标题
        link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareInfo.imgUrl // 分享图标
      })

      wx.onMenuShareAppMessage({
        title: shareInfo.title, // 分享标题
        desc: shareInfo.desc, // 分享描述
        link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareInfo.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
      })
    } else {
      wx.updateAppMessageShareData({
        title: shareInfo.title,
        desc: shareInfo.desc,
        imgUrl: shareInfo.imgUrl,
        link: shareInfo.link,
        success: function () {
          // 设置成功
          console.log('updateAppMessageShareData 设置成功')
        }
      })
      wx.updateTimelineShareData({
        title: shareInfo.title,
        desc: shareInfo.desc,
        imgUrl: shareInfo.imgUrl,
        link: shareInfo.link,
        success: function () {
          // 设置成功
          console.log('updateTimelineShareData 设置成功')
        } }
      )
    }
  })
}
