import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

export default new vuex.Store({
  state: {
    memberViewcheckArrData: [],
    memberViewPermission: {
      roleId: 0,
      platformIds: [],
      accountIds: [],
      shopIds: [],
      categoryIds: [],
      vendorIds: [],
      departmentIds: [],
      disableAction: [],
      disableData: []
    }
  }
})
