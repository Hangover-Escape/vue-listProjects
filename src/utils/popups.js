import { toast as _toast, messageBox as _messageBox, loading as _loading } from '../components'
// import { showDelayTip, showConfirm, setLoading, isQBApp, isWKNewApp } from './app'
/**
 * 根据环境，调用原生或者H5的messageBox
 * @param {object|string} options
 * @param {string}  [options.title] - 标题
 * @param {string}  [options.imgUrl] - 标题图片
 * @param {number}  [options.imgHeight] - 标题图片高度 rem
 * @param {string}  [options.message] - 消息
 * @param {string[]|object[]} [options.buttons] - 按钮
 * @param {string}  [options[].buttons.label] - 按钮文字
 * @param {boolean} [options[].buttons.emphasize] - 文字加重显示
 * @param {string}  [options[].buttons.cssClass] - 按钮样式覆盖
 * @param {string}  [options.align] - 按钮横竖排布 默认横向 row/column
 * @param {boolean} [options.forceUseH5] true-不区分环境，强制使用H5实现的弹窗
 * @returns {Promise<any>}
 */
export function messageBox (options = {}) {
  const forceUseH5 = options.hasOwnProperty('forceUseH5') && options.forceUseH5
  return (isQBApp || isWKNewApp) && !forceUseH5 ? showConfirm(options) : _messageBox(options)
}

/**
 * 根据环境，调用原生或者H5的toast
 * @param {object|string} options
 * @param {string} [options.message] - 提示文字
 * @param {string} [options.position] - 位置，top、middle、bottom
 * @param {string} [options.duration] - 多少时间消失
 * @param {string} [options.type] - 自定义显示icon，success、fail、info
 */
export function toast (options = {}) {
  options.position = options.position || 'middle'
  return (isQBApp || isWKNewApp) ? showDelayTip(options) : _toast(options)
}

/**
 * 根据环境，调用原生或者H5的loading
 * @param {boolean} show 是否显示
 * @param {string} message 提示语
 */
export function loading (show, message = '加载中...') {
  return (isQBApp || isWKNewApp) ? setLoading(show, message) : _loading(show, message)
}

/**
 * 根据环境，调用原生或者H5的 success toast
 * @param {object|string} options
 * @param {string} [options.message] - 提示文字
 * @param {string} [options.position] - 位置，top、middle、bottom
 * @param {string} [options.duration] - 多少时间消失
 */
export function success (options) {
  options.type = 'success'
  return toast(options)
}

/**
 * 根据环境，调用原生或者H5的 fail toast
 * @param {object|string} options
 * @param {string} [options.message] - 提示文字
 * @param {string} [options.position] - 位置，top、middle、bottom
 * @param {string} [options.duration] - 多少时间消失
 */
export function error (options) {
  options.type = 'fail'
  return toast(options)
}

function install (Vue) {
  Vue.prototype.$messageBox = messageBox
  Vue.prototype.$toast = toast
  Vue.prototype.$loading = loading
  Vue.prototype.$success = success
  Vue.prototype.$error = error
}

export default { install }
