/* eslint-disable no-eval */
import { JsBridge } from './core'
const jsBridge = new JsBridge()

/**
 * URL Schema 协议
 * 悟空理财：jfwklc://
 * 手机浏览器访问如 jfwklc://pushWindow/?url={页面地址} 的链接，即可在外部唤醒APP并打开指定页面
 */
export const WKSchema = 'jfwklc://'

/**
 * 在悟空APP内打开本页面
 * @param {String} url 远端H5页面地址/app原生页面地址/app下沉页面地址
 * @desc jfwklc://pushWindow?url=
 */
export const awakenApp = (url = '') => {
  // 如果传入值，唤醒app打开传入的值对应页面，否则，唤醒app打开本页面
  let pageUrl = url || window.location.href
  window.location.href = `${WKSchema}pushWindow?url=${window.decodeURIComponent(pageUrl)}`
}

/**
 * 调用bridge上的方法
 * @param {String} method 方法名
 * @param {Object} params 调用方法传参
 * @returns {Promise<any>}
 */
export const invoke = ({ method, params = {} }) => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method,
      params,
      success: resolve,
      error: reject
    })
  })
}

/**
 * 向bridge上注册方法
 * @param {String} method 注册方法名
 * @param {Function} callback 注册执行方法
 */
export const register = ({ method, callback = () => {} }) => {
  jsBridge.register({
    method,
    callback
  })
  updateBridge()
}

/* 获取信息 */

/**
 * 获取用户基础信息
 * @desc 返回数据 data：
 * data.token
 * data.deviceInfo: {} // 设备信息
 * data.userInfo: {} // 用户信息-服务端返回数据
 * @returns {Promise<any>}
 */
export const getAppUserInfo = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getAppUserInfo',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 获取设备信息
 * @desc 返回数据 data：
 * data.deviceId
 * data.platform 平台
 * data.phoneType 机型
 * data.sysVersion 系统版本
 * data.userAgent 特殊防刷标示
 * data.appVersionName=4.0.0 app版本号
 * data.appVersionCode=400
 * @returns {Promise<any>}
 */
export const getAppDeviceInfo = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getAppDeviceInfo',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 获取App版本号
 * @desc 返回data：
 * data.appVersionName=4.0.0
 * data.appVersionCode=400
 * @returns {Promise<any>}
 */
export const getAppVersion = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getAppVersion',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 获取客服未读消息数
 * @desc 返回data：
 * data.unread=2
 * @returns {Promise<any>}
 */
export const getKefuCount = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getKefuCount',
      success: resolve,
      error: reject
    })
  })
}

// 路由方法

/**
 * 打开webview
 * @param {String} url 页面地址 url传参:hideNavBar=true是否隐藏头部/showWkLoading=true是否使用悟空头loading图
 * @param {Object} params 页面参数
 * @param {String} params.type 页面打开方式 ios-1从下往上/0从右往左(default) android-0/1从右往左
 * @param {Object} params.style 页面UI样式
 * @param {String} params.style.title 页面标题
 * @param {String} params.style.titleColor 页面标题颜色 #112233 6位rgb颜色
 * @param {String} params.style.navBgColor 页面标题背景颜色 6位rgb颜色
 * @param {String} params.style.navBgColorAlpha 页面标题背景颜色透明度 0-1
 * @param {Boolean} params.style.hideBackBtn 隐藏关闭按钮
 * @param {String} params.style.statusBarStyle 状态栏前景色 0黑/1白
 * @param {String} params.style.rightBtnText 页面标题右侧按钮文字
 * @param {String} params.style.btnTintColor 页面标题右侧按钮文字颜色
 */
export const pushWindow = (url = '', params = {}) => {
  let obj = {
    url: url,
    ...params
  }
  jsBridge.invoke({
    method: 'pushWindow',
    params: obj
  })
}

/**
 * 回退到根视图
 * 从当前页面查找历史栈，回退到历史对应的tab，如投资tab->产品详情->支付，回退到投资tab
 */
export const popToRoot = () => {
  jsBridge.invoke({
    method: 'popToRoot'
  })
}

/**
 * 返回上级页面/关闭当前页面
 * @param {String/Number} zIndex 关闭的层级
 */
export const popWindow = (zIndex = '1') => {
  jsBridge.invoke({
    method: 'popWindow',
    params: zIndex
  })
}

