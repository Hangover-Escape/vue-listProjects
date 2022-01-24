// 自定义webview事件代理
(function (win, doc) {
  /**
   * fixed CustomEvent
   */
  var _customEvent = function () {
    if (typeof win.CustomEvent === 'undefined') {
      var CustomEvent = function (event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        }

        var evt = doc.createEvent('Events')
        var bubbles = true

        for (var name in params) {
          name === 'bubbles' ? (bubbles = !!params[name]) : (evt[name] = params[name])
        }
        evt.initEvent(event, bubbles, true)
        return evt
      }

      CustomEvent.prototype = win.Event.prototype
      // noinspection JSValidateTypes
      win.CustomEvent = CustomEvent
    }
  }

  // 执行
  _customEvent()

  /**
   * 接收触发自定义事件
   * @param eventType 事件类型
   * @param data 传递数据
   */
  var trigger = function (eventType, data) {
    if (eventType) {
      try {
        if (data && typeof data === 'string') {
          data = JSON.parse(data)
        }
      } catch (e) {}

      // 触发
      doc.dispatchEvent(
        new CustomEvent(eventType, {
          detail: data,
          bubbles: true, // 事件将冒泡到触发事件的元素的祖先
          cancelable: true // 可以使用事件对象的 stopPropagation() 方法取消事件传播
        })
      )
    }
  }

  // 暴露
  win.TriggerBridgeEvent = trigger
})(window, document)
