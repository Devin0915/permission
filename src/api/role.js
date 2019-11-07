import axios from '@/libs/api.request'
import qs from 'qs'
import JSON from 'JSON'



function toReqData(paramsData){
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  Object.assign(reqData, paramsData)
  const data = JSON.stringify(reqData)
  return data;
}
let Dev_guo = ''
let syly = ''
let Yii = ''

if (process.env.NODE_ENV === 'production') {
  Dev_guo = '/api'
  syly = '/api'
  Yii = '/api'
} else {
  // http://172.16.6.92:9002
  //  Dev_guo = 'http://172.16.6.92:8022/api'
  //  Yii = 'http://172.16.6.92:8005/api'
  //  syly = 'http://172.16.6.92:8008/api'
  Dev_guo = Yii = syly ='http://172.16.6.92/api'
}

export const getRoleList = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/lists',
    data: testData,
    method: 'post'
  })
}

export const getDepartments = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: syly + '/dictionary/getDepartments',
    data: testData,
    method: 'post'
  })
}
export const getRoleView = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/view',
    data: testData,
    method: 'post'
  })
}

export const roleModify = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/modify',
    data: testData,
    method: 'post'
  })
}

export const roleAdd = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/add',
    data: testData,
    method: 'post'
  })
}

export const getListUse = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/listsUser',
    data: testData,
    method: 'post'
  })
}

export const modifyUser = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/modifyUser',
    data: testData,
    method: 'post'
  })
}

export const getListsAction = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/listsAction',
    data: testData,
    method: 'post'
  })
}

// /role/modifyAction

export const modifyAction = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/modifyAction',
    data: testData,
    method: 'post'
  })
}

// 获取data 数据 的信息

export const getDataPermission = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    // url: Yii + '/resource/getDataPermission',
    url: Yii + '/resource/getCuruserDataPmTree',
    data: testData,
    method: 'post'
  })
}

// 
// 获取data 数据 的信息
export const viewDataPermission = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Yii + '/role/viewDataPermission',
    data: testData,
    method: 'post'
  })
}

export const modifyDataPermission = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Yii + '/role/modifyDataPermission',
    data: testData,
    method: 'post'
  })
}

export const destroyRole = reqData => {
  const testData = toReqData(reqData);
  return axios.request({
    url: Dev_guo + '/role/destroy',
    data: testData,
    method: 'post'
  })
}
