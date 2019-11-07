import axios from '@/libs/api.request'
import qs from 'qs'
const reqData = {
  'id': 1, 'jsonrpc': '2.0', 'method': ''
}
let Dev_guo = 'http://172.16.6.92:8022'

// let Dev_guo = ''
export const getRoleList = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/lists',
    data: testData,
    method: 'post'
  })
}

export const getDepartments = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: '/rpc/enum/getDepartments',
    data: testData,
    method: 'post'
  })
}
export const getRoleView = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/view',
    data: testData,
    method: 'post'
  })
}

export const roleModify = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/modify',
    data: testData,
    method: 'post'
  })
}

export const roleAdd = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/add',
    data: testData,
    method: 'post'
  })
}

export const getListUse = reqData => {
  const testData = qs.stringify(reqData)
  console.log('getListUse')
  return axios.request({
    url: Dev_guo + '/role/listsUser',
    data: testData,
    method: 'post'
  })
}

export const modifyUser = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/modifyUser',
    data: testData,
    method: 'post'
  })
}

export const getListsAction = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/listsAction',
    // url: Dev_guo + '/role/ActionLists',
    data: testData,
    method: 'post'
  })
}

// /role/modifyAction

export const modifyAction = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/modifyAction',
    data: testData,
    method: 'post'
  })
}

// 获取data 数据 的信息
let Yii = 'http://172.16.6.92:8005'
export const getDataPermission = reqData => {
  const testData = qs.stringify(reqData)
  return axios.request({
    url: Yii + '/resource/getDataPermission',
    data: testData,
    method: 'post'
  })
}
