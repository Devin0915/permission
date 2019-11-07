import axios from '@/libs/api.request'
import JSON from 'JSON'

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
      url: '/api/permission/getUserHtmlIds',
      data: data,
      method: 'post'
    })
  }