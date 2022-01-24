/**
 * 封装常用环境常量
 */
export const dpr = document.documentElement.dataset.dpr || 1
export const isIOS = /iphone/i.test(navigator.userAgent)
export const isAndroid = /android/i.test(navigator.userAgent)
export const isQBApp = /jfwallet/i.test(navigator.userAgent)
export const isWKOldApp = /Html5Plus/i.test(navigator.userAgent)
export const isWKNewApp = /jfwklc/i.test(navigator.userAgent)
export const isWKApp = isWKOldApp || isWKNewApp
export const isWeChat = /MicroMessenger/i.test(navigator.userAgent) // 是否是微信环境
export const isApp = isQBApp || isWKApp // 是否是app环境
export const isQB = process.env.CHANNEL === 'qb' // 钱包渠道
export const isWK = process.env.CHANNEL === 'wk' // 悟空渠道

/**
 * 当前机型是否为：iPhone X/Xr/Xs/Xs Max
 * @returns {boolean}
 */
export const isIPhoneX = () => {
  const screenH = window.screen.height
  const screenW = window.screen.width
  const isX = isIOS && ((screenH === 812 && screenW === 375) || (screenH === 896 && screenW === 414))
  return isX
}
/**
 * 旧版悟空系统状态栏高度
 */
export const immersed = () => {
  let immersed = 0
  let ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent)
  if (ms && ms.length >= 3) {
    immersed = parseFloat(ms[2])
  }
  return parseFloat((immersed))
}

export const safeAreaTop = (isQBApp && isIOS ? (isIPhoneX() ? 44 : 20) : (isWKOldApp ? immersed() : 0)) * dpr

export const safeAreaBottom = (isQBApp && isIOS ? (isIPhoneX() ? 34 : 0) : 0) * dpr
export const appHeadHeight = 44 * dpr // 标题栏高度
export const appHeaderHeight = appHeadHeight + safeAreaTop // 标题栏加状态栏高度
