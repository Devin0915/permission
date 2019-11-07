import Mock from 'mockjs'

export const getUserHtmlIds = () => {
    let data = {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
			"permission": {                     // 系统代码
                "permission_apiAction_add": 1,       // 键名为htmlId，键值为是否拥有权限，1代表有，0代表没有
                "permission_apiAction_modify": 1,
                "permission_apiAction_list": 1,
                "permission_apiAction_userDetail": 1,
                "permission_apiAction_add": 1,
                "permission_apiAction_modift": 0,
                "permission_apiAction_view": 1
            },
			"ptxXc": {
                "ptxXc_model1_action1": 1,
                "ptxXc_model1_action2": 0,
                "ptxXc_model2_action1": 1
            }
		}
    }
  
    return data
  }