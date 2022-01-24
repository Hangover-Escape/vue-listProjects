import Vue from 'vue'
import messageBoxComponent from './message-box.vue'

let defaults = {
  title: '',
  imgUrl: '',
  imgHeight: '0.9',
  message: '',
  buttons: ['我知道了'],
  align: 'row'
}

let instance
let MessageBoxConstructor = Vue.extend(messageBoxComponent)

/**
 * 弹出框
 * @param {object|string} options
 * @param {string}  [options.title] - 标题
 * @param {string}  [options.imgUrl] - 标题图片
 * @param {number}  [options.imgHeight] - 标题图片高度 rem
 * @param {string}  [options.message] - 消息
 * @param {string[]|object[]} [options.buttons] - 按钮
 * @param {string}  [options.buttons.label] - 按钮文字
 * @param {boolean} [options.buttons.emphasize] - 文字加重显示
 * @param {string}  [options.buttons.cssClass] - 按钮样式覆盖
 * @param {string}  [options.align] - 按钮横竖排布 默认横向 row/column
 * @returns {Promise<any>} resolve(index) index 为按钮的序号
 *
 * @example
 * MessageBox({
 *  title: '温馨提示',
 *  message: '提示内容',
 *  buttons: [
 *      {
 *          label: '确定',
 *          emphasize: true
 *      },
 *      {
 *          label: '取消',
 *          cssClass: 'cancelBtnClass'
 *      },
 *      '直接文字按钮'
 *  ]
 * })
 */

export default function (options = {}) {
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  if (!instance) {
    instance = new MessageBoxConstructor({
      el: document.createElement('div')
    })
  }

  let opts = Object.assign({}, defaults, options)

  for (let prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      instance[prop] = opts[prop]
    }
  }
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.show = true
  })

  return new Promise(resolve => {
    instance.$on('onClickBtn', btnIndex => {
      instance.show = false
      resolve(btnIndex)
    })
  })
}
