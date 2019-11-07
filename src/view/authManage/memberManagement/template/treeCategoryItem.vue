<template>

    <div>
            <div>
                <label>关键词：</label>
                <Input v-model="keywords" placeholder="品类名称" style="width: 160px"  @on-enter="search"  />

                <Button type="primary" @click="search()" style="margin-left: 10px;"><Icon style="font-size:18px" type="ios-search-outline" /></Button>
            </div>
            <Row type="flex"  class="code-row-bg">
                <i-col span="18">
                    <Tree :data="treeData" show-checkbox :render="renderContent" ref="tree" @on-check-change='changeshopitem'></Tree>

                </i-col>
            <i-col span="6">
                    <div style="position: fixed;width: 100%;">
                        <span id="top" v-show="searchAllData.length">一共找到 {{searchAllData.length}} 条数据</span>
                    <!-- <Anchor >
                        <AnchorLink v-for="(item,index,key) in searchAllData" :value="item" :key="key"  :title="item.categoryName" @click="jump(item)" />

                    </Anchor> -->
                    <ul>
                        <li style="margin:4px;" v-for="(item,index,key) in searchAllData" :value="item" :key="key">
                            <!-- <a   @click="jump(item)">{{item.categoryName}}</a> -->
                            <a :href="'#id_'+item.categoryId">{{item.categoryName}}</a>
                        </li>
                    </ul>
                    </div>

                <div  style="position: absolute;bottom: 0;right: 2px;">
                    <!-- <a :href="top"><Icon type="md-arrow-up" /></a> -->
                    <!-- <Button style="padding: 10px;background: rgba(0,153,229,.7);color: #fff;text-align: center;border-radius: 2px;border-radius: 4px;" >回到顶部</Button> -->
                </div>
            </i-col>
         </Row>
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
  // store,
  props: ['categoryData', 'parameterName'],

  data () {
    return {
      categoryDataTree: this.categoryData,
      treeData: [],
      keywords: '',
      searchAllData: [],
      selectedAll: [],
      disableCategoryarr: []
    }
  },
  methods: {
    search () {
      // 过滤数据源
      // 记录找到的数据
      let searchData = []
      let _this = this
      // console.log(this.categoryData)
      this.treeData = this.getcategoryData(this.categoryData)
    },
    renderContent (h, { root, node, data }) {
      let _this = this
      if (data.children || node.node.title == 'Wish' || node.node.title == 'Ebay') {
        // 根据当前所有选择的是否显示
        // node.node.isAll = false;
        let isShow = node.node.isAll == true ? 'inline-block' : 'none'
        let selectAllValue = node.node.selectAllValue
        let searchSelectedItem = ''
        let selectedItem = ''
        return h('span', {
          class: ['jump_' + data.categoryId, selectedItem + 'selectedItem' + data.selectedItem],
          style: {
            display: 'inline-block',
            width: '100%',
            color: searchSelectedItem
          },
          attrs: {
            name: 'id_' + data.categoryId,
            id: 'id_' + data.categoryId
          },
          props: {
            id: data.categoryId,
            name: 'sss666'
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
          // class:['jump_'+data.categoryId,],
          class: ['jump_' + data.categoryId, 'selectedItem' + data.selectedItem],

          style: {
            display: 'inline-block',
            width: '100%'
          },
          attrs: {
            name: 'id_' + data.categoryId,
            id: 'id_' + data.categoryId
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
    getcategoryData (tree = []) {
      let _this = this
      _this.searchAllData = []
      let arr = []
      if (tree.length !== 0) {
        // 恶心的部分
        tree.forEach(item => {
          let firstParent = {}
          //  console.log(item);
          firstParent.title = item.categoryName
          //  firstParent.categoryId = item.categoryId;
          firstParent.firstCategoryId = item.categoryId
          firstParent.isAll = item.isAll
          // 这两个要根据请求返回的值做判断
          firstParent.selected = false
          firstParent.disabled = false
          if (item.children.length <= 0) {
            if (_this.$store.state.memberViewPermission.disableData[this.parameterName].includes(item.categoryId)) {
              firstParent.checked = false
            } else {
              firstParent.checked = true
            }
          }

          firstParent.isDisabledSecond = false
          firstParent.selectAllValue = false

          // 根据判断是否有所有权限
          // 当有二级所有 才有下面
          //   console.log(this.$store.state)
          if (item.isAll && _this.$store.state.memberViewPermission.categoryIds.indexOf(item.categoryId) > -1) {
            //   firstParent.selected=true;
            firstParent.selectAllValue = true
            firstParent.disabled = true
          }

          if (item.isAll == false && _this.$store.state.memberViewPermission.categoryIds.indexOf(item.categoryId) > -1) {
            this.$store.state.memberViewPermission.categoryIds.remove(item.categoryId)
          }

          // this.$store.state.viewPermission.platformIds
          // 判断一级标题是否包涵搜索的关键词
          if (_this.keywords !== '' && item.categoryName.includes(_this.keywords.trim())) {
            _this.searchAllData.push(item)
            firstParent.selectedItem = true
          }

          let searchKey = false
          if (item.children.length !== 0) {
            // 二级菜单
            firstParent.children = []
            item.children.forEach(secondItem => {
              // 帐号
              let secondParent = {}
              secondParent.title = secondItem.categoryName
              // secondParent.accountId = secondItem.accountId;
              // secondParent.categoryId = secondItem.categoryId;
              secondParent.secondCategoryId = secondItem.categoryId
              secondParent.isAll = secondItem.isAll
              // 这两个要根据请求返回的值做判断
              secondParent.selected = false
              secondParent.disabled = false
              if (secondItem.children.length <= 0) {
                if (_this.$store.state.memberViewPermission.disableData[this.parameterName].includes(secondItem.categoryId) || _this.$store.state.memberViewPermission.disableData[this.parameterName].includes(item.categoryId)) {
                  secondParent.checked = false
                } else {
                  secondParent.checked = true
                }
              }
              // secondParent.checked  =true;
              secondParent.isDisabledSecond = false
              secondParent.selectAllValue = false
              // secondParent.secondAll =
              // console.log('indexOfaccountIds ');
              // 当有 二级所有显示权限 才有下面
              // console.log(this.$store.state.memberViewPermission)
              if (secondItem.isAll && _this.$store.state.memberViewPermission.categoryIds.indexOf(secondItem.categoryId) > -1) {
                //   firstParent.selected=true;
                secondParent.selectAllValue = true
                secondParent.disabled = true
              }
              if (secondItem.isAll == false && _this.$store.state.memberViewPermission.categoryIds.indexOf(secondItem.categoryId) > -1) {
                this.$store.state.memberViewPermission.categoryIds.remove(secondItem.categoryId)
              }

              if (_this.keywords !== '' && secondItem.categoryName.includes(_this.keywords.trim())) {
                _this.searchAllData.push(secondItem)
                secondParent.selectedItem = true
                // 展开一级
                searchKey = true
              }
              // let secondExpand =false;

              // 店铺
              // thirdParent.expand =true;

              let secondExpand = false
              if (secondItem.children.length !== 0) {
                secondParent.children = []

                secondItem.children.forEach(thirdItem => {
                  let thirdParent = {}
                  thirdParent.title = thirdItem.categoryName
                  thirdParent.categoryId = thirdItem.categoryId
                  // thirdParent.shopId = thirdItem.shopId;
                  thirdParent.selected = false
                  thirdParent.disabled = false
                  // 三级选中
                  if (_this.$store.state.memberViewPermission.categoryIds.indexOf(thirdItem.categoryId) > -1) {
                    thirdParent.checked = true
                  }
                  // 搜索关键词
                  // thirdParent.selectedItem =false;
                  if (_this.$store.state.memberViewPermission.disableData[this.parameterName].includes(thirdItem.categoryId) || _this.$store.state.memberViewPermission.disableData[this.parameterName].includes(secondItem.categoryId) || _this.$store.state.memberViewPermission.disableData[this.parameterName].includes(item.categoryId)) {
                    thirdParent.checked = false
                  } else {
                    thirdParent.checked = true
                  }
                  if (_this.keywords !== '' && thirdItem.categoryName.includes(_this.keywords.trim())) {
                    thirdParent.selectedItem = true

                    _this.searchAllData.push(thirdItem)

                    searchKey = true
                    secondExpand = true
                  }
                  // secondParent.expand=true;
                  // thirdParentconsole.log(thirdParent);
                  secondParent.children.push(thirdParent)
                })
              }
              secondParent.expand = true
              firstParent.children.push(secondParent)
            })
          }
          firstParent.expand = searchKey
          arr.push(firstParent)
        })
      }
      return arr
    },
    test2 () {
      this.treeData = this.getcategoryData(this.categoryData)
    },
    test3 () {
    },
    getCheckedAndIndeterminateNodes () {
      let checkedNodesIdarr = []
      let allDatavalueArr = []
      let checkedNodes = this.$refs.tree.getCheckedAndIndeterminateNodes()
      // let checkedNodes = this.$refs.tree.getCheckedNodes()

      for (var i = 0; i < checkedNodes.length; i++) {
        checkedNodes[i].id = checkedNodes[i].firstCategoryId || checkedNodes[i].secondCategoryId || checkedNodes[i].categoryId
        checkedNodesIdarr.push(checkedNodes[i].id)
      }
      for (var i = 0; i < this.treeData.length; i++) {
        allDatavalueArr.push(this.treeData[i].firstCategoryId)
        if (this.treeData[i].children && this.treeData[i].children.length > 0) {
          for (var j = 0; j < this.treeData[i].children.length; j++) {
            allDatavalueArr.push(this.treeData[i].children[j].secondCategoryId)
            if (this.treeData[i].children[j].children && this.treeData[i].children[j].children.length > 0) {
              for (var k = 0; k < this.treeData[i].children[j].children.length; k++) {
                allDatavalueArr.push(this.treeData[i].children[j].children[k].categoryId)
              }
            }
          }
        }
      }
      for (var h = 0; h < allDatavalueArr.length; h++) {
        if (!checkedNodesIdarr.includes(allDatavalueArr[h]) && !this.disableCategoryarr.includes(allDatavalueArr[h])) {
          this.disableCategoryarr.push(allDatavalueArr[h])
        }
      }
      for (var i = 0; i < checkedNodesIdarr.length; i++) {
        if (this.disableCategoryarr.includes(checkedNodesIdarr[i])) {
          this.disableCategoryarr.remove(checkedNodesIdarr[i])
        }
      }
      // for(var i = 0;i<this.$store.state.memberViewPermission.disableCategory.length;i++){
      //     if(!this.disableCategoryarr.includes(this.$store.state.memberViewPermission.disableCategory[i])){
      //         this.disableCategoryarr.push(this.$store.state.memberViewPermission.disableCategory[i])
      //     }
      // }
    },
    getNode () {
      let nodeArr = []
      nodeArr = this.$refs.tree.getCheckedNodes()
      nodeArr.forEach(item => {
        if (item.categoryId) {
          this.$store.state.memberViewPermission.categoryIds.push(item.categoryId)
        }
      })
    },
    selectAll (val, root, node, data) {
      if (val) {
        // 选中时候

        // 当选中所有的时候
        data.disabled = true
        data.selected = true
        // 一级所有
        if (data.firstCategoryId) {
          this.$store.state.memberViewPermission.categoryIds.push(data.firstCategoryId)
        }
        // 二级所有
        if (data.secondCategoryId) {
          this.$store.state.memberViewPermission.categoryIds.push(data.secondCategoryId)
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
        if (data.firstCategoryId) {
          //  this.$store.state.viewPermission.categoryIds.push(data.firstCategoryId)
          this.$store.state.memberViewPermission.categoryIds.remove(data.firstCategoryId)
        }
        // 二级所有
        if (data.secondCategoryId) {
          // this.$store.state.viewPermission.categoryIds.push(data.secondCategoryId)
          this.$store.state.memberViewPermission.categoryIds.remove(data.secondCategoryId)
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
    jump (item) {
      let jump = document.querySelectorAll('.jump_' + item.categoryId)
      // 获取需要滚动的距离
      let total = jump[0].offsetTop
      //     // Chrome
      document.body.scrollTop = total
      //     // Firefox
      document.documentElement.scrollTop = total
      // // Safari
      window.pageYOffset = total
    },
    changeshopitem (data, currenDom) {
      // this.disableCategoryarr = this.$store.state.memberViewPermission.disableCategory
      this.getCheckedAndIndeterminateNodes()
      // if(!currenDom.checked){
      //      this.$store.state.memberViewPermission.disableCategory.push(currenDom.categoryId)
      //     if(currenDom.children&&currenDom.children.length>0){
      //         for(let i=0;i<currenDom.children.length;i++){
      //             this.$store.state.memberViewPermission.disableCategory.push(currenDom.children[i].categoryId)
      //             if(currenDom.children[i].children&&currenDom.children[i].children.length>0){
      //                 for(let j = 0;j<currenDom.children[i].children.length;j++){
      //                     this.$store.state.memberViewPermission.disableCategory.push(currenDom.children[i].children[j].categoryId)
      //                 }
      //             }
      //         }
      //     }
      // }else{
      //      this.$store.state.memberViewPermission.disableCategory.remove(currenDom.categoryId)
      //     if(currenDom.children&&currenDom.children.length>0){
      //         for(let i=0;i<currenDom.children.length;i++){
      //             this.$store.state.memberViewPermission.disableCategory.remove(currenDom.children[i].categoryId)
      //             if(currenDom.children[i].children&&currenDom.children[i].children.length>0){
      //                 for(let j = 0;j<currenDom.children[i].children.length;j++){
      //                     this.$store.state.memberViewPermission.disableCategory.remove(currenDom.children[i].children[j].categoryId)
      //                 }
      //             }
      //         }
      //     }
      // }
    },
    getDisableValue () {
      this.$store.state.memberViewPermission.disableData[this.parameterName] = this.disableCategoryarr
    }
  },
  mounted () {
    //   window.addEventListener('scroll', this.scrollToTop)
    this.search()
    this.test2()
    this.disableCategoryarr = this.$store.state.memberViewPermission.disableData[this.parameterName]
  }

}
</script>
<style >
.out-modal-check .ivu-checkbox .ivu-checkbox-inner:after{
    content: "x";
    display: block;
    width: 14px;
    height:14px;
    /* text-indent: 3px; */
        text-align: center;
        border-bottom-width: 0px;
    border-right-width: 0px;
    position: absolute;
    top: -1px;
    left:-1px;
    line-height: 12px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    border-top: 0;
    border-left: 0;
    background: red;
    border-radius: 2px;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    transition: all .2s ease-in-out;
}
.ivu-checkbox-checked .ivu-checkbox-inner{
    border-color: #2d8cf0 !important;
    background-color:#2d8cf0 !important;
}
.selectedItemtrue{
    color: red;
}
.ivu-checkbox .ivu-checkbox-inner::after{
    background: white;
}
.out-modal-check .ivu-checkbox-checked .ivu-checkbox-inner:after{
    content: '';
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 4px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(1);
    transform: rotate(45deg) scale(1);
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
}
.ivu-checkbox-checked .ivu-checkbox-inner:after{
  background: #2d8cf0 !important
}
.ivu-tree-children .ivu-checkbox-indeterminate .ivu-checkbox-inner:after{
    content: "";
    width: 8px;
    height: 1px;
    -webkit-transform: scale(1);
    transform: scale(1);
    position: absolute;
    left: 2px;
    top: 5px;
}
.out-modal-check .ivu-checkbox-indeterminate .ivu-checkbox-inner:after{
    background: #fff;
    border-bottom-width: 2px;
}
</style>
