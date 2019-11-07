import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

export default new vuex.Store({
  state: {
    checkArrData: [],
    checkSecondArr:{},
    viewPermission: {
      roleId: 0,
      platformIds: [],
      accountIds: [],
      shopIds: [],
      categoryIds: [],
      selectAll:[],
      vendorIds: [],
      departmentIds: []
    },

  }
 
})
