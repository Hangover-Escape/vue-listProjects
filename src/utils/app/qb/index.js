
/**
 * 获取用户信息
 * [悟空] plususer里内容包括
 * mobile, id ,uuid, uid ,idCardNo(身份证),realName , inviteCode 邀请码， growIoUserId，isReal 是否实名
 *
 * 【新版悟空】
 *
 * 【钱包】 用户信息里的内容
 * 参数  类型  说明
 * invitationCode String 邀请码
 * memberId String 用户ID
 * token String 登陆凭证
 * mobile String 手机号
 * isReal Boolean 是否实名
 * headPortraitCode String 用户选择的头像编号
 * idCardNo String 用户实名认证证件号
 * realName String 用户真实姓名
 * riskReault Number 风险测评等级
 * encryptMemberId String GrowingIO 需要的编码后的用户ID Android 3.0.6新增 IOS暂无
 * deviceId String GrowingIO 需要的deviceId
 * sessionId Number GrowingIO 需要的sessionId
 * deviceModel String 设备型号
 * OSVersion String 系统版本
 * platform String 操作系统类型
 * */
export const runInApp = async (Vue, callback) => {
  try {
      document.addEventListener('deviceready', function () {
        Promise.all([getAppUserInfo(), getAppVersion()])
        .then(([userinfo, appversion]) => {
          // eslint-disable-next-line standard/no-callback-literal
          callback({ ...userinfo, ...appversion })
        })
      })
  } catch (e) {
    console.log(e, '[获取APP信息失败]')
    // eslint-disable-next-line standard/no-callback-literal
    callback({})
  }
}

  /**
   * 获取登录用户信息
   * @returns {Promise<object>} userInfo
   */
  export const getAppUserInfo = () => {
    return new Promise(resolve => {
      if (window.Tool) {
        Tool.getAPPUserInfo(resolve)
      } else {
        console.log('[APP] Tool.getAPPUserInfo')
        resolve({})
      }
    })
  }

/**
 * 获取app版本号
 * @returns {Promise}
 */
export const getAppVersion = () => {
  return new Promise((resolve) => {
    window.onGetAppVersion = (versionName) => {
      resolve({
        versionCode: +versionName.replace(/\./g, ''),
        versionName
      })
    }
    try {
      Tool.getCurrentVersion(window.onGetAppVersion)
    } catch (e) {
      console.log(e.message)
      return ''
    }
  })
}
/**
 * 登录
 * @returns {Promise<any>}
 */
export const toLogin = () => {
return new Promise((resolve, reject) => {
    if (window.jiuFuWallet) {
    jiuFuWallet.login(resolve, reject)
    } else {
    // 引导唤起 app
    // lunchApp()
    console.log('[APP] jiuFuWallet.login')
    }
})
}

  /**
   * 实名认证
   * @returns {Promise<any>}
   */
  export const realName = () => {
    return new Promise((resolve, reject) => {
      if (window.jiuFuWallet) {
        jiuFuWallet.realNameVerification(resolve, reject)
      } else {
        console.log('[APP] jiuFuWallet.realName')
      }
    })
  }

  /**
   * 设置title
   * @param {string} title
   */
  export const setTitle = title => {
    document.title = title
    if (window.Navigation) {
      Navigation.setTitle(title)
    } else {
      console.log('[APP] Navigation.setTitle')
    }
  }

  /**
   * 设置app标题栏 右侧按钮文字和动作
   * @param {string} label 按钮文字
   * @param {string} callbackStr 动作方法调用字符串，如：'window.callback()'
   */
  export const setHeaderRightBtn = ({ label = '按钮', callbackStr = '' }) => {
    if (window.Navigation) {
      Navigation.setRightItemTitle(label)
      Navigation.setRightItemAction(callbackStr)
    } else {
      console.log('[APP] Navigation.setRightItemTitle')
      console.log('[APP] Navigation.setRightItemAction')
    }
  }

  /**
   * 打开新的窗口
   * @param {string} url
   * @example
   * pushWindow(app.misc.publicNotice)
   */
  export const pushWebView = url => {
    if (window.Navigation) {
      Navigation.pushWindow(url)
    } else {
      window.location.href = url
      // console.log('[APP] pushWindow ' + url)
      // if (!/^jfwallet/.test(url)) {
      //   window.open(url)
      // }
    }
  }

/**
 * 钱包跳转到 app 首页
 */
export const toHome = () => {
    try {
      Navigation.pushWindow('jfwallet://JFHomeViewModelProtocol?selectedIndex=0')
    } catch (e) {
      console.log(e.message)
    }
}

