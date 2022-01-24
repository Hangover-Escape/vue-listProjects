import axios from 'axios'
import { stringify } from 'qs'
import store from '../store'
import { messageBox, toast, loading } from '@/utils/popups'
import { isWKApp, isQBApp } from '@/utils/app'

// axios 配置
// 超时时间
axios.defaults.timeout = 8000
// 默认 post 通过表单提交
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
let channel = isWKApp ? 'QB' : (isQBApp ? 'QB' : 'QB')
// const channel = isWKApp ? 'WK' : (isQBApp ? 'QB' : 'WX')
// if (window.__wxjs_environment === 'miniprogram') {
//   channel = 'SP'
// }
// 应用请求参数模板，适用于post请求
function applyChannelTemplate (data = {}) {
  const template = {
    channel: channel,
    ...data
  }
  return template
}

function applyUserDataTemplate (data = {}) {
  const userInfo = store.state.baseInfo
  const template = {
    token: userInfo.token,
    memberId: userInfo.memberId,
    ...data
  }
  return template
}

/**
 * 基于axios的请求方法封装
 * 默认: 使用POST请求方式、套用参数模板格式、统一拦截处理异常code
 *
 * @param {string} url 接口
 * @param {object} options 配置
 * @param {string} [options.method] - 请求方式，默认post
 * @param {object} [options.params] - 请求params参数
 * @param {object} [options.data] - 请求data参数
 * @param {object} [options.headers] - 请求头配置
 * @param {object} [options.responseType] - 请求返回数据的格式
 * @param {boolean} [options.useDataTemplate] - 套用请求参数模板
 * @param {object|string} [options.codeHandle] - 异常code码拦截配置: 'skip'-全部不统一拦截处理，'silent'-全部静默无需处理，对象格式配置见下方example
 * @param {boolean} [options.showLoading] - 自动显示loading，true-显示[默认]，false-不显示
 *
 * @returns {Promise<any>}
 *
 * @example
 * request('/data/api/path', {
  *   data: {},
  *   useDataTemplate: false,
  *   codeHandle: {
  *       8801: 'messageBox', // 使用messageBox提示
  *       8802: 'skip',       // 不拦截处理8802
  *       2023: 'silent'      // 静默无需处理
  *   }
  * })
  */
function request (url, options = {}) {
  let {
    method = 'POST',
    useDataTemplate = true,
    useUserTemplate = true,
    codeHandle = {},
    showLoading = true,
    headers = false
  } = options
  // 没有特殊配置，则自动显示加载中loading
  if (showLoading) {
    loading(true)
  }
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: method,
      responseType: options.responseType || 'json',
      data: options.data,
      transformRequest: [
        data => (useDataTemplate ? applyChannelTemplate(data) : data), // 应用请求参数模板
        data => (useUserTemplate ? applyUserDataTemplate(data) : data), // 应用请求参数模板
        data => (headers ? JSON.stringify(data) : stringify(data)) // 无自定义头部，
      ]
    })
      .then(response => {
        const code = response.data.code

        /**
          * 自动隐藏loading规则
          * 配置项codeHandle里，设置为允许通过的异常code，则不自动隐藏，交由业务场景控制
          */
        const isSkippedCode = codeHandle === 'skip' || codeHandle[code] === 'skip'
        if (!isSkippedCode || code === 2000) {
          loading(false)
        }

        if (code === 2000) {
          /**
            * 请求正常
            */
          if (response.data.data || response.data.data === null) {
            resolve(response.data)
          } else {
            toast({ type: 'fail', message: '数据异常请稍后再试！' })
          }
        } else if (codeHandle === 'skip') {
          /**
              * 允许所有异常code通过:
              * codeHandle: 'skip'
              */
          reject(response.data)
          loading(false)
        } else if (codeHandle === 'silent') {
          /**
              * 所有异常code静默:
              * codeHandle: 'silent'
              */
          console.log(`[request] 已配置所有异常code静默 ${code}: ${response.data.message}`)
          return false
        } else if (~Object.keys(codeHandle).indexOf(code.toString())) {
          if (codeHandle[code] === 'messageBox') {
            messageBox(response.data.message).finally()
          } else if (codeHandle[code] === 'skip') {
            reject(response.data)
          } else if (codeHandle[code] === 'silent') {
            console.log(`[request] 已配置当前code静默 ${code}: ${response.data.message}`)
            return false
          }
        } else {
          /**
              * 通用异常处理方式：toast提示
              */
          toast({ type: 'fail', message: response.data.message })
          reject(response.data)
        }
      })
      .catch(error => {
        console.log(error)
        loading(false)
        if (codeHandle === 'skip') {
          /**
              * 允许所有异常code通过:
              * codeHandle: 'skip'
              */
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ code: '503', message: '网络异常请稍后再试！' })
        } else {
          toast({
            type: 'fail',
            message: (error.response && error.response.status === 404) ? '服务异常请稍后再试！' : '网络异常请稍后再试！'
          })
        }
      })
  })
}

/**
  * https://github.com/scopsy/await-to-js
  * 包装请求请求promise返回数据的格式：[正常数据，异常数据]
  * 适用于async/await形式的写法，可以避免使用try catch处理异常返回的数据
  * @param promise
  * @returns {Q.Promise<*[]>}
  */
const to = (promise) => {
  return promise
    .then(data => {
      return [data, null]
    })
    .catch(err => [undefined, err])
}

/**
  * Post请求
  * 返回数据格式经过to方法处理
  */
function fetch (url, options = {}) {
  return to(request(url, options))
}

/**
  * Get请求
  * 返回数据格式经过to方法处理
  */
function fetchGet (url, params, options = {}) {
  // eslint-disable-next-line no-debugger
  options.method = 'GET'
  options.params = params
  return to(request(url, options))
}

/**
  * Post请求
  * 返回数据格式经过to方法处理
  */
function fetchPost (url, data, options = {}) {
  options.method = 'POST'
  options.data = data
  return to(request(url, options))
}

/**
  * Post请求
  * 适用于Promise().then().catch()形式的写法、以及用于Promise.all()
  */
function rawFetch (url, options = {}) {
  return request(url, options)
}

/**
  * Get请求
  * 适用于Promise().then().catch()形式的写法、以及用于Promise.all()
  */
function rawFetchGet (url, params, options = {}) {
  options.method = 'GET'
  options.params = params
  return request(url, options)
}

/**
  * Post请求
  * 适用于Promise().then().catch()形式的写法、以及用于Promise.all()
  */
function rawFetchPost (url, data, options = {}) {
  options.method = 'POST'
  options.data = data
  return request(url, options)
}

function install (Vue) {
  Vue.prototype.$fetch = fetch
  Vue.prototype.$fetchGet = fetchGet
  Vue.prototype.$fetchPost = fetchPost

  Vue.prototype.$rawFetch = rawFetch
  Vue.prototype.$rawFetchGet = rawFetchGet
  Vue.prototype.$rawFetchPost = rawFetchPost
}
export { fetch, fetchGet, fetchPost }
export default { install }
