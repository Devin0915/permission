<template>
    <div class = "common-tree">
        <Card :bordered="false" style="width:100%">
          <p slot="title">功能权限管理</p>
        <Tabs type="card"  @on-click="clickTab" :animated = false>
          
            <!-- <TabPane v-for="(item1,key1) in apiListData" :key="key1" v-bind:label="key1" v-if="tab0" > -->
               <TabPane v-for="(item1,key1,index) in apiListData" :key="key1" v-bind:label="key1" :index='index'>
                <!-- <Tree :data="data1" :render="renderContent"></Tree> -->
                <Card :bordered="false" style="width:100%">
                    <Row>
                        <i-col span ="12">
                          <Input   style="width: 150px" v-model="searchValue" @on-enter="search(item1.code,key1)"/>
                          <Button type="primary"  icon="ios-search" style='margin-left:5px' @click ="search(item1.code,key1)"></Button>
                          <Button type="primary" style='float:right;margin-right:16px' @click ="groupAdd(item1.code)" v-if='getButtonPermission("permission_apiAction_addAction","out")'>添加一级菜单</Button>
                          <Tree :data="item1.list" :render="renderContent"></Tree>
                        </i-col>
                        <i-col span ="12">
                            <div style="position: fixed;width: 100%;margin-left: 25px;">
                                <span id="top" v-show="searchAllData.length">一共找到 {{searchAllData.length}} 条数据</span>
                            <ul>
                                <li style="margin:8px;" v-for="(item,index,key) in searchAllData" :value="item" :key="key">
                                    <a :href="'#id_'+item.actionId">{{item.title}}</a>
                                </li>
                            </ul>
                            </div>
                            <!-- <div  style="position: absolute;bottom: 0;right: 2px;">
                                <a :href="top"><Icon type="md-arrow-up" /></a>
                            </div> -->
                        </i-col>
                    </Row>
                    
                </Card>
            </TabPane>
        </Tabs>
        <!-- <li v-for="(item, key, index) in items" class="animate" v-bind:key="item.id">{{item.keys}}</li> -->
        <Modal
        title="添加菜单"
        v-model= 'model1'
        :mask-closable ='false'
         @on-ok="appendChild" draggable>
                <Row>
                    <label  style="float:left;width: 90px;text-align: right;">
                        系统：
                    </label>
                    <label style="margin-left: 10px">
                        {{currentTab}}
                    </label>
                </Row>
                <br/>
                <Row  v-if = 'parentTitle'>
                    <label  style="float:left;width: 90px;text-align: right;">
                        上级菜单：
                    </label>
                    <label style="margin-left: 10px">
                        {{parentTilteValue}}
                    </label>
                </Row>
                <br/>
                <!-- <Row>
                     <Form ref="addList"  label-position="right" :model='addList' :rules="ruleValidateAddList">
                        <div style='display: inline-block;float: right;width: 460px;'>
                          <Row style="margin-bottom: 5px;">
                             <FormItem label = "角色名称:" prop ="name">
                                <Input   style="width: 300px;" v-model="addList.name" />
                                <Button type="primary" icon="md-add" @click="addRoleName" style=';margin-right:16px;margin-left:15px;width:32px;margin-left: 15px;padding-left: 9px;'></Button>
                            </FormItem>
                          </Row>
                        </div>
                    </Form>
                         <div style='display: inline-block;float: right;width: 386px;'>
                          <Row style="margin-bottom: 5px;"  v-for="(item,key) in nameArr" :key='key'>
                              <Input   style="width: 300px;" v-model="nameArr[key].name" />
                              <Button type="error" @click="delectRoleName(key)" icon="md-remove" style="margin-right:16px;margin-left:15px;width:32px;margin-left: 15px;padding-left: 9px;"></Button>
                          </Row>
                         </div>
                </Row> -->
                <Row>
                      <Row :gutter = '16'>
                        <i-col span ="9" style='text-align: center'>
                          <label>名称</label>
                        </i-col>
                        <i-col span ="9" style='text-align: center'>
                          <label>htmlId</label>
                        </i-col>
                      </Row>
                      <Row :gutter = '16' > 
                        <Form ref="addList"  label-position="right" :model='addList' :rules="ruleValidateAddList" class="common_form">
                            <i-col span ="9" style='text-align: center'>
                               <FormItem prop ="name" style="margin-bottom:1px">
                                  <Input v-model="addList.name"/>
                               </FormItem>
                            </i-col>
                            <i-col span ="9" style='text-align: center'>
                              <FormItem prop ="htmlId" style="margin-bottom:1px">
                                   <Input v-model="addList.htmlId"/>
                               </FormItem>
                            </i-col>
                            <i-col span ="6" style='text-align: center'>
                              <Button type="primary" icon="md-add" @click="addRoleName" style='margin-right:16px;margin-left:15px;width:32px;margin-left: 15px;padding-left: 9px;'></Button>
                            </i-col>
                        </Form>
                      </Row>
                      <Row style = 'margin-top: 5px' v-for="(item,key) in nameArr" :key='key' :gutter = '16'>
                        <Form ref="nameArr" :rules="ruleValidateAddListConf" class="common_form"  :model='nameArr[key]'>
                        <i-col span ="9" style='text-align: center'>
                            <FormItem prop ="name" style="margin-bottom:1px">
                               <Input v-model="nameArr[key].name"/>
                            </FormItem>
                           <!-- <Input  v-model="nameArr[key].name"/> -->
                        </i-col>
                        <i-col span ="9" style='text-align: center'>
                          <FormItem prop ="htmlId" style="margin-bottom:1px">
                               <Input v-model="nameArr[key].htmlId"/>
                            </FormItem>
                          <!-- <Input v-model="nameArr[key].htmlId"/> -->
                        </i-col>
                        <i-col span ="6" style='text-align: center'>
                           <Button type="error" icon="md-remove" @click="delectRoleName(key)" style=';margin-right:16px;margin-left:15px;width:32px;margin-left: 15px;padding-left: 9px;'></Button>
                        </i-col>
                        </Form>
                      </Row>
                </Row>
                 <div slot="footer">
                  <Button type="dashed" @click ="dashed">取消</Button>
                  <Button type="primary" @click ="appendChild">确认</Button>
                </div>
         </Modal>
         <Modal
        title="添加菜单"
        :mask-closable ='false'
        v-model= 'model3'
        :width = '900' draggable>
                <Row>
                    <label  style="float:left;width: 90px;text-align: right;">
                        系统：
                    </label>
                    <label style="margin-left: 10px">
                        {{currentTab}}
                    </label>
                </Row>
                <br/>
                <Row  v-if = 'parentTitle'>
                    <label  style="float:left;width: 90px;text-align: right;">
                        上级菜单：
                    </label>
                    <label style="margin-left: 10px">
                        {{parentTilteValue}}
                    </label>
                </Row>
                <br/>
                <Row>
                      <Row :gutter = '16'>
                        <i-col span ="4" style='text-align: center'>
                          <label>名称</label>
                        </i-col>
                        <i-col span ="12" style='text-align: center'>
                          <label>URL</label>
                        </i-col>
                        <i-col span ="5" style='text-align: center'>
                          <label>htmlId</label>
                        </i-col>
                      </Row>
                      <Row :gutter = '16'> 
                        <Form ref="addListSec"  label-position="right" :model='addListSec' :rules="ruleValidateAddList" class="common_form">
                            <i-col span ="4" style='text-align: center'>
                               <FormItem prop ="name"  style="margin-bottom:1px">
                                  <Input v-model="addListSec.name"/>
                               </FormItem>
                            </i-col>
                            <i-col span ="12" style='text-align: center'>
                              <!-- <Input v-model="addListSec.url"/> -->
                               <FormItem prop ="url"  style="margin-bottom:1px">
                                  <Input v-model="addListSec.url"/>
                               </FormItem>
                            </i-col>
                            <i-col span ="5" style='text-align: center'>
                              <!-- <Input v-model="addListSec.htmlId"/> -->
                              <FormItem prop ="htmlId"  style="margin-bottom:1px">
                                  <Input v-model="addListSec.htmlId"/>
                               </FormItem>
                            </i-col>
                            <i-col span ="3" style='text-align: center'>
                              <Button type="primary" icon="md-add" @click="addRoleNameSec" style=';margin-right:16px;margin-left:15px;width:32px;margin-left: 15px;padding-left: 9px;'></Button>
                            </i-col>
                        </Form>
                      </Row>
                      <Row style = 'margin-top: 5px' v-for="(item,key) in nameArrSec" :key='key' :gutter = '16'>
                         <Form ref="nameArrSec" :rules="ruleValidateAddListConf" class="common_form"  :model='nameArrSec[key]'>
                            <i-col span ="4" style='text-align: center'>
                              <!-- <Input  v-model="nameArrSec[key].name"/> -->
                              <FormItem prop ="name" style="margin-bottom:1px">
                                <Input v-model="nameArrSec[key].name"/>
                              </FormItem>
                            </i-col>
                            <i-col span ="12" style='text-align: center'>
                              <!-- <Input v-model="nameArrSec[key].url"/> -->
                              <FormItem prop ="url" style="margin-bottom:1px">
                                <Input v-model="nameArrSec[key].url"/>
                              </FormItem>
                            </i-col>
                            <i-col span ="5" style='text-align: center'>
                              <!-- <Input v-model="nameArrSec[key].htmlId"/> -->
                              <FormItem prop ="htmlId" style="margin-bottom:1px">
                                <Input v-model="nameArrSec[key].htmlId"/>
                              </FormItem>
                            </i-col>
                            <i-col span ="3" style='text-align: center'>
                              <Button type="error" icon="md-remove" @click="delectRoleNameSec(key)" style=';margin-right:16px;margin-left:15px;width:32px;margin-left: 15px;padding-left: 9px;'></Button>
                            </i-col>
                         </Form>
                      </Row>
                </Row>
                 <div slot="footer">
                  <Button type="dashed" @click ="dashed">取消</Button>
                  <Button type="primary" @click ="appendChildSec">确认</Button>
                </div>
         </Modal>
         <Modal
        title="查看"
        v-model= 'model2'
        :mask-closable ='false'
         :closable="false" draggable>
                <Row>
                    <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        系统：
                    </label>
                    <label style="margin-left: 5px" >{{domInfo.systemname}}</label>
                </Row>
                <Row>
                    <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        上级菜单：
                    </label>
                    <label style="margin-left: 5px" >{{domInfo.father}}</label>
                </Row>
                <Row>
                    <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        名称：
                    </label>
                    <label style="margin-left: 5px" >{{domInfo.name}}</label>
                </Row>
                <Row>
                    <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        创建人：
                    </label>
                    <label style="margin-left: 5px" >{{domInfo.createdBy}}</label>
                </Row>
                <Row>
                   <i-col span ="12">
                      <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                          创建时间：
                      </label>
                      <label style="margin-left: 5px" >{{domInfo.createdAt}}</label>
                    </i-col>
                    <i-col span ="12">
                      <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        更新时间：
                      </label>
                      <label style="margin-left: 5px" >{{domInfo.updatedAt}}</label>
                    </i-col>
                </Row>
                <Row>
                    <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        url：
                    </label>
                    <label style="margin-left: 5px;">{{domInfo.url}}</label>
                </Row>
                <Row>
                    <label  style="float:left;width: 75px;text-align: right;font-size: 14px;font-weight: bold;margin-bottom: 5px;">
                        htmlId：
                    </label>
                    <label style="margin-left: 5px;">{{domInfo.htmlId}}</label>
                </Row>
         </Modal>
          <Modal
        title="修改"
        v-model= 'model4'
        :mask-closable ='false' draggable>
                <Row>
                    <label  style="float:left;width: 90px;text-align: right;">
                        系统：
                    </label>
                    <label style="margin-left: 12px">
                        {{currentTab}}
                    </label>
                </Row>
                <br/>
                <Row  v-if ='parentTitleModif'>
                  <label  style="float:left;width: 90px;text-align: right;">
                      上级菜单：
                  </label>
                  <label style="margin-left: 12px">
                      {{parentTilteValue}}
                  </label>
                </Row>
                <br/>
                <Row>
                  <i-col span ="24" style='text-align: left'>
                    <Form ref="addListModify"  label-position="right" :model='addListModify' :rules="ruleValidateAddList" :label-width="102" @keydown.native.enter.prevent ="searchHandle" class="common_form">
                      <FormItem label = '名称：' prop ="name">
                          <Input v-model="addListModify.name"/>
                      </FormItem>
                        <FormItem label = 'URL：' prop ="url" v-if ='parentTitleModifUrl'>
                          <Input v-model="addListModify.url"/>
                      </FormItem>
                       <FormItem label = 'htmlId：' prop ="htmlId">
                          <Input v-model="addListModify.htmlId"/>
                      </FormItem>
                    </Form>
                  </i-col>
                </Row>
                <br/>
                <Row>
                    <label  style="float:left;width: 90px;text-align: right;">
                        状态：
                    </label>
                    <RadioGroup v-model='statuModiy' style="margin-left :12px">
                          <Radio label="1">启用</Radio>
                          <Radio label="0">停用</Radio>
                    </RadioGroup>
                </Row>
                <div slot="footer">
                  <Button type="dashed" @click ="dashed">取消</Button>
                  <Button type="primary" @click ="modifyChild">确认</Button>
                </div>
         </Modal>
        </Card>
    </div>
    