/**
 * 【钱包】跳转到投资页面
 */
export const toInvest = () => {
    try {
      Navigation.pushWindow('jfwallet://JFHomeViewModelProtocol?selectedIndex=1')
    } catch (e) {
      console.log(e.message)
    }
}

/**
 * 跳转到【钱包】我的页面
 */
export const toMine = () => {
    try {
      Navigation.pushWindow('jfwallet://JFHomeViewModelProtocol?selectedIndex=3')
    } catch (e) {
      console.log(e.message)
    }
}

/**
 * 【钱包】去生活
 */
export const toMemberClub = () => {
    try {
      Navigation.pushWindow('jfwallet://JFHomeViewModelProtocol?selectedIndex=2')
    } catch (e) {
      console.log(e.message)
    }
}

/**
 * 【钱包】去订单列表页
 */
export const toOrders = () => {
  try {
    Navigation.pushWindow('jfwallet://JFRNViewModelProtocol?component=com.9fbank.continuedOrderList')
  } catch (e) {
    console.log(e.message)
  }
}

/**
 * 钱包跳转到卡券
 */
export const toCoupon = (token) => {
    try {
      Navigation.pushWindow('jfwallet://JFCardAndCouponViewModelProtocol')
    } catch (e) {
      console.log('[APP 卡券页面]')
      console.log(e.message)
    }
}

/**
 * 精选标产品详情
 * @param options
 *
 */
export const toProductDetail = (options) => {
  try {
    Navigation.pushWindow(`jfwallet://JFTransferProductDetailViewModelProtocol?productType=${options.productType}&productId=${options.productId}&productCode=${options.productCode}`)
  } catch (e) {
    console.log('[APP 产品详情页面]')
    console.log(e.message)
  }
}
/**
 * 关闭当前webview页面
 * @param {String/Number} zIndex 关闭的层级
 */
export const closeWebView = (zIndex) => {
  try {
      Navigation.popWindow()
  } catch (e) {
    window.close()
    window.history.go(-1)
    console.log(e.message)
  }
}

/**
 * 显示对话框 一个或两个按钮
 * @param {object|string} options
 * @param {string} [options.title] - 标题
 * @param {string} [options.message] - 消息
 * @param {array<object|string>} [options.buttons] - 按钮
 * @returns {Promise<any>}
 * { title = '', message = '', buttons = ['我知道了'] }
 */
export const showConfirm = (options = {}) => {
  const defaults = {
    title: '',
    message: '',
    buttons: ['我知道了']
  }
  if (typeof options === 'string') {
    options = { message: options }
  }
  const opts = Object.assign({}, defaults, options)
  return new Promise(resolve => {
    const onClickBtn = btnIndex => {
      resolve(btnIndex - 1)
    } // 原生的弹窗按钮序号从1开始
    if (window.navigator) {
      navigator.notification.confirm(opts.message, onClickBtn, opts.title, opts.buttons)
    } else {
      console.log('[APP] navigator.notification.confirm')
    }
  })
}
/**
 * 钱包设置Loading框显示隐藏
 * @param {boolean} show 是否显示
 * @param {string} message 提示文案
 */