// 缓存

/**
 * 设置缓存
 * @param {String} key 键
 * @param {String} value 值 只支持字符串类型, 其他类型需转成字符串之后再设置
 */
export const setCache = (key = '', value = '') => {
  jsBridge.invoke({
    method: 'setCache',
    params: {
      key: key,
      value: value
    }
  })
}

/**
 * 获取缓存
 * @param {String} key 键
 * @returns {Promise<any>}
 */
export const getCache = (key = '') => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getCache',
      params: key,
      success: (res) => {
        resolve(res && res.value)
      },
      error: reject
    })
  })
}

/**
 * 清除写入缓存
 * @param {String} key 键
 */
export const clearCache = (key = '') => {
  jsBridge.invoke({
    method: 'clearCache',
    params: key
  })
}

/**
 * 清除页面加载缓存
 */
export const clearWebviewCache = () => {
  jsBridge.invoke({
    method: 'clearWebviewCache'
  })
}

// 工具类

/**
 * ios代理发送网络请求
 * @param url 地址
 * @param data body业务参数
 * @param params 查询字符串参数
 * @param headers 公用请求头参数
 * @param dataType 返回数据类型
 * @param type 请求类型
 * @returns {Promise<any>}
 */

export const request = (url, { data = {}, params = {}, headers = {}, dataType = 'json', type = 'post' }) => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'request',
      params: {
        method: type,
        url: url,
        data: data,
        params: params,
        responseType: dataType,
        headers: headers
      },
      success: (response) => {
        if (response && response.data && response.code === '000000') {
          resolve(response)
        } else if (response.data) {
          reject(response)
        } else {
          let errData = { code: '-200', message: '返回数据未知异常，请稍后重试！' }
          reject(errData)
        }
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 获取客户端域名
 * @desc 返回数据 data.appHost = 'https://app.wukonglicai.com/'
 * @returns {Promise<any>}
 */
export const getAppHost = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getAppHost',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 设置页面方法监听
 * @param {String} name 消息名/通知名/事件名
 * @param {Function} cb 收到监听触发消息后的执行方法
 */
export const addObserver = (name = '', cb) => {
  document.addEventListener(name, (res) => {
    let data = res.detail
    cb && cb(data)
  })
  jsBridge.invoke({
    method: 'addObserver',
    params: name
  })
}

/**
 * 向原生发送消息/通知addObserver
 * @param {String} name 消息名/通知名/事件名
 * @param {Object/String...} info 发送消息附带数据
 */
export const postNotificationName = (name = '', info = {}) => {
  jsBridge.invoke({
    method: 'postNotificationName',
    params: {
      name: name,
      info: info
    }
  })
}

/**
 * 使用默认浏览器打开页面 安卓
 * @param {String} link 链接
 */
export const loadUrlInBrowser = (link = '') => {
  jsBridge.invoke({
    method: 'loadUrlInBrowser',
    params: link
  })
}

/**
 * iOS 跳转到 appstore 对应app页面 默认 悟空理财
 * @param {String} url appstore地址
 */
export const toAPPStore = (url) => {
  jsBridge.invoke({
    method: 'toAPPStore',
    params: url
  })
}

/**
 * 打开微信app
 */
export const openWeChat = () => {
  jsBridge.invoke({
    method: 'openWeChat'
  })
}

/**
 * 分享
 * @param params 分享参数
 * @param {String} params.type 分享类型 （1链接/2图片/3链接+图片）
 * @param {String} params.shareText 分享标题文案
 * @param {String} params.shareContent 分享描述文案
 * @param {String} params.shareUrl 分享链接地址
 * @param {String} params.image 分享图片地址
 * @param {String} params.bigImageUrl 分享图片地址(只分享图片时-大图)
 * @returns {Promise<any>}
 */
export const share = (params = {}) => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'share',
      params: params,
      success: resolve,
      error: reject
    })
  })
}

/**
 * 获取地理位置
 * @returns {Promise<any>}
 */
export const location = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'location',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 人脸识别
 * @returns {Promise<any>}
 */
export const faceRecognition = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'faceRecognition',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 调起相机/相册
 * @returns {Promise<any>}
 */
export const awakenCamera = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'awakenCamera',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 图片上传
 * @returns {Promise<any>}
 */
