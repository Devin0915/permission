import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
const Random = Mock.Random

export const getMessageInit = () => {
  let unreadList = []
  doCustomTimes(3, () => {
    unreadList.push(Mock.mock({
      title: Random.cword(10, 15),
      create_time: '@date',
      msg_id: Random.increment(100)
    }))
  })
  let readedList = []
  doCustomTimes(4, () => {
    readedList.push(Mock.mock({
      title: Random.cword(10, 15),
      create_time: '@date',
      msg_id: Random.increment(100)
    }))
  })
  let trashList = []
  doCustomTimes(2, () => {
    trashList.push(Mock.mock({
      title: Random.cword(10, 15),
      create_time: '@date',
      msg_id: Random.increment(100)
    }))
  })
  return {
    unread: unreadList,
    readed: readedList,
    trash: trashList
  }
}

// export const getContentByMsgId = () => {
//   return `<divcourier new',="" monospace;font-weight:="" normal;font-size:="" 12px;line-height:="" 18px;white-space:="" pre;"=""><div>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: medium;">这是消息内容，这个内容是使用<span style="color: rgb(255, 255, 255); background-color: rgb(28, 72, 127);">富文本编辑器</span>编辑的，所以你可以看到一些<span style="text-decoration-line: underline; font-style: italic; color: rgb(194, 79, 74);">格式</span></span></div><ol><li>你可以查看Mock返回的数据格式，和api请求的接口，来确定你的后端接口的开发</li><li>使用你的真实接口后，前端页面基本不需要修改即可满足基本需求</li><li>快来试试吧</li></ol><p>${Random.csentence(100, 200)}</p></divcourier>`
// }

export const hasRead = () => {
  return true
}

export const removeReaded = () => {
  return true
}

export const restoreTrash = () => {
  return true
}

export const messageCount = () => {
  return 3
}

export const getRoleList = () => {
  let data = {
    'jsonrpc': '2.0',
    'id': null,
    'result': {
      'pageInfo': {
        'pageSize': 20, // 每页最多显示多少条记录
        'pageIndex': 1, // 当前返回第几页记录
        'totalPage': 122, // 总页数
        'totalNum': 111 // 总记录数
      },
      'list': [{
        'roleId': '6', // 角色ID
        'roleName': '事业五部管', // 角色名称，字符串
        'description': '事业五部管理员', // 角色描述，字符串
        'departmentId': '2', // 角色所属部门ID
        'departmentName': '事业六部', // 角色所属部门名称
        'status': '1', // 状态 (默认1 0禁用，1正常)
        'createdAt': '1555576048', // 创建时间
        'createdBy': 'admin', // 创建人
        'updatedAt': '1555576048', // 更新时间
        'updatedBy': 'admin' // 修改人
      },
      {
        'roleId': '6', // 角色ID
        'roleName': '事业五部管', // 角色名称，字符串
        'description': '事业五部管理员', // 角色描述，字符串
        'departmentId': '2', // 角色所属部门ID
        'departmentName': '事业六部', // 角色所属部门名称
        'status': '1', // 状态 (默认1 0禁用，1正常)
        'createdAt': '1555576048', // 创建时间
        'createdBy': 'admin', // 创建人
        'updatedAt': '1555576048', // 更新时间
        'updatedBy': 'admin' // 修改人
      },
      {
        'roleId': '6', // 角色ID
        'roleName': '事业五部管', // 角色名称，字符串
        'description': '事业五部管理员', // 角色描述，字符串
        'departmentId': '2', // 角色所属部门ID
        'departmentName': '事业六部', // 角色所属部门名称
        'status': '1', // 状态 (默认1 0禁用，1正常)
        'createdAt': '1555576048', // 创建时间
        'createdBy': 'admin', // 创建人
        'updatedAt': '1555576048', // 更新时间
        'updatedBy': 'admin' // 修改人
      }
      // 像这种结构的数据多条
      ]
    }
  }

  return data
}
export const getMemberList = () => {
  let data = {
    'jsonrpc': '2.0',
    'id': null,
    'result': {
      'pageInfo': {
        'pageSize': 20, // 每页最多显示多少条记录
        'pageIndex': 1, // 当前返回第几页记录
        'totalPage': 122, // 总页数
        'totalNum': 111 // 总记录数
      },
      'list': [
        {
          'userId': 1, // 用户id
          'userName': 'Test1', // 用户名
          'commonName': '测试1', // 通用名
          'department': '事业一部', // 所属部门
          'email': 'Test2@patozon.net', // 邮箱
          'roleName': '运营专员、助理', // 角色
          'isRemotely': 1, // 允许远程
          'createdBy': 'Jason', // 创建人
          'createdAt': '2019-04-17 15:30:01', // 创建时间
          'status': 1, // 状态
          'updatedAt': '2019-04-17 16:30:01' // 修改时间
        },
        {
          'userId': 1, // 用户id
          'userName': 'Test1', // 用户名
          'commonName': '测试1', // 通用名
          'department': '事业一部', // 所属部门
          'email': 'Test2@patozon.net', // 邮箱
          'roleName': '运营专员、助理', // 角色
          'isRemotely': 1, // 允许远程
          'createdBy': 'Jason', // 创建人
          'createdAt': '2019-04-17 15:30:01', // 创建时间
          'status': 1, // 状态
          'updatedAt': '2019-04-17 16:30:01' // 修改时间
        },
        {
          'userId': 1, // 用户id
          'userName': 'Test1', // 用户名
          'commonName': '测试1', // 通用名
          'department': '事业一部', // 所属部门
          'email': 'Test2@patozon.net', // 邮箱
          'roleName': '运营专员、助理', // 角色
          'isRemotely': 1, // 允许远程
          'createdBy': 'Jason', // 创建人
          'createdAt': '2019-04-17 15:30:01', // 创建时间
          'status': 1, // 状态
          'updatedAt': '2019-04-17 16:30:01' // 修改时间
        }
      // 像这种结构的数据多条
      ]
    }
  }

  return data
}