export const setLoading = (show, message = '加载中...') => {
  if (window.Context) {
    if (show) {
      Context.showLoadingWithStatus(message)
    } else {
      Context.hideLoading()
    }
  } else {
    if (show) {
      console.log('[APP] Context.showLoadingWithStatus')
    } else {
      console.log('[APP] Context.hideLoading')
    }
  }
}

  /**
   * 在浏览器中打开页面
   * @param {string} path url
   */
  export const openUrlInBrowser = (url) => {
    if (window.Context) {
      Context.openUrlByNativeBrowser(url)
    } else {
      window.open(url)
    }
  }

  /**
   * 关闭所有窗口
   */
  export const closeToRoot = () => {
    if (window.Navigation) {
      Navigation.popToRoot()
    } else {
      console.log('[APP] Navigation.popToRoot')
      window.close()
    }
  }
  /**
   * 执行上级页面方法
   * @param {string} statement
   */
  export const callbackExecute = statement => {
    if (window.Navigation) {
      Navigation.callbackExecute(statement)
    } else {
      console.log('[APP] Navigation.callbackExecute')
      window.opener.eval(statement)
    }
  }

  /**
   * 显示提示
   * @param {string|object} options
   * @param {string} [options.message] - 消息
   * @param {string} [options.type] - 提示类型：success/fail/info
   */
  export const showDelayTip = options => {
    const defaults = {
      message: '',
      type: 'info'
    }
    if (typeof options === 'string') {
      options = { message: options }
    }
    const opts = Object.assign({}, defaults, options)
    if (window.Context) {
      if (opts.type === 'success') {
        Context.showDelaySuccessTip(opts.message)
      } else if (opts.type === 'fail') {
        Context.showDelayErrorTip(opts.message)
      } else {
        Context.showDelayInfoTip(opts.message)
      }
    } else {
      if (opts.type === 'success') {
        console.log('[APP] Context.showDelaySuccessTip')
      } else if (opts.type === 'fail') {
        console.log('[APP] Context.showDelayErrorTip')
      } else {
        console.log('[APP] Context.showDelayInfoTip')
      }
    }
  }

  /**
   * 设置状态栏颜色
   * @param {number|string|boolean} status 为false/0/black: 黑色状态栏 true/1/white: 白色状态栏
   */
  export const setStatusBarStyle = status => {
    if (typeof status === 'string') {
      switch (status) {
        case 'black':
          status = 0
          break
        case 'white':
          status = 1
          break
      }
    }
    console.log('status', typeof status === 'boolean')
    if (typeof status === 'boolean') {
      status = status ? 1 : 0
    }
    if (window.Context) {
      console.log('status', status)
      Context.setStatusBarStyleDefaultOrLight(status)

      // 切换当前webview修改NativeBar文字颜色
      document.addEventListener('viewResume', () => {
        Context.setStatusBarStyleDefaultOrLight(status)
      })
    } else {
      console.log('[APP] Context.setStatusBarStyleDefaultOrLight')
    }
  }

  /**
   * H5保存信息
   * @param key
   * @param value
   * @returns {Promise<any>} 成功resolve(0) 失败rejectcode：10001：key为空字符串 10003-key类型错误
   */
  export const setH5Data = (key, value) => {
    return new Promise((resolve, reject) => {
      if (window.Tool) {
      Tool.setH5Data(key, value, resolve, reject)
      } else {
        console.log('[APP] Tool.setH5Data')
        window.localStorage.setItem(key, value)
        return ''
      }
    })
  }

  /**
   * H5获取已存信息
   * @param key
   * @returns {Promise<any>} 取值成功resolve， 失败reject code：10001-key为空字符串 10002-没有对应的key 10003-key 类型错误
   */
  export const getH5Data = key => {
    return new Promise((resolve, reject) => {
      if (window.Tool) {
      Tool.getH5Data(key, resolve, reject)
      } else {
        console.log('[APP] Tool.getH5Data')
        resolve(window.localStorage.getItem(key))
        return ''
      }
    })
  }

  /**
   * android 返回按钮和原生头部返回按钮关闭所有
   * @param {*} callback
   */
  export const closeAllWindow = (callback) => {
    if (window.Navigation) {
      Navigation.setLeftItemAction('Navigation.popToRoot()')
      document.addEventListener('backbutton', Navigation.popToRoot)
      if (callback && typeof callback === 'function') {
        callback()
      }
    } else {
      console.log('[APP] closeAllWindow')
    }
  }

  /**
   * 引导到app里打开页面
   * @param {String} url  要打开的链接
   */
  // export const lunchApp = (url) => {
  //   let targeturl = url || window.location.href
  //   targeturl = window.encodeURIComponent(targeturl)
  //   window.location.href = `${h5.commonPage.lunchApp}?open=${targeturl}`
  // }

  /**
   * 调用原生分享方法
   * @param options 分享参数信息
   */
  export const appShare = (options) => {
    try {
      jiuFuWallet.share(JSON.stringify(options), () => {
        // toast('分享成功')
      }, (code) => {
        let error = null
        switch (code) {
          case 0:
            error = '分享失败：发生异常'
            break
          case 1:
            error = '分享失败：用户放弃'
            break
          default:
            error = '分享失败，未传失败Code！'
        }
        console.log(error)
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  /**
 * 分享图片
 */
export const shareImg = ({ imageUrl }) => {
  if (!imageUrl) {
    console.log('[分享图片不能为空]')
    return false
  }
    const shareOptions = {
      type: 2,
      shareUrl: '',
      shareText: '',
      shareContent: '',
      image: '',
      bigImageUrl: imageUrl,
      platform: 1
    }
    appShare(shareOptions)
}

  export const setRightBtn = (data) => {
    try {
      Navigation.setRightItemTitle(data.rightBtn)
      // 设置右边关闭按钮动作
      Navigation.setRightItemAction(data.callbackName)
    } catch (e) {
      console.log(e.message)
    }
  }
