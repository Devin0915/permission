<template>

    <div>
        <Tree :data="treeData" show-checkbox :render="renderContent" ref="tree" @on-check-change="changeshopitem"></Tree>
         <!-- <Button type="primary" @click="test()">测试</Button>
         <Button type="primary" @click="getNode()">过去所有选中节点</Button> -->
    </div>
</template>
<script>
// import store from '../store/index';
Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
export default {
  props: ['shopData', 'parameterName'],

  data () {
    return {
      shopDataTree: this.shopData,
      treeData: [],
      disableShoparr: []
    }
  },
  methods: {

    renderContent (h, { root, node, data }) {
      let _this = this
      if (data.children || node.node.title == 'Wish' || node.node.title == 'Ebay') {
        // 根据当前所有选择的是否显示
        // node.node.isAll = false;
        let isShow = node.node.isAll == true ? 'inline-block' : 'none'
        let selectAllValue = node.node.selectAllValue
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-folder-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {

            style: {
              // display: 'inline-block',
              // display: 'none',
              display: isShow,
              marginLeft: '40px'
            }

          })
        ])
      } else {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-folder-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ])

        ])
      }
    },
    getShopData (tree = []) {
      let arr = []
      if (tree.length !== 0) {
        // 恶心的部分
        tree.forEach(item => {
          let firstParent = {}
          //  console.log(item);
          firstParent.title = item.platformCode
          firstParent.platformId = item.platformId
          //  firstParent.categoryId = item.categoryId;
          firstParent.isAll = item.isAll
          // 这两个要根据请求返回的值做判断
          firstParent.selected = false
          firstParent.disabled = false
          if (item.accounts.length <= 0) {
            firstParent.checked = true
          }
          // firstParent.checked  =true;
          // if(item.accounts.length<=0){
          //      if(this.$store.state.memberViewPermission.disableShop.includes(item.platformId)){
          //         firstParent.checked  =false;
          //     }else{
          //         firstParent.checked  =true;
          //     }
          // }
          firstParent.isDisabledSecond = false
          firstParent.selectAllValue = false

          // 根据判断是否有所有权限
          // 当有二级所有 才有下面
          if (item.isAll && this.$store.state.memberViewPermission.platformIds && this.$store.state.memberViewPermission.platformIds.indexOf(item.platformId) > -1) {
            //   firstParent.selected=true;
            firstParent.selectAllValue = true
            firstParent.disabled = true
          }

          if (item.isAll == false && this.$store.state.memberViewPermission.platformIds && this.$store.state.memberViewPermission.platformIds.indexOf(item.platformId) > -1) {
            this.$store.state.memberViewPermission.platformIds.remove(item.platformId)
          }

          // this.$store.state.viewPermission.platformIds

          if (item.accounts.length !== 0) {
            // 二级菜单
            firstParent.children = []
            item.accounts.forEach(secondItem => {
              // 帐号
              let secondParent = {}
              secondParent.title = secondItem.accountCode
              secondParent.accountId = secondItem.accountId
              secondParent.isAll = secondItem.isAll
              // 这两个要根据请求返回的值做判断
              secondParent.selected = false
              secondParent.disabled = false
              if (secondItem.shops.length <= 0) {
                secondParent.checked = true
              }
              // secondParent.checked  =true;
              // if(secondItem.shops.length<=0){
              //     if(this.$store.state.memberViewPermission.disableShop.includes(secondItem.accountId)||this.$store.state.memberViewPermission.disableShop.includes(item.platformId)){
              //         secondParent.checked  =false;
              //     }else{
              //         secondParent.checked  =true;
              //     }
              // }
              secondParent.isDisabledSecond = false
              secondParent.selectAllValue = false
              // secondParent.secondAll =
              // console.log('indexOfaccountIds ');
              // 当有 二级所有显示权限 才有下面
              if (secondItem.isAll && this.$store.state.memberViewPermission.accountIds.indexOf(secondItem.accountId) > -1) {
                //   firstParent.selected=true;
                secondParent.selectAllValue = true
                secondParent.disabled = true
              }
              if (secondItem.isAll == false && this.$store.state.memberViewPermission.accountIds.indexOf(secondItem.accountId) > -1) {
                this.$store.state.memberViewPermission.accountIds.remove(secondItem.accountId)
              }

              firstParent.children.push(secondParent)
              // 店铺
              if (secondItem.shops.length !== 0) {
                secondParent.children = []
                secondItem.shops.forEach(thirdItem => {
                  let thirdParent = {}
                  thirdParent.title = thirdItem.shopCode
                  thirdParent.shopId = thirdItem.shopId
                  thirdParent.selected = false
                  thirdParent.disabled = false
                  // console.log(this.$store.state.memberViewPermission.disableData)
                  if (this.$store.state.memberViewPermission.disableData[this.parameterName].includes(thirdItem.shopId)) {
                    thirdParent.checked = false
                  } else {
                    thirdParent.checked = true
                  }
                  // 三级选中
                  if (this.$store.state.memberViewPermission.shopIds.indexOf(thirdItem.shopId) > -1) {
                    thirdParent.checked = true
                  }
                  secondParent.children.push(thirdParent)
                })
              }
            })
          }
          arr.push(firstParent)
        })
      }
      return arr
    },
    test () {
      // console.log('test')
      // console.log(this.shopData)
      // this.treeData
      this.treeData = this.getShopData(this.shopData)
      // console.log(this.treeData)
      // this.getShopData(this.shopDataTree);
    },
    getDisableValue () {
      // console.log()
      let nodeArr = []
      nodeArr = this.$refs.tree.getCheckedNodes()
      //
      let shopIds = []
      this.$store.state.memberViewPermission.shopIds = []
      nodeArr.forEach(item => {
        if (item.shopId) {
          shopIds.push(item.shopId)
        }
      })

      this.$store.state.memberViewPermission.shopIds = shopIds
      // console.log(this.$refs.tree.getCheckedNodes())
    },
    selectAll (val, root, node, data) {
      if (val) {
        // 选中时候

        // 当选中所有的时候
        data.disabled = true
        data.selected = true
        // 一级所有
        if (data.platformId) {
          this.$store.state.memberViewPermission.platformIds.push(data.platformId)
        }
        // 二级所有
        if (data.accountId) {
          this.$store.state.memberViewPermission.accountIds.push(data.accountId)
        }
        if (data.children && data.children.length !== 0) {
          data.children.forEach(item => {
            // console.log(item)
            item.disabled = true
            // item.checked = true;
            item.isDisabledSecond = true
            if (item.children && item.children.length !== 0) {
              item.children.forEach(childItem => {
                childItem.disabled = true
                // childItem.checked =true;
                // console.log(childItem)
              })
            }
          })
        }
      } else {
        // data.checked = false ;
        // node.node.checked = false;
        data.disabled = false
        data.selected = false

        // console.log(data)
        // 一级所有
        if (data.platformId) {
          this.$store.state.memberViewPermission.platformIds.remove(data.platformId)
        }
        // 二级所有
        if (data.accountId) {
          this.$store.state.memberViewPermission.accountIds.remove(data.accountId)
        }
        // 子节点
        if (data.children && data.children.length !== 0) {
          data.children.forEach(item => {
            // console.log(item)
            item.disabled = false
            item.disabled = false
            // item.checked = false ;
            item.isDisabledSecond = false
            if (item.children && item.children.length !== 0) {
              item.children.forEach(childItem => {
                childItem.disabled = false
                // childItem.disabled=false;
                // console.log(childItem)
                // childItem.checked = false ;
                // childItem.isDisabledSecond = false;
              })
            }
          })
        }
      }
    },
    getCheckedAndIndeterminateNodes () {
      let checkedNodesIdarr = []
      let allDatavalueArr = []
      let checkedNodes = this.$refs.tree.getCheckedAndIndeterminateNodes()
      for (var i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].shopId) {
          checkedNodesIdarr.push(checkedNodes[i].shopId)
        }
        // checkedNodes[i].id =  checkedNodes[i].platformId||checkedNodes[i].accountId||checkedNodes[i].shopId
        // checkedNodesIdarr.push(checkedNodes[i].id)
      }
      for (var i = 0; i < this.treeData.length; i++) {
        // allDatavalueArr.push(this.treeData[i].platformId);
        if (this.treeData[i].children && this.treeData[i].children.length > 0) {
          for (var j = 0; j < this.treeData[i].children.length; j++) {
            // allDatavalueArr.push(this.treeData[i].children[j].accountId)
            if (this.treeData[i].children[j].children && this.treeData[i].children[j].children.length > 0) {
              for (var k = 0; k < this.treeData[i].children[j].children.length; k++) {
                allDatavalueArr.push(this.treeData[i].children[j].children[k].shopId)
              }
            }
          }
        }
      }
      for (var h = 0; h < allDatavalueArr.length; h++) {
        if (!checkedNodesIdarr.includes(allDatavalueArr[h]) && !this.disableShoparr.includes(allDatavalueArr[h])) {
          this.disableShoparr.push(allDatavalueArr[h])
        }
      }
      for (var i = 0; i < checkedNodesIdarr.length; i++) {
        if (this.disableShoparr.includes(checkedNodesIdarr[i])) {
          this.disableShoparr.remove(checkedNodesIdarr[i])
        }
      }
    },
    changeshopitem (data, currenDom) {
      this.getCheckedAndIndeterminateNodes()
    },
    getShopsValue () {
      this.$store.state.memberViewPermission.disableData[this.parameterName] = this.disableShoparr
    }

  },
  mounted () {
    this.test()
    this.disableShoparr = this.$store.state.memberViewPermission.disableData[this.parameterName]
  }
}
</script>
<style scoped>
.ivu-checkbox .ivu-checkbox-inner{
    border-color: red;
    background-color:red
}
.ivu-checkbox-checked .ivu-checkbox-inner{
    border-color: #2d8cf0 !important;
    background-color:#2d8cf0 !important;
}

</style>