export const upload = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'upload',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 保存图片
 * @param {String} link 图片地址
 * @returns {Promise<any>}
 */
export const saveImage = (link = '') => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'saveImage',
      params: link,
      success: resolve,
      error: reject
    })
  })
}

/**
 * 截取当前页面保存为图片
 * @returns {Promise<any>}
 */
export const saveHtmlPageImage = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'saveHtmlPageImage',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 扫描银行卡/扫描身份证
 * @returns {Promise<any>}
 */
export const scanBankCard = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'scanBankCard',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 复制文本
 * @param {String} text 文本
 * @returns {Promise<any>}
 */
export const copyText = (text = '') => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'copyText',
      params: text,
      success: resolve,
      error: reject
    })
  })
}

/**
 * 拨打电话
 * @param {String/Number} tel 电话号码
 */
export const call = (tel = '') => {
  jsBridge.invoke({
    method: 'call',
    params: tel
  })
}

// UI类
/**
 * 获取状态栏高度
 * @desc data.height 状态栏高度 px
 * @returns {Promise<any>}
 */
export const getStatusBarHeight = () => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'getStatusBarHeight',
      success: resolve,
      error: reject
    })
  })
}

/**
 * 设置title标题
 * @param {String/Number} title 标题
 */
export const setTitle = (title = '') => {
  jsBridge.invoke({
    method: 'setTitle',
    params: title
  })
}

/**
 * 设置标题栏右上角按钮文字
 * @param {String/Number} val 标题栏右上角按钮文字
 */
export const setRightItem = (val = '') => {
  jsBridge.invoke({
    method: 'setRightItem',
    params: val
  })
}

/**
 * 设置标题栏右上角按钮点击事件
 * @param {function} action 左上角返回按钮点击触发事件
 */
export const setRightItemAction = (action = () => {}) => {
  register({
    method: 'rightItemAction',
    callback: action
  })
}

/**
 * register注册完成事件后，执行本方法通知客户端更新注册事件信息
 */
export const updateBridge = () => {
  jsBridge.invoke({
    method: 'updateBridge'
  })
}

/**
 * 隐藏标题栏返回按钮
 */
export const hideBack = () => {
  jsBridge.invoke({
    method: 'hideBack'
  })
}

/**
 * 显示标题栏返回按钮
 */
export const showBack = () => {
  jsBridge.invoke({
    method: 'showBack'
  })
}

/**
 * 设置左上角返回按钮点击事件
 * @param {function} action 左上角返回按钮点击触发事件
 */
export const setLeftBackItemAction = (action = () => {}) => {
  register({
    method: 'leftBackItemAction',
    callback: action
  })
}

/**
 * 隐藏标题栏关闭按钮
 */
export const hideClose = () => {
  jsBridge.invoke({
    method: 'hideClose'
  })
}

/**
 * 显示标题栏关闭按钮
 */
export const showClose = () => {
  jsBridge.invoke({
    method: 'showClose'
  })
}

/**
 * 设置左上角关闭按钮点击事件
 * @param {function} action 左上角返回按钮点击触发事件
 */
export const setLeftCloseItemAction = (action = () => {}) => {
  register({
    method: 'leftCloseItemAction',
    callback: action
  })
}

/**
 * 设置标题颜色
 * @param {String} color 标题颜色 rgb #123456
 */
export const setTitleColor = (color = '') => {
  jsBridge.invoke({
    method: 'setTitleColor',
    params: color
  })
}

/**
 * 设置标题栏底色
 * @param {String} color 标题颜色 rgb #123456
 * @param {String/Number} alpha 颜色透明度 0-1
 */
export const setNavBgColor = (color = '', alpha = '1') => {
  jsBridge.invoke({
    method: 'setNavBgColor',
    params: {
      color: color,
      alpha: alpha
    }
  })
}

/**
 * 设置header返回/关闭按钮颜色
 * @param {String/Number} style 枚举 0-默认 红色，1-白色
 */
export const setNavBackBtnStyle = (style = '') => {
  jsBridge.invoke({
    method: 'setNavBackBtnStyle',
    params: style
  })
}

/**
 * 设置header右侧按钮颜色
 * @param {String} color 标题颜色 rgb #123456
 */
