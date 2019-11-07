<template>
    <div class ='common-tree'>
        <Card :bordered="false" style="width:100%">
            <p slot="title">公共配置</p>
            <Row>
                <i-col span ="12">               
                    <Input   style="width: 150px" v-model="searchValue" @on-enter="search"/>
                    <Button type="primary"  icon="ios-search" style='margin-left:5px' @click ="search"></Button>
                    <Button type="primary" style='float:right;margin-right:16px' @click ="groupAdd" v-if='getButtonPermission("permission_dictionary_groupAdd","out")' >添加分组</Button>
                    <Tree :data="roleListConfig" :render="renderContent"></Tree>
                </i-col>
                <i-col span ="12">
                    <div style="position: fixed;width: 100%;margin-left: 25px;">
                        <span id="top" v-show="searchAllData.length">一共找到 {{searchAllData.length}} 条数据</span>
                    <ul>
                        <li style="margin:8px;" v-for="(item,index,key) in searchAllData" :value="item" :key="key">
                            <a :href="'#id_'+item.id">{{item.title}}</a>
                        </li>
                    </ul>
                    </div>
                    <!-- <div  style="position: absolute;bottom: 0;right: 2px;">
                        <a :href="top"><Icon type="md-arrow-up" /></a>
                    </div> -->
                </i-col>   
            </Row>
            
        </Card>
        <Modal
        :mask-closable ='false'
        :title= modalTitl1
        v-model= model1 draggable>
                <Form ref="addList"  label-position="right" :label-width="100" :model='addList' :rules="ruleValidate">
                    <Row>
                        <FormItem label="键：" v-if="father" prop = 'key'>
                            <Input style='width:200px' v-model="addList.key"/>
                        </FormItem>
                    </Row>
                     <Row>
                        <FormItem label="键：" v-if="son" prop = 'key'>
                            <Input style='width:200px' v-model="addList.key"/>
                        </FormItem>
                    </Row>
                     <Row>
                        <FormItem label="值：" prop = 'value'>
                            <Input  style='width:200px' v-model="addList.value"/>
                        </FormItem>
                    </Row>
                     <Row>
                        <FormItem label="排序：" v-if="son" prop = 'info.index'>
                            <Input  style='width:200px' v-model="addList.info.index"/>
                            <label style="margin-left:10px;color: red">0-9999,0为排序第一</label>
                        </FormItem>
                    </Row>
                    <FormItem label="状态：" prop = 'status'>
                        <RadioGroup v-model="addList.info.status">
                            <Radio label="1">启用</Radio>
                            <Radio label="0">停用</Radio>
                        </RadioGroup>
                        
                    </FormItem>
                    <FormItem label="HTML标签：" v-if="son" prop = 'info.html'>
                        <Input type="textarea" v-model="addList.info.html"/>
                    </FormItem>
                    <FormItem label="描述：" prop = 'info.description'>
                        <Input type="textarea" v-model="addList.info.description"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="dashed" @click ="dashed">取消</Button>
                    <Button type="primary" @click ="appendChild">确认</Button>
                </div>
         </Modal>
    </div>
