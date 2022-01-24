import { isAndroid, isIOS, dpr, isQBApp, isWKApp, isWKNewApp, isApp, isWeChat, isQB, isWK, isIPhoneX, safeAreaTop, safeAreaBottom,
  appHeadHeight, appHeaderHeight,
  isWKOldApp
} from '../app'
import { mapGetters } from 'vuex'
// import { getStatusBarHeight } from '@/utils/app/wk/jsbridge'
// APP环境
window.$isAndroid = isAndroid
window.$isIOS = isIOS
window.$dpr = dpr
window.$isQBApp = isQBApp // 是否钱包APP
window.$isWKApp = isWKApp // 是否悟空app
window.$isWKNewApp = isWKNewApp // 悟空 4.0
window.$isApp = isApp // 是否是app环境
window.$isWeChat = isWeChat // 是否是微信环境
window.$isQB = isQB // 钱包渠道
window.$isWK = isWK // 悟空渠道
window.$isIPhoneX = isIPhoneX
window.$safeAreaTop = safeAreaTop
window.$safeAreaBottom = safeAreaBottom
window.$appHeaderHeight = appHeaderHeight
window.$appHeadHeight = appHeadHeight
const channel = process.env.CHANNEL || 'qb'
window.channel = channel
let integral = ''
channel == 'wk' ? integral = '空粉币' : integral = '积分' // eslint-disable-line
/**
 * 环境插件
 * @param {*} Vue
 * @example
 * // Vue 组件里面
 * this.$isQBApp
 */
const globalPlugin = {
  install (Vue) {
    // 3. 注入组件选项
    Vue.mixin({
      computed: {
        ...mapGetters([ 'userInfo' ])
      },
      created: function () {
      }
      // methods: {
      //   getNewWKStatusBarHeight () {
      //     if (isWKNewApp) {
      //       getStatusBarHeight().then(res => {
      //         Vue.prototype.$appHeadHeight = res.height
      //       })
      //     }
      //   }
      // }
    })
    Vue.prototype.$dpr = dpr
    Vue.prototype.$channel = channel
    Vue.prototype.$isIOS = isIOS
    Vue.prototype.$isAndroid = isAndroid
    Vue.prototype.$isQBApp = isQBApp
    Vue.prototype.$isWKApp = isWKApp
    Vue.prototype.$isWKOldApp = isWKOldApp
    Vue.prototype.$isWKNewApp = isWKNewApp
    Vue.prototype.$isApp = isApp
    Vue.prototype.$isWeChat = isWeChat
    Vue.prototype.$isQB = window.isQB
    Vue.prototype.$isWK = window.isWK
    Vue.prototype.$isIPhoneX = isIPhoneX
    Vue.prototype.$safeAreaTop = safeAreaTop
    Vue.prototype.$safeAreaBottom = safeAreaBottom
    Vue.prototype.$appHeadHeight = appHeadHeight
    Vue.prototype.$appHeaderHeight = appHeaderHeight
    Vue.prototype.$integral = integral
  }
}

export default globalPlugin
