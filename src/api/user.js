import axios from '@/libs/api.request'
import JSON from 'JSON'

let sylarApi = ""
let Dev_guo = ''
let Dev_Jason = ''
let Yii = ''
let syly = ''

if (process.env.NODE_ENV === 'production') {
  sylarApi = "/api"
  Dev_guo = '/api'
  Dev_Jason = '/api'
  Yii = '/api'
  syly = '/api'
} else {
  // sylarApi = "http://172.16.6.92:8008/api"
  // Dev_guo = 'http://172.16.6.92:8022/api'
  // Dev_Jason = 'http://172.16.6.92:8050/api'
  // Yii = 'http://172.16.6.92:8005/api'
  sylarApi = Dev_guo = Dev_Jason = Yii = syly = 'http://172.16.6.92/api'
}

export const login = (logInfo) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': logInfo
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/login',
    // url: 'http://172.16.6.93:8002/site/login',
    data: data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': {
      'userId': JSON.parse(token).userId,
      "operatorId":JSON.parse(token).operatorId
    }
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/user/userDetails',
    data: data,
    method: 'post'
  })
}

export const logout = (token) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': {

    }
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/logout',
    data: data,
    method: 'post'
  })
}

export const passwordModify = (state, formItem) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const params = {
    'params': {
      'userId': JSON.parse(state.token).userId,
      'passwordNew': formItem.passWd,
      'passwordConfirm': formItem.passWdCheck
    }
  }
  Object.assign(reqData, params)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/passwordModify',
    data: data,
    method: 'post'
  })
}

export const passwordRest = (formItem) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const params = {
    'params': {
      'entity': formItem.email,
      'verifyCode': formItem.identifyingCode,
      'passwordNew': formItem.passWd,
      'passwordConfirm': formItem.passWdCheck
    }
  }
  Object.assign(reqData, params)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/passwordReset',
    data: data,
    method: 'post'
  })
}

export const cendIdentCode = (formItem) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const params = {
    'params': {
      'entity': formItem.email
    }
  }
  Object.assign(reqData, params)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/sendVerifyCode',
    data: data,
    method: 'post'
  })
}

// let Dev_guo = ''
export const getRoleList = reqData => {
  const testData =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/lists',
    data: testData,
    method: 'post'
  })
}

export const getDepartments = reqData1 => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const params = { 'params': {} }
  Object.assign(reqData, params)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/getDepartments',
    data: data,
    method: 'post'
  })
}

export const getParam = reqData => {
  const testData =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/test/getParam',
    data: testData,
    method: 'post'
  })
}
export const getMemberList = reqData => {
  const testData =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/user/usersList',
    data: testData,
    method: 'post'
  })
}
export const userPermissionsList = reqData1 => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': {
      'roleId': reqData1
    }
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/User/userPermissionsList',
    data: data,
    method: 'post'
  })
}
export const ModifyStatus = reqData1 => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': reqData1
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/user/modifyStatus',
    data: data,
    method: 'post'
  })
}
export const treeList = () => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': {}
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/treeList',
    data: data,
    method: 'post'
  })
}
export const sublevelView = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/sublevelView',
    data: data,
    method: 'post'
  })
}
export const sublevelAdd = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/sublevelAdd',
    data: data,
    method: 'post'
  })
}
export const sublevelModify = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/sublevelModify',
    data: data,
    method: 'post'
  })
}
export const groupAdd = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/groupAdd',
    data: data,
    method: 'post'
  })
}
export const groupView = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/groupView',
    data: data,
    method: 'post'
  })
}
export const groupModify = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/groupModify',
    data: data,
    method: 'post'
  })
}
export const ApiActionList = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/apiAction/apiActionList',
    data: data,
    method: 'post'
  })
}
export const ModifyAction = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/apiAction/modifyAction',
    data: data,
    method: 'post'
  })
}
export const AddAction = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/apiAction/addAction',
    data: data,
    method: 'post'
  })
}
export const ApiActionDetails = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/apiAction/apiActionDetails',
    data: data,
    method: 'post'
  })
}
export const showCaptchaImage = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/showCaptchaImage',
    data: data,
    method: 'post'
  })
}
export const search = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/search',
    data: data,
    method: 'post'
  })
}
export const action = reqData1 => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': { 'roleIds': reqData1 }
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_guo + '/role/action',
    data: data,
    method: 'post'
  })
}
export const listDataPermission = reqData1 => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': { 'roleIds': reqData1 }
  }

  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    // url: Yii + '/role/listDataPermission',
    url: Yii + '/resource/getRolesDataPmTree',
    data: data,
    method: 'post'
  })
}
export const DeleteAction = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/apiAction/deleteAction',
    data: data,
    method: 'post'
  })
}
export const actionSearch = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/apiAction/search',
    data: data,
    method: 'post'
  })
}
export const userModify = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/user/modify',
    data: data,
    method: 'post'
  })
}
export const userAddCopy = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data =  JSON.stringify(reqData)
  return axios.request({
    url: Dev_Jason + '/user/userAddCopy',
    data: data,
    method: 'post'
  })
}
export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const getSingleSignOnUrl = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data = JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/user/getSingleSignOnUrl',
    data: data,
    method: 'post'
  })
}
export const dictionaryDelete = (params) => {
  const reqData = {
    'id': 1, 'jsonrpc': '2.0', 'method': ''
  }
  const paramsData = {
    'params': params
  }
  Object.assign(reqData, paramsData)
  const data = JSON.stringify(reqData)
  return axios.request({
    url: sylarApi + '/dictionary/delete',
    data: data,
    method: 'post'
  })
}