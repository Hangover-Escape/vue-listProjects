export class JsBridge {
  constructor () {
    this.init()
    window.WebViewBridgeRegisterQueue = []
  }

  // 是否开启调试
  debug = false

  // 是否初始化中
  doReadying = true

  // bridge 对象
  bridge = null

  // 回调队列
  queue = []

  // 注册队列
  registerQueue = {}

  /**
   * 初始化
   */
  init = () => {
    const self = this

    const callback = bridge => {
      // 兼容老代码，新的使用invoke,封装了一层，解析和调试用
      bridge.callNative = (method, params = {}, cb) => {
        if (method === '') {
          self.debugInfo('Method name cannot be empty')
          return false
        }

        bridge.callHandler(method, params, response => {
          if (typeof response === 'string' && response.indexOf('{') !== -1) {
            try {
              response = JSON.parse(response)
            } catch (e) {
              cb && cb(e)
              self.debugInfo('can not parse data from App')
            }
          }
          cb && cb(response)
          self.debugInfo(`method: ${method}; request:${JSON.stringify(params)}; response:${JSON.stringify(response)}`)
        })
      }

      // 初始化完成;
      self.doReadying = false
      self.bridge = bridge

      // bridge未初始化完成之前的调用方法执行;
      for (let i = 0; i < self.queue.length; i++) {
        let cb = self.queue[i]
        cb(bridge)
      }
    }

    if (window.WebViewJavascriptBridge) {
      callback(window.WebViewJavascriptBridge)
      this.debugInfo('bridge ready success!')
      return
    }

    // Android注册一个监听事件，等bridge初始化成功之后执行
    document.addEventListener('WebViewJavascriptBridgeReady', () => {
      callback(window.WebViewJavascriptBridge)
      this.debugInfo('bridge ready success!')
    }, false)

    // IOS先到WVJBCallbacks,如果bridge初始化成功之后再取出并执行
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }

    window.WVJBCallbacks = [callback]
    let WVJBIframe = document.createElement('iframe')

    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'

    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => { document.documentElement.removeChild(WVJBIframe) }, 0)

    return this
  }

  /**
   * bridge 准备完成
   * @param callback
   */
  ready = callback => {
    if (this.doReadying) { // 正在初始化，放到队列中
      this.queue.push(callback)
    } else { // 初始化完成，直接调用
      callback(this.bridge)
    }
  }

  /**
   * 调用App方法
   * @param options
   * @param options.method 调用app 方法
   * @param options.params 传递业务参数
   * @param options.success 成功回调
   * @param options.error 错误回调
   */
  invoke = options => {
    const self = this

    self.ready(bridge => {
      const { method, params = {}, success = () => {}, error = () => {} } = options

      let newParams = typeof params !== 'string' ? JSON.stringify(params) : params
      if (!bridge) {
        return error('bridge is not exist')
      }

      bridge.callNative(method, newParams, (res) => {
        if (res && res.code === '000000') {
          success(res.data || {})
        } else {
          error(res)
        }
      })
      self.debugInfo(`正在调用APP的方法:${method}`)
    })
  }

  /**
   * 注册方法给App调用
   * @param options
   * @param options.method 注册供app方法名称
   * @param options.callback 回调
   */
  register = options => {
    const self = this
    const { method, callback } = options

    if (method === '') {
      self.debugInfo(`注册方法不能为空`)
      return false
    }

    if (window.WebViewBridgeRegisterQueue.indexOf(method) === -1) {
      window.WebViewBridgeRegisterQueue.push(method)
    }

    this.registerQueue[method] = callback

    this.ready(function (bridge) {
      if (!bridge) {
        self.debugInfo('jsBridge 没有被注册')
        return
      }

      bridge.registerHandler(method, () => {
        let args = [].slice.call(arguments)
        if (args[0] && typeof args[0] === 'string') {
          try {
            args[0] = JSON.parse(args[0])
          } catch (e) {
            console.error(e)
          }
        }
        self.registerQueue[method] && self.registerQueue[method].apply(args)

        self.debugInfo(`APP调用H5方法: ${method}`)
      })
    })
  }

  /**
   * 调试打印信息
   * @param message
   */
  debugInfo = message => {
    this.debug && window.alert(message)
  }
}
