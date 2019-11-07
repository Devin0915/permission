import axios from '@/libs/api.request'
import JSON from 'JSON'

let Six = ''

if (process.env.NODE_ENV === 'production') {
  Six = '/api'
} else {
  // sylarApi = "http://172.16.6.92:8008/api"
  // Dev_guo = 'http://172.16.6.92:8022/api'
  // Dev_Jason = 'http://172.16.6.92:8050/api'
  // Yii = 'http://172.16.6.92:8005/api'
Six='http://172.16.6.92/api'
}
export const getUserHtmlIds = (params) => {
    const reqData = {
      'id': 1, 'jsonrpc': '2.0', 'method': ''
    }
    const paramsData = {
      'params': params
    }
    Object.assign(reqData, paramsData)
    const data =  JSON.stringify(reqData)
    return axios.request({
      url: Six + '/permission/getUserHtmlIds',
      data: data,
      method: 'post'
    })
  }