</template>
<script>
import {AddAction,ModifyAction,ApiActionList,ApiActionDetails,DeleteAction,actionSearch} from '@/api/user'
import store from '@/store'
export default {
  data () {
   const  validateUrl = (rule, value, callback) => {
        let reg = /^\// 
        if(value){
          if (!reg.test(value)) {
            callback(new Error('url必须以“/”开头'))
          }else {
              callback()
          }
        }else{
            callback()
        }
        
    }
    // var self = this
    return {
      top:'',
      expandArr:[],
      searchAllData:[],
      previousId:'',
      searchValue:'',
      statuModiy:'1',
      parentTitleModif:false,
      parentTitleModifUrl:false,
      model4:false,
      addNameSec:'',
      addUrlSec:'',
      addList:{
        name:'',
      },
      nameArr:[
          {name:''},
      ],
      addListSec:{
        name:"",
        url:"",
        htmlId :""
      },
      nameArrSec:[{
        name:'',
        url:'',
        htmlId :""
      }],
      domInfo:{
          systemname:'',
          father:'',
          name:'',
          createdBy:'',
          createdAt:'',
          updatedAt:'',
          url:''
      },
      addListModify:{
        name:'',
        url:'',
        htmlId:''
      },
      model2:false,
      model3:false,
      searchValue:'',
      apiListData:"",
      model1: false,
      currentTab: '',
      currentCode:'',
      parentTitle: false,
      parentTilteValue: '',
      roleName: '',
      domValue: '',
      tab0: true,
      tab1: true,
      tab2: true,
      tab3: true,
      tab4: true,
      ruleValidateAddList:{
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 32, message: '不能超过32个字符', trigger: 'blur' }
        ],
        htmlId:[
          { max: 100, message: '不能超过100个字符', trigger: 'blur' }
        ],
        url:[
          { max: 100, message: '不能超过100个字符', trigger: 'blur' },
          // { validator: validateUrl, trigger: 'blur' }
        ]
      },
      ruleValidateAddListConf:{
        name: [
                { max: 32, message: '不能超过32个字符', trigger: 'blur' }
              ],
        htmlId:[
          { max: 100, message: '不能超过100个字符', trigger: 'blur' }
        ],
        url:[
          { max: 100, message: '不能超过100个字符', trigger: 'blur' },
          // { validator: validateUrl, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    clickTab (name) {
      this.currentTab = Object.keys(this.apiListData)[name];
      var apiListDataTiltArr = []
      for(var key in this.apiListData){
        apiListDataTiltArr.push(this.apiListData[key].code)
      }
      this.currentCode = apiListDataTiltArr[name]
      this.searchAllData = []
      this.searchValue = '';
      this.getTreeList()
    },
    renderContent (h, { root, node, data }) {
      var domArr = []
        if(!data.status){
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
      if(data.level<3){
        return h('span', {
        class:['jump_'+data.actionId,"selectedItem"+data.classData],
        style: {
          display: 'inline-block',
          width: '100%',
          // color:"red"
        },
        attrs: {
                name: "id_"+data.actionId,
                id:"id_"+data.actionId
        },
      }, [
        h('span', domArr),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px',
              display:this.getButtonPermission("permission_apiAction_addAction")
            },
            on: {
              click: (e) => { this.append(root, node, data) }
            }
          },'添加子菜单'),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.apiActionmodfiy(root, node, data) }
            },
            style: {
              marginRight: '8px',
              display:this.getButtonPermission("permission_apiAction_modifyAction")
            },
          },'修改'),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            style:{
              display:this.getButtonPermission("permission_apiAction_deleteAction")
            },
            on: {
              click: () => { this.removeApi(root, node, data) }
            }
          },'删除')
        ])
      ])  
      }else if(data.level == 3){
         return h('span', {
        class:['jump_'+data.actionId,"selectedItem"+data.classData],
        style: {
          display: 'inline-block',
          width: '100%'
        },
        attrs: {
                name: "id_"+data.actionId,
                id:"id_"+data.actionId
        },
      }, [
        h('span', domArr),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px',
              width:"111.34px",
              display:this.getButtonPermission("permission_apiAction_apiActionDetails")
            },
            on: {
              click: () => { this.getDomInfo(root, node, data)}
            }
          },'查看'),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.apiActionmodfiy(root, node, data) }
            },
            style: {
              marginRight: '8px',
              display:this.getButtonPermission("permission_apiAction_modifyAction")
            },
          },'修改'),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            style:{
              display:this.getButtonPermission("permission_apiAction_deleteAction")
            },
            on: {
              click: () => { this.removeApi(root, node, data) }
            }
          },'删除')
        ])
      ])
      }
     
    },
    addRoleName (){
      this.nameArr.push({'name':''})
    },
    addRoleNameSec(){
      this.nameArrSec.push({
        "name":'',
        "url": "" ,
        "htmlId" : ""    })
    },
    delectRoleName(key){
       this.nameArr.splice(key,1);
    },
    delectRoleNameSec(key){
      this.nameArrSec.splice(key,1)
    },
    append (root, node, data) {
      this.$refs['addList'].resetFields()
      this.$refs['addListSec'].resetFields()
      this.$refs['nameArr'][0].resetFields()
      this.$refs['nameArrSec'][0].resetFields()
      this.restinfo()
      this.currentTab = data.currentTab;
      this.currentCode = data.currentCode;
      this.previousId = data.actionId;
      this.expandArr = [];
      this.getExpandArr(root, node, data)
      if(data.level==1){
        this.model1 = true
      }else{
        this.model3 = true
      }
        this.domValue = data
        this.parentTitle = true
        this.parentTilteValue = ''
        if(!node.parent){
          this.parentTilteValue = data.title
        }
        for (let i = 0; i < root.length; i++) {
          if (root[i].nodeKey == node.parent//eslint-disable-line
          ) {
            this.parentTilteValue = root[i].node.title+'--'+data.title 
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
      
    },
    remove (root, node, data, e) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    },
    appendChild () {
      this.$refs["addList"].validate((valid) => {
        if(valid){
          let parmas = {}
          
          if(!this.previousId){
            let arr1 = JSON.parse(JSON.stringify(this.nameArr))
            let arr2 = this.addList
            arr1.push(arr2)
            parmas.systemName = this.currentCode;
            parmas.addInfo = arr1;
            parmas.userName = store.state.user.userInfo.userName
          }else{
            let arr1 = JSON.parse(JSON.stringify(this.nameArr))
            let arr2 = this.addList
            arr1.push(arr2)
            parmas.systemName = this.currentCode;
            parmas.addInfo = arr1;
            parmas.previousId = this.previousId
            parmas.userName = store.state.user.userInfo.userName
          }
          AddAction(parmas).then(res=>{
            this.previousId = ""  
            this.model1= false
            this.getTreeList()
            this.$Message.success('操作成功!')
            this.searchAllData = []
            this.searchValue = '';
          })
        }  
      })
    },
    appendChildSec(){
       this.$refs["addListSec"].validate((valid) => {
         if(valid){
            let parmas = {}
            let arr1 = JSON.parse( JSON.stringify(this.nameArrSec))
            let arr2 = this.addListSec
            arr1.push(arr2)
            parmas.systemName = this.currentCode;
            parmas.addInfo = arr1;
            parmas.previousId = this.previousId;
            parmas.userName = store.state.user.userInfo.userName;
            AddAction(parmas).then(res=>{
              this.previousId = ""  
              this.model3 = false
              this.getTreeList()
              this.$Message.success('操作成功!')
              this.searchAllData = []
              this.searchValue = '';
            })
         }
       })
        
    },
    modifyChild(){
       this.$refs["addListModify"].validate((valid) => {
         if(valid){
            let params = {}
            params.actionId = this.previousId;
            params.name = this.addListModify.name;
            params.status = this.statuModiy;
            params.url = this.addListModify.url;
            params.htmlId = this.addListModify.htmlId;
            params.userName = store.state.user.userInfo.userName;
            ModifyAction(params).then(res =>{
                this.previousId = ""  
                this.model4 = false
                this.getTreeList()
                this.$Message.success('操作成功!')
                this.searchAllData = []
                this.searchValue = '';
            })
          }else{
            
          }
       })
      
    },
    removeApi(root, node, data){
      this.currentCode = data.currentCode
      this.expandArr = [];
      this.getExpandArrModify(root, node, data)
      this.$Modal.confirm({
        title: '删除',
        content: '您确认要删除吗？',
        onOk: () => {
          let params = {}
          params.actionId = data.actionId;
          params.userName = store.state.user.userInfo.userName;
          DeleteAction(params).then(res =>{
              this.previousId = ""  
              this.getTreeList()
              this.$Message.success('操作成功!')
              this.searchAllData = []
              this.searchValue = '';
          })
        },
      })
    },
    getTreeList(string,idsArr){
      let _this = this
      let params = {
        "platformCode" : ""
      }
      ApiActionList(params).then(res=>{
        _this.configTreeListObj(res.data.result.actions,string)
        _this.apiListData = res.data.result.actions;
        Object.keys( _this.apiListData).forEach(function(key){
            if(_this.apiListData[key].list.length>0){
              for(var i = 0;i<_this.apiListData[key].list.length>0;i++){
                _this.apiListData[key].list[i].currentTab = key;
                _this.apiListData[key].list[i].currentCode = _this.apiListData[key].code;
                  if(_this.expandArr.includes(_this.apiListData[key].list[i].actionId)){
                    _this.apiListData[key].list[i].expand = true;
                  }else{
                    _this.apiListData[key].list[i].expand = false;
                  }
                if(_this.apiListData[key].list[i].children.length>0){
                  for(var j = 0;j<_this.apiListData[key].list[i].children.length;j++){
                    _this.apiListData[key].list[i].children[j].currentTab = key
                    _this.apiListData[key].list[i].children[j].currentCode = _this.apiListData[key].code
                         if(_this.expandArr.includes(_this.apiListData[key].list[i].children[j].actionId)){
                            _this.apiListData[key].list[i].children[j].expand = true;
                          }else{
                            _this.apiListData[key].list[i].children[j].expand = false;
                          }
                    if(_this.apiListData[key].list[i].children[j].children.length>0){
                      for(var k = 0;k<_this.apiListData[key].list[i].children[j].children.length;k++){
                        _this.apiListData[key].list[i].children[j].children[k].currentTab = key
                         _this.apiListData[key].list[i].children[j].children[k].currentCode = _this.apiListData[key].code
                         if(_this.expandArr.includes(_this.apiListData[key].list[i].children[j].children[k].actionId)){
                            _this.apiListData[key].list[i].children[j].children[k].expand = true;
                          }else{
                            _this.apiListData[key].list[i].children[j].children[k].expand = false;
                          }

                      }
                    }
                  }
                }
              }
            }
        });
        console.log(_this.apiListData)
        if(string){
          this.searchAllData = []
            this.searchExpand(_this.apiListData[_this.currentTab].list,idsArr,string)
        }
      })
    },
    getExpandArr(root, node, data){
        // console.log(root);
        // console.log(node);
        console.log(data)
        this.expandArr.push(data.actionId)
        if(node.parent||node.parent==0){
            for(let i = 0;i<root.length;i++){
                if(root[i].nodeKey == node.parent){
                    // this.expandArr.push(root[i].node.id)
                    this.getExpandArr(root,root[i],root[i].node)
                }
            }
        }
      console.log(this.expandArr)
    },
     getExpandArrModify(root, node, data){
        if(node.parent||node.parent==0){
            for(let i = 0;i<root.length;i++){
                if(root[i].nodeKey == node.parent){
                    this.expandArr.push(root[i].node.actionId)
                    this.getExpandArrModify(root,root[i],root[i].node)
                }
            }
        }
         console.log(this.expandArr)
    },
    configTreeListObj(obj,string){
        let a = 1
        for (let key in obj){
          this.configTreeList(obj[key],string,a)
        }
    },
    configTreeList(arr1,string,a){
      var arr = arr1
      if(arr1.list){
        arr = arr1.list
      }
        for(let i = 0;i<arr.length;i++){
            arr[i].title = arr[i].name;
            arr[i].level = a
            arr[i].expand = false;
            arr[i].classData = arr[i].title.includes(string);
            if(arr[i].children.length){
              // arr1[i].children = arr1[1].child
                this.configTreeList(arr[i].children,string,a+1)
                
            }
        }
    },
    getDomInfo(root, node, data){
      this.model2 = true;
      this.currentCode = data.currentCode;
      this.currentTab = data.currentTab;
      this.expandArr = [];
      this.getExpandArrModify(root, node, data)
      let params = {
        actionId : data.actionId
      }
      ApiActionDetails(params).then(res=>{
        this.domInfo = res.data.result;
        this.parentTilteValue = ''
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
        this.domInfo.father = this.parentTilteValue 
      })
    },
    apiActionmodfiy(root, node, data){
      this.restinfo()
      this.$refs['addListModify'].resetFields()
      this.currentCode = data.currentCode;
      this.currentTab = data.currentTab
      this.expandArr = [];
      this.getExpandArrModify(root, node, data)
      this.model4 = true;
      this.addListModify.name =data.name;
      this.addListModify.url = data.url;
      this.previousId = data.actionId;
      this.statuModiy = data.status+"";
      // this.parentTilteValue = ''
      // for (let i = 0; i < root.length; i++) {
      //   if (root[i].nodeKey == node.parent//eslint-disable-line
      //   ) {
      //     this.parentTilteValue = root[i].node.title
      //     if (root[i].parent != undefined//eslint-disable-line
      //     ) {
      //       for (let j = 0; j < root.length; j++) {
      //         if (root[j].nodeKey == root[i].parent//eslint-disable-line
      //         ) {
      //           this.parentTilteValue = root[j].node.title + '--' + this.parentTilteValue
      //         }
      //       }
      //     }
      //   }
      // }
      let params = {
        actionId : data.actionId
      }
      ApiActionDetails(params).then(res=>{
         this.actionUrl = res.data.result.url
         this.addListModify.htmlId = res.data.result.htmlId;
        // this.domInfo = res.data.result;
        this.parentTilteValue = ''
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
        // this.domInfo.father = this.parentTilteValue 
      })
      if(data.level ==1){
        this.parentTitleModif = false;
        this.parentTitleModifUrl = false;
      }else if(data.level == 2){
        this.parentTitleModif = true;
        this. parentTitleModifUrl = true;
      }else if(data.level == 3){
        this. parentTitleModif = true;
        this. parentTitleModifUrl = true;
      }
    },
    restinfo(){
      this.statuModiy="1";
      this.parentTitleModif=false;
      this.parentTitleModifUrl=false;
      this.addList={
        name:'',
        htmlId:''
      };
      this.nameArr=[
          {name:'',
            htmlId:''
          },
      ];
      this.nameArrSec=[{
        name:'',
        url:'',
        htmlId : ''
      }];
      this.addListSec={
        name:'',
        url:'',
        htmlId :''
      },
      this.addListModify={
        name:'',
        url:'',
        htmlId:''
      }
      this.actionUrl = ""
    },
    searchExpand(arr,expandList,searchValue){
        if(expandList.length>0){
            for(let i = 0;i<arr.length;i++){
                let expandValue = false;
                if(arr[i].title.includes(searchValue.trim())){
                    this.searchAllData.push(arr[i])
                }
                if(expandList.includes(arr[i].actionId)){
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
     search(item,key){
        this.currentTab = key
        this.searchAllData = [];
        this.expandArr = [];
        let platformCode = [];
        platformCode.push(item)
        if(this.searchValue){
            let params = {
                text :this.searchValue.trim(),
                platformCode: platformCode
            }
            actionSearch(params).then(res =>{
                this.getTreeList(this.searchValue.trim(),res.data.result)
                // this.searchExpand(this.apiListData[this.currentTab],res.data.result,this.searchValue)
            })
            // this.getTreeList(this.searchValue)
            
        }else{
          this.getTreeList()
        }
    },
    groupAdd(itemName){
      this.previousId = '';
      this.$refs['addList'].resetFields()
      this.$refs['nameArr'][0].resetFields()
      this.$refs['nameArrSec'][0].resetFields()
      this.currentCode = itemName
      this.restinfo()
      this.model1 = true;
      this.parentTitle = false;
    },
    dashed(){
      this.model1 = false
      this.model3 = false
      this.model4 = false
      this.$refs['addList'].resetFields();
      this.$refs['addListSec'].resetFields()
      this.$refs['addListModify'].resetFields();
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
      this.getTreeList()
  },
}
</script>
<style>
.selectedItemtrue{
    color: red;
}
.ivu-form-item{
  /* margin-bottom:1px; */
}
.common-tree .ivu-tree ul{line-height: 32px}
.common-tree .ivu-tree ul li{border-bottom: 1px dashed #ddd;padding-bottom: 0px;margin-bottom:0px !important;margin-top: 0px}
.common-tree .ivu-tree ul li span{margin-bottom: 2px;margin-top: 2px}
.common-tree .ivu-tree ul li ul:last-child li{border-bottom: none}
.common-tree .ivu-tree ul li ul:first-of-type{border-top: 1px dashed #ddd}
.common_form .ivu-form-item-error-tip{position:relative;margin-bottom: 0px}
.common-tree .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
}
.common-tree .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
    /* background: #92c1f0 */
    
}
.common-tree .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
