<template>
    
    <div>
         
             
            <div>
                <label>关键词：</label>
                <Input v-model="keywords" placeholder="品类名称" style="width: 160px" @on-enter="search" />
                
                <Button type="primary" @click="search()" style="margin-left: 10px;"><Icon style="font-size:18px" type="ios-search-outline" /></Button>
            </div>
            <Row type="flex"  class="code-row-bg">
                 <i-col span="18">
                    <Tree :data="treeData" show-checkbox :render="renderContent" ref="tree"></Tree>
                   <!-- <Button type="primary" @click="test2()">测试2</Button>
                    <Button type="primary" @click="test3()">获取数据</Button>
                    <Button type="primary" @click="getNode()">过去所有选中节点</Button>  -->
                    
                </i-col> 
            <i-col span="6">
                    <div style="position: fixed;width: 100%;">
                        <span id="top" v-show="searchAllData.length">一共找到 {{searchAllData.length}} 条数据</span>
                    <ul>
                        <li style="margin:4px;" v-for="(item,index,key) in searchAllData" :value="item" :key="key">
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
    import store from '../store/index';
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
        }
    };
    export default {
        store,
        props:["categoryData"],

        data () {
            return {
                categoryDataTree:this.categoryData,
                treeData:[],
                keywords:'',
                searchAllData:[],
                selectedAll:[]
            }
        },
        methods: {
            search(){
                // 过滤数据源
                // 记录找到的数据
                let searchData=[];
                let _this =this;
                // console.log(this.categoryData)
              this.treeData = this.getcategoryData(this.categoryData);

            },
            renderContent(h, { root, node, data }){
                let _this = this;
                
                    // 根据当前所有选择的是否显示
                    // node.node.isAll = false;
                    let isShow=node.node.isAll==true?"inline-block":"none";
                    let selectAllValue = node.node.selectAllValue;
                    let searchSelectedItem ='';
                     let selectedItem = '';
                    return h('span', {
                        class:['jump_'+data.categoryId,selectedItem+"selectedItem"+data.selectedItem],
                        style: {
                            display: 'inline-block',
                            width: '100%',
                            color: searchSelectedItem,
                        },
                         attrs: {
                                name: "id_"+data.categoryId,
                                id:"id_"+data.categoryId
                        },
                            props: {
                                id:data.categoryId,
                                name:'sss666'
                            },
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
                                    marginLeft:'40px'
                                }
                                
                            }, [
                                h('Checkbox', {
                                    style: {
                                          disabled:'true',
                                    },
                                    props: {
                                        // 控制不可修改
                                        disabled:node.node.isDisabledSecond,
                                        indeterminate:node.node.isDisabledSecond,
                                        // 根据有权限的值来判断
                                        value:selectAllValue,
                                    },
                                    
                                    on:{
                                        'on-change':(val)=>{
                                            _this.selectAll(val,root, node, data)
                                        },
                                    }
                                },"所有"+data.title)
                            ])
                    ]);
                
                
            },
            getcategoryData(tree = []){
                let _this = this;
                _this.searchAllData =[];
                let arr = [];
                if (tree.length !== 0) {
                    // 恶心的部分
                    tree.forEach(item => {
                         let firstParent ={};
                        //  console.log(item);
                         firstParent.title = item.categoryName;
                        //  firstParent.categoryId = item.categoryId;
                        firstParent.firstCategoryId = item.categoryId;
                         firstParent.isAll = item.isAll;
                         // 这两个要根据请求返回的值做判断
                            firstParent.selected=false;
                            firstParent.disabled =false;
                            firstParent.checked  =false;
                            firstParent.isDisabledSecond =false;
                             firstParent.selectAllValue = false;
                            
                            // 根据判断是否有所有权限
                            // 当有二级所有 才有下面
                          
                        if(item.isAll && this.$store.state.viewPermission.categoryIds.indexOf(item.categoryId) > -1){
                            //   firstParent.selected=true;
                                firstParent.selectAllValue = true;
                                firstParent.disabled = true;
                                if(this.$store.state.viewPermission.selectAll.indexOf(item.categoryId)<0){
                                    this.$store.state.viewPermission.selectAll.push(item.categoryId)
                                }
                                
                        }
                        // console.log('sssasdasjdlkaj');
                        if(item.isAll ==false && this.$store.state.viewPermission.categoryIds.indexOf(item.categoryId) > -1){
                                //  this.$store.state.viewPermission.categoryIds.remove(item.categoryId);
                                  this.$store.state.viewPermission.selectAll.remove(item.categoryId)
                       }

                            // this.$store.state.viewPermission.platformIds
                            // 判断一级标题是否包涵搜索的关键词
                            if(_this.keywords!=='' && item.categoryName.includes(_this.keywords)){
                                _this.searchAllData.push(item)
                                 firstParent.selectedItem =true;
                            }

                        let searchKey = false;
                        if(item.children.length !== 0) {
                            // 二级菜单
                            firstParent.children = [];
                            item.children.forEach(secondItem => {
                                // 帐号
                                let secondParent ={};
                                secondParent.title = secondItem.categoryName;
                                // secondParent.accountId = secondItem.accountId;
                                // secondParent.categoryId = secondItem.categoryId;
                                secondParent.secondCategoryId = secondItem.categoryId;
                                secondParent.isAll = secondItem.isAll;
                                // 这两个要根据请求返回的值做判断
                                secondParent.selected=false;
                                secondParent.disabled =false;
                                secondParent.checked  =false;
                                secondParent.isDisabledSecond =false;
                                secondParent.selectAllValue = false;
                                if(firstParent.disabled){
                                    secondParent.disabled = true;
                                }
                                // secondParent.secondAll = 
                                // console.log('indexOfaccountIds ');
                                // 当有 二级所有显示权限 才有下面
                                if(secondItem.isAll && this.$store.state.viewPermission.categoryIds.indexOf(secondItem.categoryId) > -1){
                                    //   firstParent.selected=true;
                                    secondParent.selectAllValue = true;
                                    secondParent.disabled = true;
                                     if(this.$store.state.viewPermission.selectAll.indexOf(secondItem.categoryId)<0){
                                        this.$store.state.viewPermission.selectAll.push(secondItem.categoryId)
                                    }
                                   
                                }
                                if(secondItem.isAll ==false && this.$store.state.viewPermission.categoryIds.indexOf(secondItem.categoryId) > -1){
                                    // this.$store.state.viewPermission.categoryIds.remove(secondItem.categoryId);
                                     this.$store.state.viewPermission.selectAll.remove(secondItem.categoryId)
                                }
                                    
                                if(_this.keywords!=='' && secondItem.categoryName.includes(_this.keywords)){
                                        _this.searchAllData.push(secondItem)
                                        secondParent.selectedItem =true;
                                        // 展开一级
                                        searchKey =true;
                                        
                                }
                                    // let secondExpand =false;
                                
                                    // 店铺
                                    // thirdParent.expand =true;
                                    
                                    let secondExpand = false;
                                    if(secondItem.children.length !== 0)  {
                                            secondParent.children = [];
                                            
                                            secondItem.children.forEach(thirdItem => {
                                                let thirdParent = {};
                                                thirdParent.title = thirdItem.categoryName;
                                                thirdParent.categoryId = thirdItem.categoryId;
                                                // thirdParent.shopId = thirdItem.shopId;
                                                thirdParent.selected=false;
                                                thirdParent.disabled =false;
                                                thirdParent.checked  =false;
                                                if(secondParent.disabled){
                                                    thirdParent.disabled = true;
                                                }
                                                // 三级选中
                                                if(this.$store.state.viewPermission.categoryIds.indexOf(thirdItem.categoryId) > -1){
                                                    thirdParent.checked=true;
                                                }
                                                // 搜索关键词
                                                // thirdParent.selectedItem =false;
                                                if(_this.keywords!=='' && thirdItem.categoryName.includes(_this.keywords)){
                                                    thirdParent.selectedItem =true;
                                                    
                                                    _this.searchAllData.push(thirdItem)
                                                    
                                                    searchKey =true;
                                                    secondExpand=true;
                                                }
                                                // secondParent.expand=true;
                                                // thirdParentconsole.log(thirdParent);
                                                secondParent.children.push(thirdParent);
                                            })
                                    }
                                    secondParent.expand =true;
                                firstParent.children.push(secondParent);
                            })
                        }
                        firstParent.expand = searchKey;
                        arr.push(firstParent);
                    })
                }
                return arr;                
            },
            test2(){
                // this.search();
                this.treeData = this.getcategoryData(this.categoryData);
            },
            test3(){
            },
            getNode(){
                // console.log()
                let nodeArr = [];
                nodeArr = this.$refs.tree.getCheckedNodes()
                // 
                let categoryIds =[];
                // this.$store.state.viewPermission.categoryIds=[];
                
                // this.$store.state.viewPermission.categoryIds='';
                this.$store.state.viewPermission.categoryIds=[];
                nodeArr.forEach(item => {
                    
                    if(item.categoryId){
                        // console.log('nodeArr.forEach')
                        // categoryIds.push(item.categoryIds)
                        
                        this.$store.state.viewPermission.categoryIds.push(item.categoryId)
                    }
                })
                if(this.$store.state.viewPermission.selectAll.length>0){
                    this.$store.state.viewPermission.selectAll.forEach(selectItem => {
                        this.$store.state.viewPermission.categoryIds.push(selectItem)
                    })
                }
            },
            selectAll(val,root, node, data){
                if(val){
                    // 选中时候
                    
                    // 当选中所有的时候
                    data.disabled=true;
                    data.selected=true;
                    // 一级所有
                    if(data.firstCategoryId){
                        //   this.$store.state.viewPermission.categoryIds.push(data.firstCategoryId)
                        // this.selectedAll.push(data.firstCategoryId)
                        if(this.$store.state.viewPermission.selectAll.indexOf(data.firstCategoryId)<0){
                            this.$store.state.viewPermission.selectAll.push(data.firstCategoryId)
                        }
                        
                    }
                    // 二级所有
                    if(data.secondCategoryId){
                        // this.$store.state.viewPermission.categoryIds.push(data.secondCategoryId)
                        // this.selectedAll.push(data.firstCategoryId)
                        if(this.$store.state.viewPermission.selectAll.indexOf(data.secondCategoryId)<0){
                            this.$store.state.viewPermission.selectAll.push(data.secondCategoryId)
                        }
                    }
                    if(data.children && data.children.length !==0){
                        data.children.forEach(item => {
                            // console.log(item)
                            item.disabled = true;
                            // item.checked = true;
                            item.isDisabledSecond = true;
                            if(item.children &&item.children.length !==0){
                                item.children.forEach(childItem => {
                                    childItem.disabled =true;
                                    // childItem.checked =true;
                                    // console.log(childItem)
                                })
                            }
                        })

                    }                    
                }else{
                    // data.checked = false ;
                    // node.node.checked = false;
                    data.disabled=false;
                    data.selected =false;
                    
                    // console.log(data)
                    // 一级所有
                    if(data.firstCategoryId){
                        //  this.$store.state.viewPermission.categoryIds.push(data.firstCategoryId)
                        this.$store.state.viewPermission.categoryIds.remove(data.firstCategoryId);
                        this.selectedAll.remove(data.firstCategoryId);
                        
                        this.$store.state.viewPermission.selectAll.remove(data.firstCategoryId)
                    }
                    // 二级所有
                    if(data.secondCategoryId){
                        // this.$store.state.viewPermission.categoryIds.push(data.secondCategoryId)
                        this.$store.state.viewPermission.categoryIds.remove(data.secondCategoryId)
                        // this.selectedAll.remove(data.secondCategoryId)
                        
                         this.$store.state.viewPermission.selectAll.remove(data.secondCategoryId)
                    }
                    // 子节点 
                    if(data.children && data.children.length !==0){
                        data.children.forEach(item => {
                            // console.log(item)
                            item.disabled = false;
                            item.disabled=false;
                            // item.checked = false ;
                            item.isDisabledSecond = false;
                            if(item.children &&item.children.length !==0){
                                item.children.forEach(childItem => {
                                    childItem.disabled =false;
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
            jump(item){
                let jump = document.querySelectorAll('.jump_'+item.categoryId)
                // 获取需要滚动的距离
                    let total = jump[0].offsetTop;
                //     // Chrome
                    document.body.scrollTop = total;
                //     // Firefox
                document.documentElement.scrollTop = total
                // // Safari
                window.pageYOffset = total
            },
        },
        mounted () {
            this.$store.state.viewPermission.selectAll = [];
            console.log('this.search()ddd')
            //   window.addEventListener('scroll', this.scrollToTop)
            this.search();
            this.test2()
        }

    }
</script>
<style >
.selectedItemtrue{
    color: red;
}
</style>