export const setRightItemColor = (color = '') => {
  jsBridge.invoke({
    method: 'setRightItemColor',
    params: color
  })
}

/**
 * 设置顶部状态栏文字颜色
 * @param {String/Number} val 状态栏文字颜色 0 黑色/1 白色
 */
export const setStatusBarStyleDefaultOrLight = (val = '0') => {
  jsBridge.invoke({
    method: 'setStatusBarStyleDefaultOrLight',
    params: val
  })
}

/**
 * 显示全屏公告
 * @param {String} param 公告内容-html字符串
 */
export const showFloatingView = (param = '') => {
  jsBridge.invoke({
    method: 'showFloatingView',
    params: param
  })
}

/**
 * 显示loading提示框
 * @param {String} message
 * @param {String} delay 延时自动关闭
 */
export const showLoadingWithStatus = ({ message = '', delay = '8' }) => {
  jsBridge.invoke({
    method: 'showLoadingWithStatus',
    params: {
      message,
      delay
    }
  })
}

/**
 * 关闭loading框
 */
export const hideLoading = () => {
  jsBridge.invoke({
    method: 'hideLoading'
  })
}

/**
 * 显示自动关闭的纯文字信息提示框
 * @param {String} params 信息提示框文案 / {Object} params 信息提示框参数
 * @param {String} params.type 信息提示类型 0纯文字/1成功/2失败/3信息
 * @param {String} params.message 信息提示框文案
 * @param {String} params.position 信息提示框位置 （仅适用于纯文字 type = 0）0中间/1下面
 */
export const toast = (params = {}) => {
  let obj = {
    type: params.type || '0',
    message: typeof params === 'string' ? params : (params.message || ''),
    position: params.position || '0'
  }

  jsBridge.invoke({
    method: 'toast',
    params: obj
  })
}

/**
 * 对话框 Confirm
 * @param {Object} params 对话框参数
 * @param {String} params.title 对话框标题
 * @param {String} params.message 对话框描述
 * @param {Array} params.actions 按钮文字
 * @desc then 点击确定/右侧按钮/唯一按钮; catch 点击取消/左侧按钮
 * @returns {Promise<any>}
 */
export const confirm = (params = {}) => {
  let actionLength = (params.actions && params.actions.length) || 0
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'confirm',
      params: params,
      success: (res) => { // res.action = 点击了第data.action个按钮
        if (parseFloat(res.action) + 1 >= actionLength) { // 点击确定/右侧按钮/唯一按钮
          resolve(res)
        } else { // 点击取消/左侧按钮
          reject(res)
        }
      }
    })
  })
}

/**
 * 弹出 ActionSheet
 * @param {Array} params 按钮文字
 * @param {Object} params[index] 按钮参数
 * @param {String} params.actions.label 标题
 * @param {String} params.actions.subLabel 副标题
 * @desc then(index) 点击列表元素 index为序号;catch 点击取消按钮
 * @returns {Promise<any>}
 */
export const actionSheet = (params = []) => {
  return new Promise((resolve, reject) => {
    jsBridge.invoke({
      method: 'actionSheet',
      params: {
        actions: params
      },
      success: (res) => { // 返回参数res.action 为序号0123, 取消为-1
        let index = parseInt(res.action)
        if (index >= 0) {
          resolve(index) // 按钮的序号
        } else {
          reject(index)
        }
      }
    })
  })
}

// 常用方法封装

/**
 * 跳转登录页面
 */
export const toLogin = () => {
  pushWindow('jfwklc://login?present=1', {
    type: 1
  })
}

/**
 * 跳转实名认证
 */
export const toRealName = () => {
  pushWindow('jfwklc://realName')
}

/**
 * 跳转4个tab
 * @param {String/Number} index
 * @enum index = 0 首页; index = 1 投资; index = 2 空粉; index = 3 我的账户
 * @param {String} investType 主类型tab值
 * @enum investType = M Q Y SB
 * @param {String} subInvestType 子类型tab值
 * @enum subInvestType "M", "Q3", "Q6", "Q9", "Y12", "Y24", "Y36", "Y48"
 */
export const toTabBar = (index = '0', investType = '', subInvestType = '') => {
  jsBridge.invoke({
    method: 'toTabBar',
    params: {
      index: index,
      investType: investType,
      subInvestType: subInvestType
    }
  })
}

export default jsBridge