</template>
<script>
// import { truncate, truncateSync } from 'fs'
import {treeList,sublevelAdd,sublevelModify,groupAdd,groupModify,groupView,sublevelView,search,dictionaryDelete} from '@/api/user'
export default {
  data () {
    const  validateIndex = (rule, value, callback) => {
        let reg = /^[0-9]*$/ 
        if(value||value===0){
             if (!reg.test(value)) {
                callback(new Error('只能输入0-9999的数字'))
            }else if(value>9999){
                callback(new Error('只能输入0-9999的数字'))
            }else {
                callback()
            }
        }else{
             callback(new Error('排序不能为空'))
        }
    }
    // var self = this
    return {
        top:'',
        searchAllData:[],
        searchValue:'',
        addList:{
            id: 1,						  	  // 字典ID
            key: "",                      	  // 键值
            value: "",                   // 名称
            expand: "",                     // 是否展开
            top: "",						  // 是否顶级
            info: {							  // 信息
                index: '',				      // 排序
                status: "1",                      // 状态
                statusName: "",			  // 状态显示名
                html: "",						  // HTML标签
                description: ""	,
                top:''			  // 描述
            },
        },
        modalTitl1:'',
        father:false,
        son:false,
        model1: false,
        currentTab: '销售参谋',
        parentTitle: false,
        parentTilteValue: '',
        roleName: '',
        domValue: '',
        tab0: true,
        tab1: true,
        tab2: true,
        tab3: true,
        tab4: true,
        data2:[],
        expandArr :[],
        roleListConfig:[],
        ruleValidate:{
            key: [
                        { required: true, message: '该项不能为空', trigger: 'blur' },
                         { max: 30, message: '不能超过30个字符', trigger: 'blur' },
                    ],
            value: [
                        { required: true, message: '该项不能为空', trigger: 'blur' },
                        { max: 30, message: '不能超过30个字符', trigger: 'blur' },
                    ],
            "info.index": [
                        { required: true, message: '该项不能为空' },
                        { validator: validateIndex, trigger: 'blur' }
                        // { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    ], 
            "info.description" :[
                        { max: 100, message: '不能超过100个字符', trigger: 'blur' },
            ]
        }
    }
  },
  methods: {
    dashed(){
        this.model1 = false;
         this.$refs['addList'].resetFields();
    },
    handleTabRemove (name) {
        this['tab' + name] = false
    },
    renderContent (h, { root, node, data }) {
        var domArr = []
        var tipFlag 
        if(!data.info.description){
            tipFlag = true
        }else{
            tipFlag = false
        }
        if(data.info.statusName == "停用"){
            domArr = [
            h('Icon', {
                props: {
                type: 'ios-paper-outline',
                },
                style: {
                marginRight: '8px'
                }
            }),
            h('span', data.title),h('span',{style:{color:"red",marginLeft:"10px"}},"（停用）")
            ]
        }else{
            domArr = [
          h('Icon', {
            props: {
              type: 'ios-paper-outline',
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]
        }
        var _this = this
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        },
         attrs: {
                name: "id_"+data.id,
                id:"id_"+data.id,
                class :'common-tree'
        },
        props:{
            expand : true
        }
      }, [
          h("Tooltip",{
              props:{
                  transfer: true,
                  disabled:tipFlag,
                  placement:"right",
                  delay:600,
                  maxWidth:300
              },attrs:{
                  content:data.info.description,
              }
          },[h('span', {
             class:['jump_'+data.categoryId,"selectedItem"+data.classData],
        },
        domArr
        )])
        ,
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px',
          }
        }, [
          h('Button', {
            style: {
              marginRight: '8px',
              display:this.getButtonPermission("permission_dictionary_sublevelAdd")
            },
            on: {
              click: (e) => { 
                this.resetAddList()
                this.$refs['addList'].resetFields();
                this.father = false;
                this.son = true;
                this.modalTitl1 = '添加'
                this.expandArr = [];
                this.getExpandArr(root, node, data)
                // this.domValue = data;
                this.model1 = true;
                this.addList.id = data.id

                  }
            }
          },"添加子级"),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            style: {
              marginRight: '8px',
              display:this.modifyFlag(root, node, data)
            },
            on: {
                click: (e) => {   
                    this.model1 = true
                     this.$refs['addList'].resetFields();
                    if(data.top){
                        this.father = true;
                        this.son = false;
                        this.modalTitl1 = '修改分组'
                        let params = {
                            id : data.id
                        }
                        groupView(params).then(res=>{
                            this.addList.id = res.data.result.id;
                            this.addList.key = res.data.result.key;
                            this.addList.info.status = res.data.result.status+"";
                            this.addList.info.statusName = res.data.result.statusName;
                            this.addList.info.index = res.data.result.index;
                            this.addList.index = res.data.result.index;
                            this.addList.value = res.data.result.value;
                            this.addList.info.description = res.data.result.description;
                        })
                        // this.domValue = data;
                        // this.addList = JSON.parse( JSON.stringify(data))
                    }else{
                        this.father = false;
                        this.son = true;
                        this.expandArr=[];
                        this.getExpandArrModify(root, node, data)
                        this.modalTitl1 = '修改';
                        let params = {
                            id : data.id
                        }
                        sublevelView(params).then(res=>{
                            this.addList.id = res.data.result.id;
                            this.addList.value = res.data.result.value;
                            this.addList.key = res.data.result.key;
                            this.addList.index = res.data.result.index;
                            this.addList.info.index = res.data.result.index;
                            this.addList.info.status = res.data.result.status+"";
                            this.addList.info.statusName = res.data.result.statusName;
                            this.addList.info.html = res.data.result.html;
                            this.addList.info.description = res.data.result.description;
                        })
                    }
                    
                    
                }
            }
          },"修改"), h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            style:{
              display:this.getButtonPermission("permission_dictionary_delete")
            },
            on: {
              click: () => { this.removeApi(root, node, data) }
            }
          },'删除')
        ])
      ])
    },
    //删除确认
    removeApi(root, node, data){
      this.currentTab = data.currentTab
      this.expandArr = [];
      this.getExpandArrModify(root, node, data)
      this.$Modal.confirm({
        title: '删除',
        content: '您确认要删除吗？',
        onOk: () => {
          let params = {}
          params.id = data.id;
        //   params.userName = store.state.user.userInfo.userName;
          dictionaryDelete(params).then(res =>{
              this.getTreeList()
              this.$Message.success('操作成功!')
          })
        },
      })
    },
    append (root, node, data, e) {
      this.model1 = true
      this.parentTitle = false
      this.domValue = data
      if (node.parent === undefined//eslint-disable-line
      ) {

      } else {
        this.parentTitle = true
        for (let i = 0; i < root.length; i++) {
          if (root[i].nodeKey == node.parent//eslint-disable-line
          ) {
            this.parentTilteValue = root[i].node.title
            if (root[i].parent != undefined//eslint-disable-line
            ) {
              for (let j = 0; j < root.length; j++) {
                if (root[j].nodeKey == root[i].parent//eslint-disable-line
                ) {
                  this.parentTilteValue = root[j].node.title + '--' + this.parentTilteValue
                }
              }
            }
          }
        }
      }
      // this.$nextTick(function(){

      //     const children = data.children || [];
      //     children.push({
      //         title: 'appended node',
      //         expand: true
      //     });
      //     this.$set(data, 'children', children);
      // })
    },
    remove (root, node, data, e) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    },
    //判断分组和子类的修改权限 
    modifyFlag (root, node, data){
        if(data.top){
            return this.getButtonPermission("permission_dictionary_groupModify")
        }else{
            return this.getButtonPermission("permission_dictionary_sublevelModify") 
        }
    },
    appendChild () {
        let _this = this
        this.$refs["addList"].validate((valid) => {
            if (valid) {
               if(this.modalTitl1 =='添加'){
            //  const children = this.domValue.children || []
            // this.addList.title = this.addList.value +':'+this.addList.name;
            // this.addList.expand = true;
            // if (this.domValue) {
            //     children.push(JSON.parse(JSON.stringify(this.addList)))
            // } else {

            // }
            // this.$set(this.domValue, 'children', children)
                    const params = {
                        "pId":this.addList.id,
                        "key":this.addList.key,
                        "value":this.addList.value,
                        "index":this.addList.info.index,
                        "status":this.addList.info.status,
                        "html":this.addList.info.html,
                        "description":this.addList.info.description
                    }
                    sublevelAdd(params).then(res=>{
                        _this.getTreeList()
                        this.resetAddList()
                        this.model1 = false
                        this.$Message.success('操作成功!')
                    })
                }else if(this.modalTitl1 == '修改'){
                    const params = {
                        "id":this.addList.id,
                        "key":this.addList.key,
                        "value":this.addList.value,
                        "index":this.addList.info.index,
                        "status":this.addList.info.status,
                        "html":this.addList.info.html,
                        "description":this.addList.info.description
                    }
                    sublevelModify(params).then(res=>{
                        _this.getTreeList()
                        this.model1 = false
                        this.$Message.success('操作成功!')
                    })
                }else if(this.modalTitl1 == '添加分组'){
                    const params = {
                        "dictId":this.addList.id,
                        "key":this.addList.key,
                        "value":this.addList.value,
                        // "index":this.addList.info.index,
                        "status":this.addList.info.status,
                        // "html":this.addList.info.html,
                        "description":this.addList.info.description
                    }
                    groupAdd(params).then(res=>{
                        _this.getTreeList()
                        this.resetAddList()
                        this.model1 = false
                        this.$Message.success('操作成功!')
                    })
                }else if(this.modalTitl1 == '修改分组'){
                    const params = {
                        "id":this.addList.id,
                        "value":this.addList.value,
                        "key":this.addList.key,
                        // "index":this.addList.info.index,
                        "status":this.addList.info.status,
                        "description":this.addList.info.description
                    }
                    groupModify(params).then(res=>{
                        _this.getTreeList()
                        this.resetAddList()
                        this.model1 = false
                        this.$Message.success('操作成功!')
                    })
                }
                
            }else{
                // this.$Message.error('请填写完整的信息!');
            }
        })
        
    },
    configTreeList(arr1,string){
        for(let i = 0;i<arr1.length;i++){
            let expandValue = false;
            arr1[i].title = arr1[i].key+":"+arr1[i].value;
            if(this.expandArr.includes(arr1[i].id)){
                 arr1[i].expand = true
            }else{
                arr1[i].expand = false;
            }
            arr1[i].classData = arr1[i].title.includes(string)        
            if(arr1[i].children){
                this.configTreeList(arr1[i].children,string)
                
            }
        } 
    },
    getExpandArr(root, node, data){
        // console.log(root);
        // console.log(node);
        console.log(data)
        this.expandArr.push(data.id)
        if(node.parent||node.parent==0){
            for(let i = 0;i<root.length;i++){
                if(root[i].nodeKey == node.parent){
                    // this.expandArr.push(root[i].node.id)
                    this.getExpandArr(root,root[i],root[i].node)
                }
            }
        }
    },
    getExpandArrModify(root, node, data){
        if(node.parent||node.parent==0){
            for(let i = 0;i<root.length;i++){
                if(root[i].nodeKey == node.parent){
                    this.expandArr.push(root[i].node.id)
                    this.getExpandArrModify(root,root[i],root[i].node)
                }
            }
        }
    },
    getcategoryData(tree){
        let _this = this;
        _this.searchAllData =[];
        let arr = [];
        if (tree.length !== 0) {
            // 恶心的部分
            tree.forEach(item => {
                    let firstParent ={};
                    firstParent.title = item.name+item.value;
                    firstParent.name = item.name;
                    firstParent.value = item.value;
                    firstParent.top = item.top;
                    firstparent.info = item.info;
                let searchKey = false;
                if(item.children.length !== 0) {
                    // 二级菜单
                    firstParent.children = [];
                    item.children.forEach(secondItem => {
                        let secondParent ={};
                        secondParent.title = secondItem.name+secondItem.value;
                        secondParent.name = secondItem.name;
                        secondParent.value = secondItem.value;
                        secondParent.top = secondItem.top;
                        secondParent.info = secondItem.info;                            
                        if(_this.keywords!=='' && secondItem.title.includes(_this.keywords)){
                            searchKey =true;                                
                        } 
                        let secondExpand = false;
                        if(secondItem.children.length !== 0) {
                                secondParent.children = [];
                                secondItem.children.forEach(thirdItem => {
                                    let thirdParent = {};
                                    thirdParent.title = thirdItem.name+thirdItem.value;
                                    thirdParent.name = secondItem.name;
                                    thirdParent.value=secondItem.value;
                                    thirdParent.top =secondItem.top;
                                    thirdParent.info  =secondItem.info;
                                    
                                    if(_this.keywords!=='' && thirdItem.title.includes(_this.keywords)){
                                        // _this.searchAllData.push(thirdItem) 
                                        searchKey =true;
                                        secondExpand=true;
                                    }
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
    groupAdd(){
        this.model1 = true;
        this.modalTitl1 = '添加分组'
        this.$refs['addList'].resetFields();
        this.father = true;
        this.son = false;
    },
    // addListReset(){
    //     this.addList = {
    //         id: "",						  	  // 字典ID
    //         value: "",                      	  // 键值
    //         key: "",                   // 名称
    //         expand: "",                     // 是否展开
    //         top: "",							  // 是否顶级
    //         info: {							  // 信息
    //             index: "",				      // 排序
    //             status: "",                      // 状态
    //             statusName: "",			  // 状态显示名
    //             html: "",						  // HTML标签
    //             description: ""				  // 描述
    //         },
    //     }
    // },
    getTreeList(string,idArr){
        treeList().then(res =>{
          let roleList
          roleList = res.data.result.list
          this.configTreeList(roleList,string)
          this.roleListConfig = roleList
          if(string){
              this.searchAllData = []
              this.searchExpand(this.roleListConfig,idArr,string)
          }
      })
    },
    resetAddList(){
        this.addList = {
            id: 1,						  	  // 字典ID
            value: "",                      	  // 键值
            key: "",                   // 名称
            expand: "",                     // 是否展开
            top: "",							  // 是否顶级
            info: {							  // 信息
                index: "",				      // 排序
                status: "1",                      // 状态
                statusName: "",			  // 状态显示名
                html: "",						  // HTML标签
                description: ""	,
                top:''			  // 描述
            }
        }
    },
    searchExpand(arr,expandList,searchValue){
        if(expandList&&expandList.length>0){
            for(let i = 0;i<arr.length;i++){
                let expandValue = false;
                if(arr[i].title.includes(searchValue.trim())){
                    this.searchAllData.push(arr[i])
                }
                if(expandList.includes(arr[i].id)){
                arr[i].expand = true;
                //    this.searchAllData.push(arr[i])
                    // for(let j = 0;j<arr[i].children.length;j++){
                    //     if(arr[i].children[j].title.includes(searchValue)){
                    //         this.searchAllData.push(arr[i].children[j])
                    //     }
                    // }
                    this.searchExpand(arr[i].children,expandList,searchValue) 
                }else{
                    arr[i].expand = false;
                }
            }
        }else{
            for(let i = 0;i<arr.length;i++){
                let expandValue = false;
                if(arr[i].title.includes(searchValue.trim())){
                    this.searchAllData.push(arr[i])
                }
            }
        }
    },
    search(){
        this.expandArr = [];
        this.searchAllData = [];
        if(this.searchValue){
            let params = {
                searchContent :this.searchValue.trim()
            }
            search(params).then(res =>{
                this.getTreeList(this.searchValue.trim(),res.data.result.ids)
                // this.searchExpand(this.roleListConfig,res.data.result.ids,this.searchValue)
            })
            
        }else{
            this.getTreeList() 
        }
    },
    getButtonPermission(htmlId,flag){
        let htmlIdArr = [];
        for(var key in this.$store.state.user.userHtmlIds.ptxPermission){
            
            htmlIdArr.push(key)
        }
        if(htmlIdArr.indexOf(htmlId)>=0&&!this.$store.state.user.userHtmlIds.ptxPermission[htmlId]){
                if(flag == 'out'){
                    return false
                }else{
                    return "none"
                }
        }else{
            return true
        }
    }
  },
  mounted() {
    this.getTreeList();
  },
}
</script>
<style>
.selectedItemtrue{
    color: red;
}
.common-tree .ivu-tree ul{line-height: 32px}
.common-tree .ivu-tree ul li{border-bottom: 1px dashed #ddd;padding-bottom: 0px;margin-bottom:0px !important;margin-top: 0px}
.common-tree .ivu-tree ul li span{margin-bottom: 2px;margin-top: 2px}
.common-tree .ivu-tree ul li ul:last-child li{border-bottom: none}
.common-tree .ivu-tree ul li ul:first-of-type{border-top: 1px dashed #ddd}
</style>
