import { stringify } from 'qs'
import { configWeChat, configWeChatShare } from '../wechat/index'
import { fetchWeChatAuth } from '@/api/common.js'
import { isWeChat } from '@/utils/app'
import { getURLParams, getURLParam } from '@/utils'
import API from '@/api'

/**
 * 微信验证签名 minx
 */
let wechatMixin = {
  data () {
    return {
      code: ''
    }
  },
  created () {
    // 如果是微信环境进行验证签名
    if (isWeChat) {
      this.code = getURLParam('code')
      this.wechatAuth()
    }
  },
  methods: {
    /**
     * 配置分享信息
     * @example
     * this.configWeChatShare({
     *  title: '分享标题',
     *  link: '分享链接',
     *  imgUrl: '分享图片'
     *  })
     */
    configWeChatShare,
    wechatAuth: function () {
      // 微信公众号验签
      fetchWeChatAuth().then(data => {
        configWeChat(data.data)
      })
    },
    /**
    * 获取要分享的链接
    * @param {*} routerName 分享后要跳转的页面路由
    * @param {*} params 分享要带的参数
    */
   getShareUrl (routerName, params) {
     let redirectType = params.redirectType || ''
     // redirectType == 'redirect' 表示链接需要通过微信授权重定向
     if (!redirectType) {
       params.redirectType = 'redirect'
     }
     let prefixUrl = window.location.href.replace(window.location.hash, '').replace(window.location.search, '')
     let strParams = stringify(params)
     let url = `${prefixUrl}#/${routerName}?${strParams}`
     return url
   },
   /**
    * 格式化URL
    */
   formatUrl () {
     let params = getURLParams() || {}
     let prefixUrl = window.location.href.replace(window.location.hash, '').replace(window.location.search, '')
     // 获取中转后的
     let routerName = params.shareRouter || ''
     if (params.redirectType) { // 删除重定向标示参数
       delete params.redirectType
     }
     if (params.shareRouter) { // 删除分享路由参数
       delete params.shareRouter
     }

     let strParams = stringify(params)
     let urlpath = `${prefixUrl}#/${routerName}?${strParams}`
     return urlpath
   },
   /**
    * 转换为微信地址
    * @param {String} redirect_uri -需要重定向到的地址
    * @param {String} type -授权类型
    *                    snsapi_base 不弹授权提示只获取用户 openid
    *                    snsapi_userinfo  snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
    */
   redirect () {
     let scope = 'snsapi_userinfo'
     let redirect_uri = this.formatUrl()
     redirect_uri = encodeURIComponent(redirect_uri)
     let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${API.WXAPPID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}#wechat_redirect`
     window.location.replace(url)
   }
  }
}

export default wechatMixin