export const userPermissionsList = () => {
  let data = 	{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "disableAction": [					//已禁用菜单列表
            1,2,3,4,55,89					//已禁用菜单ID
        ],
        "actions": {						//可操作菜单列表
            "erp": [						//平台code,每个平台一个
                {
                    "actionId": "1",		//菜单/功能动作ID
                    "name": "商品管理",		//菜单/功能动作名称
                    "lgt": "1",				//左值	
                    "rgt": "2",				//右值	
                    "lv": "1",				//层级
                    "child": []
                },
                {
                    "actionId": "2",
                    "name": "采购管理",
                    "lgt": "3",
                    "rgt": "12",
                    "lv": "1",
                    "child": [
                        {
                            "actionId": "9",
                            "name": "供应商列表",
                            "lgt": "4",
                            "rgt": "9",
                            "lv": "2",
                            "child": [
                                {
                                    "actionId": "10",
                                    "name": "测试修改",
                                    "lgt": "5",
                                    "rgt": "8",
                                    "lv": "3",
                                    "child": []
                                },
                                {
                                  "actionId": "11",
                                  "name": "测试修改2",
                                  "lgt": "5",
                                  "rgt": "8",
                                  "lv": "3",
                                  "child": []
                              },
                              {
                                "actionId": "12",
                                "name": "测试修改3",
                                "lgt": "5",
                                "rgt": "8",
                                "lv": "3",
                                "child": []
                            }
                              
                                //以下多个相同结构数据
                            ]
                        },
                        {
                            "actionId": "12",
                            "name": "供应商产品列表",
                            "lgt": "10",
                            "rgt": "11",
                            "lv": "2",
                            "child": []
                        }
                    ]
                }
            ],
            "ptxXc": [],
            "ptxWk": []
        }
    }
}

  return data
}
export const getDepartments = () => {
  let data = {
    'jsonrpc': '2.0',
    'id': 1,
    'result': {
      'list': {
        '101': '\u603b\u7ecf\u529e',
        '201': '\u7efc\u5408\u4e2d\u5fc3',
        '202': '\u8d22\u52a1\u4e2d\u5fc3',
        '203': '\u4f9b\u5e94\u94fe\u4e2d\u5fc3',
        '204': '\u53c2\u8c0b\u90e8',
        '205': '\u54c1\u724c\u7ba1\u7406\u90e8',
        '206': '\u5de5\u4e1a\u8bbe\u8ba1\u90e8',
        '207': '\u7cfb\u7edf\u6280\u672f\u90e8',
        '208': '\u4e8b\u4e1a\u4e00\u90e8',
        '209': '\u4e8b\u4e1a\u4e8c\u90e8',
        '210': '\u4e8b\u4e1a\u4e09\u90e8',
        '211': '\u4e8b\u4e1a\u56db\u90e8',
        '212': '\u4e8b\u4e1a\u4e94\u90e8',
        '213': '\u4e8b\u4e1a\u516d\u90e8',
        '214': '\u4e8b\u4e1a\u4e03\u90e8',
        '215': '\u4e8b\u4e1a\u516b\u90e8',
        '216': '\u4e8b\u4e1a\u4e5d\u90e8',
        '217': '\u6d77\u5916\u7ebf\u4e0b\u9500\u552e\u90e8',
        '991': '\u672a\u5206\u914d\u90e8\u95e8'
      }
    }
  }
  return data
}
export const treeList = () => {
  let data = {
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
   "list": [
    {
      "id": 1,						  	  // 字典ID
      "value": "",                      	  // 键值
            "name": "toplevel",                   // 名称
            "expand": "true",                     // 是否展开
      "top": 1,							  // 是否顶级
      "info": {							  // 信息
        "index": "",				      // 排序
        "status": 1,                      // 状态
        "statusName": "启用",			  // 状态显示名
        "html": "",						  // HTML标签
        "description": ""				  // 描述
      },
            "children": [						  // 子分类
              {
          "id": 2,
          "value": "",
                  "name": "sublevel1-1",
                  "expand": "true",
          "top": 0,
          "info": {
            "index": "",
            "status": 1,
            "statusName": "启用",
            "html": "",
            "description": ""
          },
                  "children": [
                    {
              "id": 3,
              "value": "",
                        "name": "sublevel2-1",
                        "expand": "true",
              "top": 0,
                        "info": {	
                "index": "",
                "status": 1,
                "statusName": "启用",
                "html": "",
                "description": ""
              },
              "children": [
              ]
                    },
                    {
              "id": 4,
              "value": "",
                        "name": "sublevel2-2",
                        "expand": "true",
              "top": 0,
              "info": {
                "index": "",
                "status": 1,
                "statusName": "启用",
                "html": "",
                "description": ""
              },
              "children": [
              ]
                    }
                  ]
              },
              {
          "id": 5,
          "value": "",
                  "name": "sublevel1-2",
                  "expand": "true",
          "top": 0,
          "info": {
            "index": "",
            "status": 1,
            "statusName": "启用",
            "html": "",
            "description": ""
          },
                  "children": [
                    {
              "id": 6,
              "value": "",
                        "name": "sublevel1-2-1",
                        "expand": "true",
              "top": 0,
              "info": {
                "index": "",
                "status": 1,
                "statusName": "启用",
                "html": "",
                "description": ""
              },
              "children": [
              ]
                    },
                    {
              "id": 7,
              "value": "",
                        "name": "sublevel1-2-2",
                        "expand": "true",
              "top": 0,
              "info": {
                "index": "",
                "status": 1,
                "statusName": "启用",
                "html": "",
                "description": ""
              },
              "children": [
              ]
                    }
                  ]
            }
      ]	
      }
  ]
}
  }

  return data
}
export const sublevelAdd = () => {
  let data = {
    	"jsonrpc": "2.0",
    	"method": "",
    	"id": 1,
    	"params": {
    		"dictId": 1002
    	}
  }
  return data
}
export const groupAdd = () => {
  let data = {
    	"jsonrpc": "2.0",
    	"method": "",
    	"id": 1,
    	"params": {
    		"dictId": 1002
    	}
  }
  return data
}
export const groupModify = () => {
  let data = {
    	"jsonrpc": "2.0",
    	"method": "",
    	"id": 1,
    	"params": {
    		"dictId": 1002
    	}
  }
  return data
}
export const sublevelModify = () => {
  let data = {
    	"jsonrpc": "2.0",
    	"method": "",
    	"id": 1,
    	"params": {
    		"dictId": 1002
    	}
  }
  return data
}
export const getContentByMsgId = () => {
  return `<divcourier new',="" monospace;font-weight:="" normal;font-size:="" 12px;line-height:="" 18px;white-space:="" pre;"=""><div>&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: medium;">这是消息内容，这个内容是使用<span style="color: rgb(255, 255, 255); background-color: rgb(28, 72, 127);">富文本编辑器</span>编辑的，所以你可以看到一些<span style="text-decoration-line: underline; font-style: italic; color: rgb(194, 79, 74);">格式</span></span></div><ol><li>你可以查看Mock返回的数据格式，和api请求的接口，来确定你的后端接口的开发</li><li>使用你的真实接口后，前端页面基本不需要修改即可满足基本需求</li><li>快来试试吧</li></ol><p>${Random.csentence(100, 200)}</p></divcourier>`
}