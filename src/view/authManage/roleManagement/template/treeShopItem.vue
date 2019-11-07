<template>
    
    <div>
        <Tree :data="treeData" show-checkbox :render="renderContent" ref="tree"></Tree>
         <!-- <Button type="primary" @click="test()">测试</Button>
         <Button type="primary" @click="getNode()">过去所有选中节点</Button> -->
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
        props:["shopData"],

        data () {
            return {
                shopDataTree:this.shopData,
                treeData:[],
            }
        },
        methods: {
           
            renderContent(h, { root, node, data }){
                let _this = this;
                if(data.children ||node.node.title=="Wish" ||node.node.title=="Ebay"){
                    // 根据当前所有选择的是否显示
                    // node.node.isAll = false;
                    let isShow=node.node.isAll==true?"inline-block":"none";
                    let selectAllValue = node.node.selectAllValue;
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
                                }),h('span', "所有")
                            ])
                    ]);
                }else{
                    let isShow=node.node.isAll==true?"inline-block":"none";
                    let selectAllValue = node.node.selectAllValue;
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
                                }),h('span', "所有")
                            ])
                          
                    ]);
                }
                
            },
            getShopData(tree = []){
                let arr = [];
                if (tree.length !== 0) {
                    // 恶心的部分
                    tree.forEach(item => {
                         let firstParent ={};
                        //  console.log(item);
                         firstParent.title = item.platformCode;
                         firstParent.platformId = item.platformId;
                         firstParent.isAll = item.isAll;
                         // 这两个要根据请求返回的值做判断
                            firstParent.selected=false;
                            firstParent.disabled =false;
                            firstParent.checked  =false;
                            firstParent.isDisabledSecond =false;
                             firstParent.selectAllValue = false;
                            
                            // 根据判断是否有所有权限
                            // 当有二级所有 才有下面
                            // console.log()
                            if(this.$store.state.viewPermission.platformIds ){
                                // console.log("this.$store.state.viewPermission")
                                // console.log(this.$store.state.viewPermission)
                            }
                        if(item.isAll && this.$store.state.viewPermission.platformIds ){
                            //   firstParent.selected=true;
                            //  console.log("this.$store.state.viewPermission")
                                // console.log(this.$store.state.viewPermission)
                            if( this.$store.state.viewPermission.platformIds.indexOf(item.platformId) > -1){
                                firstParent.selectAllValue = true;
                                firstParent.disabled = true;
                            }
                               
                                
                        }

                        if(item.isAll ==false && this.$store.state.viewPermission.platformIds ){
                            if(this.$store.state.viewPermission.platformIds.indexOf(item.platformId) > -1){
                                this.$store.state.viewPermission.platformIds.remove(item.platformId);
                            }
                              
                                  
                       }

                            // this.$store.state.viewPermission.platformIds
                            // secondParent.isAll = secondItem.isAll;
                        if(item.accounts.length !== 0) {
                            // 二级菜单
                            firstParent.children = [];
                            item.accounts.forEach(secondItem => {
                                // 帐号
                                let secondParent ={};
                                secondParent.title = secondItem.accountCode;
                                secondParent.accountId = secondItem.accountId;
                                secondParent.isAll = secondItem.isAll;
                                // 这两个要根据请求返回的值做判断
                                secondParent.selected=false;
                                secondParent.disabled =false;
                                secondParent.checked  =false;
                                secondParent.isDisabledSecond =false;
                                secondParent.selectAllValue = false;
                                // secondParent.secondAll = 
                                // console.log('indexOfaccountIds ');
                                // 当有 二级所有显示权限 才有下面
                                if(secondItem.isAll && this.$store.state.viewPermission.accountIds ){
                                    //   firstParent.selected=true;
                                    if(this.$store.state.viewPermission.accountIds.indexOf(secondItem.accountId) > -1){
                                        secondParent.selectAllValue = true;
                                        secondParent.disabled = true;
                                    }
                                    
                                }
                                if(secondItem.isAll ==false && this.$store.state.viewPermission.accountIds ){
                                    if(this.$store.state.viewPermission.accountIds.indexOf(secondItem.accountId) > -1){
                                        this.$store.state.viewPermission.accountIds.remove(secondItem.accountId);
                                    }
                                    
                                }

                                firstParent.children.push(secondParent);
                                    // 店铺
                                    if(secondItem.shops.length !== 0) {
                                            secondParent.children = [];
                                            secondItem.shops.forEach(thirdItem => {
                                                let thirdParent = {};
                                                thirdParent.title = thirdItem.shopCode;
                                                thirdParent.shopId = thirdItem.shopId;
                                                thirdParent.selected=false;
                                                thirdParent.disabled =false;
                                                thirdParent.checked  =false;
                                                // 三级选中
                                                if(this.$store.state.viewPermission.shopIds.indexOf(thirdItem.shopId) > -1){
                                                    thirdParent.checked=true;
                                                }
                                                secondParent.children.push(thirdParent);
                                            })
                                    }
                            })
                        }
                        arr.push(firstParent);
                    })
                }
                // console.log('arr')
                // console.log(arr)
                return arr;                
            },
            test(){
                
               
                // console.log(this.shopData)
                // this.treeData
                this.treeData = this.getShopData(this.shopData);
                // console.log(this.treeData)
                // this.getShopData(this.shopDataTree);
            },
            getNode(){
                // console.log()
                let nodeArr = [];
                nodeArr = this.$refs.tree.getCheckedNodes()
                // 
                let shopIds =[];
                this.$store.state.viewPermission.shopIds=[];
                nodeArr.forEach(item => {
                    if(item.shopId){
                        shopIds.push(item.shopId)
                    }
                })
                
                this.$store.state.viewPermission.shopIds = shopIds;
                // console.log(this.$refs.tree.getCheckedNodes())
            },
            selectAll(val,root, node, data){
                if(val){
                    // 选中时候

                    // 当选中所有的时候
                    data.disabled=true;
                    data.selected=true;
                    // 一级所有
                    if(data.platformId){
                        this.$store.state.viewPermission.platformIds.push(data.platformId);
                    }
                    // 二级所有
                    if(data.accountId){
                        this.$store.state.viewPermission.accountIds.push(data.accountId)
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
                    if(data.platformId){
                        this.$store.state.viewPermission.platformIds.remove(data.platformId);
                    }
                    // 二级所有
                    if(data.accountId){
                        this.$store.state.viewPermission.accountIds.remove(data.accountId)
                    }
                    console.log(this.$store.state.viewPermission.accountIds)
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
                
            }
            
        },
        mounted () {
            // console.log(this.$refs.tree.getCheckedNodes())
            // console.log(' this.test();')
            this.test();
            
        }
    }
</script>
<style >
.my-class{
    
}
    
</style>