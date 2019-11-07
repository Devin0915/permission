import axios from 'axios'
import store from '@/store'
import router from '@/router'
// import app from '../main.js'
import {delToken} from '@/libs/util'
import {Modal} from 'iview'
import { Store } from 'vuex'
import user from '../store/module/user'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  // if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    var  userToken = "";
    if(store.state.user && store.state.user.token){
      userToken = "Bearer " + JSON.parse(store.state.user.token).authToken
    }
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
        'Authorization' : userToken,
        'Content-Type': 'application/json'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      let conforeUrl = '/login'
      if(errorInfo){
        if(errorInfo.status==401){
          delToken()
          router.push({path: conforeUrl})
        }else{
          Modal.warning({
            title: errorInfo.data.error.message,
          })
        }
      }else{
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
              statusText,
              status,
              request: { responseURL: config.url }
            }
      }
      // if(errorInfo.status == 401){
      //   delToken()
      //   router.push({path: conforeUrl})
      // }else if(!errorInfo) {
      //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
      //   Modal.confirm({
      //     title: errorInfo.data.error.message,
      //   })
      //   errorInfo = {
      //     statusText,
      //     status,
      //     request: { responseURL: config.url }
      //   }
      // }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
