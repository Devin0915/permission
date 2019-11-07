import Mock from 'mockjs'

export const getRoleView = () => {
  let data = {
    'jsonrpc': '2.0',
    'id': 4,
    'result': {
      'roleInfo': {
        'roleId': '110',
        'roleName': '事业1部管',
        'description': '事业五部管理员 description 描述',
        'departmentId': '201',
        'status': 1,
        'createdAt': 1555556662,
        'createdBy': 'admin',
        'updatedAt': 0,
        'updatedBy': ''
      }
    }
  }
  return data
}

export const roleModify = () => {
  let data = {
    'jsonrpc': '2.0',
    'id': 4,
    'result': {
      'roleInfo': {
        'roleId': '110',
        'roleName': '事业666部管',
        'description': '事业五部管理员 description 描述',
        'departmentName': '事业六部',
        'departmentId': '201',
        'status': 1,
        'createdAt': 1555556662,
        'createdBy': 'admin',
        'updatedAt': 0,
        'updatedBy': 'can'
      }
    }
  }
  return data
}

export const roleAdd = () => {
  let data = {
    'jsonrpc': '2.0',
    'id': 4,
    'result': {
      'roleInfo': {
        'roleId': '110',
        'roleName': '事业666部管',
        'description': '事业五部管理员 description 描述',
        'departmentName': '事业六部',
        'departmentId': '201',
        'status': 1,
        'createdAt': 1555556662,
        'createdBy': 'admin',
        'updatedAt': 0,
        'updatedBy': 'can'
      }
    }
  }
  return data
}
