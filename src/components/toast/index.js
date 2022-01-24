import Vue from 'vue'
import ToastComponent from './toast.vue'

const toastPool = []
const ToastConstructor = Vue.extend(ToastComponent)

let defaults = {
  message: '',
  duration: 2000,
  type: 'info'
}

const getAnInstance = () => {
  if (toastPool.length > 0) {
    return toastPool.shift()
  }
  return new ToastConstructor({
    el: document.createElement('div')
  })
}

const returnAnInstance = instance => {
  if (instance) {
    toastPool.push(instance)
  }
}

const removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target)
  }
}

ToastConstructor.prototype.close = function () {
  this.show = false
  this.$el.addEventListener('transitionend', removeDom)
  this.closed = true
  returnAnInstance(this)
}
/**
 * @param {object|string} options
 * @param {string} [options.message] - 提示文字
 * @param {string} [options.position] - 位置，top、middle、bottom
 * @param {string} [options.duration] - 多少时间消失
 * @param {string} [options.type] - 自定义显示icon，success、fail、info
 * @example
 *
 * Toast({
 *  message: '操作成功',
 *  type: 'success',
 *  duration: 2000
 * })
 */
const Toast = (options = {}) => {
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  let instance = getAnInstance()

  let opts = Object.assign({}, defaults, options)
  for (let prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      instance[prop] = opts[prop]
    }
  }

  instance.closed = false
  clearTimeout(instance.timer)

  document.body.appendChild(instance.$el)

  Vue.nextTick(function () {
    instance.show = true
    instance.$el.removeEventListener('transitionend', removeDom)

    let duration = opts.duration
    ~duration && (instance.timer = setTimeout(function () {
      if (instance.closed) return
      instance.close()
    }, duration))
  })
  return instance
}

export default Toast
