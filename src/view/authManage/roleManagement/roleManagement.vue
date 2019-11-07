
<template>

    <div style="background:#eee;padding: 0px">
        <Card :bordered="false">
            <p slot="title">角色管理</p>
            <div class="layout-content">
                <Row type="flex"  class="code-row-bg">
                    <i-col >
                        <label>角色名称：</label>
                        <Input v-model="roleModel"  style="width: 160px" @on-enter="search" />
                    </i-col>
                    <i-col style="margin-left: 10px;">
                        <label>所属部门：</label>
                        <!-- <i-select :model.sync="departmentModel" style="width:160px">
                            <i-option v-for="item in departmentList" :key="item.indexs" :value="key">{{ key }}</i-option>
                        </i-select> -->
                            <i-select v-model="departmentModel" style="width:180px" placeholder="不限">
                                <i-option value="" style="width:160px">不限 </i-option>
                                <i-option style="width:160px" v-for="(item,index) in departmentList" :value='item.departmentId' :key="index">{{ item.departmentName }}</i-option>

                            </i-select>
                    </i-col>
                    <i-col >
                        <i-button type="primary" style="margin-left: 10px;" @click="search()">查询</i-button>
                        <i-button type="success" style="margin-left: 10px;" @click="addRole()" v-if = 'getButtonPermission("permission_role_add","out")'>添加角色</i-button>
                    </i-col>
                </Row>
                <br>
                <Row type="flex"  class="code-row-bg">
                    <i-col span="24">
                    <i-table :row-class-name="rowClassName"  stripe border :loading="loading" highlight-row :columns="columnsList" :data="tableData" @on-sort-change='changeSort'></i-table>
                    <br/>
                    <Page :total="totalNum" :page-size-opts=[10,25,50,100] :current="pageIndex" @on-change="changePage" :page-size="pageSize" @on-page-size-change="pageChange" show-total show-sizer show-elevator  style="float: right" />
                    </i-col>
                </Row>
            </div>
        </Card>

        <!-- 编辑角色 -->
        <div>
          <Modal
              :title="`编辑角色-${dialogTilte}`"
              v-model="editRoleModal"
              width="550"
              :mask-closable="false"
              :visible.sync="editRoleModal"
              :closable="true" draggable>
              <Form v-if="editRoleModal" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="角色ID" prop="roleId" hidden>
                      <Input v-model="formValidate.roleId" />
                  </FormItem>
                  <FormItem label="角色名称：" prop="roleName">
                      <Input v-model="formValidate.roleName" placeholder="请输入角色名称"/>
                  </FormItem>
                  <FormItem label="所属部门：" prop="departmentId">
                    <!-- placeholder="请选择所属部门" -->
                    <!-- departmentModel  formValidate.departmentId-->
                      <Select v-model="formValidate.departmentId" >
                        <!-- ${dialogTilte} -->
                          <i-option v-for="(item) in departmentList" :value="`${item.departmentId}`" :key='item.departmentId'>{{ item.departmentName }}</i-option>
                          <!-- <Option v-for="(item,key) in departmentList" :value="key" :key="key">{{ item }}</Option> -->

                      </Select>
                  </FormItem>
                  <FormItem label="角色描述：" prop="description">
                    <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="角色描述"/>
                  </FormItem>

              </Form>
              <div slot="footer">
                      <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                      <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
              </div>
          </Modal>

        </div>
        <!-- 添加角色 -->
        <div>
          <Modal
              v-bind:title="`添加角色`"
              v-model="addRoleModal"
              width="550"
              :mask-closable="false"
              :visible.sync="addRoleModal"
              :closable="true" draggable>
              <!-- v-if="addRoleModal" -->
                <Form   ref="formAddRole" :model="formAddRole" :rules="roleValidate" :label-width="100">
                    <FormItem label="角色名称：" prop="roleName">
                        <Input v-model="formAddRole.roleName" placeholder="请输入角色名称"/>
                    </FormItem>
                    <FormItem label="所属部门：" prop="departmentId">
                        <Select v-model="formAddRole.departmentId" placeholder="请选择所属部门">

                            <Option v-for="(item) in departmentList" :value="`${item.departmentId}`" :key="item.departmentId">{{ item.departmentName }}</Option>

                        </Select>
                    </FormItem>
                    <FormItem label="角色描述：" prop="description">
                      <Input v-model="formAddRole.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="角色描述"/>
                    </FormItem>

                </Form>
                <div slot="footer">
                        <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                        <Button type="primary" @click="handleAddSubmit('formAddRole')">确定</Button>
                </div>

          </Modal>
        </div>
        <!-- 复制角色 -->
       <div>
          <Modal
              v-bind:title="`复制角色-${dialogTilte}`"
              v-model="copyModal"
              width="550"
              :mask-closable="false"
              :visible.sync="copyModal"
              :closable="true" draggable>
              <Form v-if="copyModal" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="角色ID" prop="roleId" hidden>
                      <Input v-model="formValidate.roleId" />
                  </FormItem>
                  <FormItem label="角色名称：" prop="roleName">
                    <!-- "`复制角色-${dialogTilte}`" -->
                    <!-- "formValidate.roleName" -->
                      <Input v-model="formValidate.roleName" placeholder="请输入角色名称"/>
                  </FormItem>
                  <FormItem label="所属部门：" prop="departmentId">
                      <Select v-model="formValidate.departmentId" placeholder="请选择所属部门">
                          <Option v-for="(item) in departmentList" :value="`${item.departmentId}`" :key="item.departmentId">{{ item.departmentName }}</Option>

                      </Select>
                  </FormItem>
                  <FormItem label="角色描述：" prop="description">
                    <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="角色描述"/>
                  </FormItem>

              </Form>
              <div slot="footer">
                      <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                      <Button type="primary" @click="handleAddSubmit('formValidate')">确定</Button>
              </div>
          </Modal>

       </div>
        <!-- 用户 -->
       <div>
          <Modal
              v-bind:title="`${dialogTilte}`"
              v-model="useModal"
              width="620"
              :mask-closable="false"
              :visible.sync="useModal"
              :closable="true" draggable>

              <Form ref="" :model="formValidate" :rules="ruleValidate" :label-width="120">
                  <FormItem label="角色ID" prop="roleId" hidden>
                      <Input v-model="formValidate.roleId" />
                  </FormItem>
                <template v-if="useModal">
                    <Transfer
                        :data="allPermissUser"
                        :target-keys="roleUsers"
                        filterable
                        :filter-method="filterMethod"
                        :list-style="{width: '250px',height: '300px'}"
                        :titles="['未授权人员','已授权人员']"
                        @on-change="handleChange"></Transfer>
                </template>

              </Form>
              <div slot="footer">
                      <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                      <Button type="primary" @click="modifyUserSubmit()">确定</Button>
              </div>
          </Modal>

       </div>
        <!-- 授权 -->
       <div>
         <template >
           <Modal
              v-bind:title="`${dialogTilte}`"
              v-model="actionsModal"
              width="820"
              :mask-closable="false"
              :visible.sync="actionsModal"
              :closable="true" draggable>
              <template>
                <Form ref="" :model="formActionValidate" :rules="actionValidate" :label-width="80">
                  <div  class="actions-tabs-style">
                      <Tabs type="card" :animated = false>

                          <template v-for="(firstItem,actionKey) in allActions">
                            <template v-if="firstItem.list.length !==0">
                              <TabPane v-bind:label="actionKey | formatName" v-bind:key='actionKey'>
                                <template >
                                    <Collapse v-if="hackReset">
                                    <template v-for="(item,key) in firstItem.list">
                                      <!-- v-if="item.child.length!==0" -->
                                        <Panel :name="item.actionId+''"  :value="item.actionId+''" :key="key" >
                                            {{item.name}}
                                            <div slot="content" v-for="(childData,key) in item.child" :value="key" :key="key">
                                              <checkAllItem v-bind:dataGroup="childData" v-bind:firstActionId="item.actionId" v-bind:disableFlag='getButtonPermission("permission_role_modifyAction","out")' ></checkAllItem>
                                            </div>
                                        </Panel>
                                    </template>

                                    </Collapse>
                                </template>
                             </TabPane>
                            </template>

                          </template>
                      </Tabs>
                  </div>
                </Form>
                <div slot="footer">
                      <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                      <Button type="primary" @click="modifyActionSubmit()" v-if='getButtonPermission("permission_role_modifyAction","out")'>确定</Button>
                </div>
              </template>
           </Modal>
        </template>
       </div>
        <!-- 数据 -->
        <div>
          <Modal
              v-bind:title="`数据管理权限 - ${dialogTilte}`"
              v-model="dataModal"
              width="620"
              :mask-closable="false"
              :visible.sync="dataModal"
              :closable="true" draggable>
              <Form ref="" :model="formDataValidate" :rules="dataValidate" :label-width="80">
                  <FormItem label="角色ID" prop="roleId" hidden>
                      <Input v-model="formDataValidate.roleId" />
                  </FormItem>
                  <div  class="actions-tabs-style">
                      <Tabs type="card" v-if="isShowDataGroup" :animated = false>
                        <template  >
                          <div v-for="(item,index) in dataPmTree.list" :value='item.departmentId' :key="index">
                              <div v-if="item.isDefault ==0 && item.code =='shop'">
                                    <TabPane :label="item.name" v-if="item.items!==undefined  && item.items.lenght !== 0">
                                      <template >
                                          <treeShopItem v-bind:shopData="item.items" ref="treeChild"></treeShopItem>
                                      </template>

                                    </TabPane>
                              </div>
                              <div v-if="item.isDefault ==0 && item.code =='category'">
                                  <TabPane :label="item.name" v-if="item.items !==undefined  && item.items.lenght !== 0">
                                    <template>
                                      <treeCategoryItem v-bind:categoryData="item.items" ref="categoryChild" ></treeCategoryItem>
                                    </template>
                                  </TabPane>
                              </div>
                              <div v-if="item.isDefault ==0 && item.code =='vendor'">
                                  <TabPane :label="item.name" v-if="item.items !==undefined  && item.items.lenght !== 0">
                                    <vendorItem v-bind:vendorData="item.items" ref="vendorChild"></vendorItem>
                                  </TabPane>
                              </div>
                              <div v-if="item.isDefault ==1">
                                    <TabPane :label="item.name"  v-if="item.items !==undefined  && item.items.lenght !== 0">
                                      <departmentItem v-bind:departmentData="item.items" v-bind:departmentIdName="item.parameter" :ref="item.code"></departmentItem>
                                    </TabPane>
                              </div>
                          </div>
                        </template>
                          <!-- <TabPane label="店铺" v-if="shopDataGroup!==undefined  && shopDataGroup.lenght !== 0">
                            <template >
                                 <treeShopItem v-bind:shopData="shopDataGroup" ref="treeChild"></treeShopItem>
                            </template>

                          </TabPane>
                          <TabPane label="品类" v-if="categoryDataGroup !==undefined  && categoryDataGroup.lenght !== 0">
                            <template>
                               <treeCategoryItem v-bind:categoryData="categoryDataGroup" ref="categoryChild" ></treeCategoryItem>
                            </template>
                          </TabPane>
                          <TabPane label="供应商" v-if="vendorDataGroup !==undefined  && vendorDataGroup.lenght !== 0">
                            <vendorItem v-bind:vendorData="vendorDataGroup" ref="vendorChild"></vendorItem>
                          </TabPane>
                          <TabPane label="组织结构" v-if="departmentDataGroup !==undefined  && departmentDataGroup.lenght !== 0">
                            <departmentItem v-bind:departmentData="departmentDataGroup" v-bind:departmentIdName="'departmentIds'" ref="departmentChild"></departmentItem>
                           </TabPane>
                          <TabPane label="销参事业部数据" v-if="xcdepartmentData !==undefined  && xcdepartmentData.lenght !== 0">
                            <departmentItem v-bind:departmentData="xcdepartmentData" v-bind:departmentIdName="'xcDepartmentIds'" ref="xcDepartmentIds"></departmentItem>
                           </TabPane>                            -->
                      </Tabs>
                  </div>

              </Form>
              <div slot="footer">
                      <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                      <Button type="primary" @click="modifyDataSubmit()">确定</Button>
              </div>
          </Modal>
        </div>

        <!-- 删除角色 -->
        <div>
          <Modal
              v-bind:title="`删除 - ${dialogTilte}`"
              v-model="deleteRoleModal"
              width="320"
              :mask-closable="false"
              :visible.sync="deleteRoleModal"
              :closable="true" draggable>
              <Form ref=""  :label-width="80">
                  <p>若角色已关联的用户，将解除绑定，且删除角色将不可恢复，确认删除？</p>
              </Form>
              <div slot="footer">
                      <Button @click="modalCancel()" style="margin-left: 8px">取消</Button>
                      <Button type="primary" @click="deleteDataSubmit()">确定</Button>
              </div>
          </Modal>
        </div>

    </div>

</template>

<script>

import { getRoleList, getDepartments, getRoleView, roleModify, roleAdd, getListUse, modifyUser, getListsAction, modifyAction, getDataPermission, viewDataPermission, modifyDataPermission, destroyRole } from '@/api/role'
import checkAllItem from './template/checkAllItem'
import treeShopItem from './template/treeShopItem'
import treeCategoryItem from './template/treeCategoryItem'
import vendorItem from './template/vendorItem'
import departmentItem from './template/departmentItem'
import store from './store/index'
import axios from '@/libs/api.request'
import allStore from '@/store'

let keyName = {
  'erp': 'erp',
  'ptxXc': '销售参谋',
  'ptxWk': '挖矿',
  'kefu': '电话客服',
  'permission': '权限系统'
}
export default {
  components: {
    checkAllItem, treeCategoryItem, departmentItem, vendorItem, treeShopItem
  },
  store,
  allStore,
  /* 局部过滤器 */
  filters: {
    formatName (val) {
      if (keyName.hasOwnProperty(val)) {
        return keyName[val]
      } else {
        return val
      }
      // return keyName[val];
    }
  },
  data () {
    return {
      // 标识变量（防止on-page-size-change事件会触发on-change事件）
      isPageChageFlag: true,
      single: '',
      loading: false,
      self: this,
      roleModel: '',
      order: '',
      dir: '',
      sort: 'DESC',
      departmentModel: '',
      tableData: [],
      totalNum: 0,
      pageIndex: 1,
      pageSize: 10,
      departmentList: '',
      // 记录操作下标
      opIndex: '',
      // 编辑角色
      editRoleModal: false,
      //
      dialogTilte: '',
      // 用户列表
      useModal: false,
      roleUsers: [],
      allPermissUser: [],
      modifyRoleId: '',
      // 授权相关
      actionsModal: false,
      // 记录操作的roleId
      opRoleId: '',
      // 数据模型
      dataModal: false,
      deleteRoleModal: false,
      // checkAllGroupData: [],改用store
      fatherCheck: [],
      // 所有的授权数据
      allActions: [],
      erpData: [],
      // 销售参谋
      xcData: [],
      // view数据的授权
      categoryDataGroup: [],
      // 供应商数据
      vendorDataGroup: [],
      // 组织结构数据
      hackReset: false,
      isShowDataGroup: false,
      departmentDataGroup: [],
      columnsList: [
        {
          title: 'ID',
          width: 80,
          sortable: 'custom',
          key: 'roleId',
          align: 'center'
        },
        {
          title: '角色名称',
          sortable: 'custom',
          key: 'roleName'
        },
        {
          title: '所属部门',
          sortable: 'custom',
          key: 'departmentName'
        },
        {
          title: '创建人',
          sortable: 'custom',
          width: 130,
          key: 'createdBy'
        },
        {
          title: '创建时间',
          sortable: 'custom',
          key: 'createdAt'
        },
        {
          title: '更新时间',
          sortable: 'custom',
          key: 'updatedAt'
        },
        {
          title: '修改人',
          width: 130,
          sortable: 'custom',
          key: 'updatedBy'
        },
        {
          title: '操作',
          key: 'action',
          // align: 'center',
          render: (h, params) => {
            var _this = this
            return h('div', [
              h('Tooltip', {
                attrs: {
                  placement: 'top',
                  trigger: 'hover',
                  content: '授权'
                }
              }, [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px',
                      marginBottom: '5px',
                      marginTop: '2px',
                      display: this.getButtonPermission('permission_role_listsAction')
                    },
                    on: {
                      click: () => {
                        // 调用授权方法
                        this.actionsModifyModal(params)
                      }
                    }
                  },
                  [
                    h('span', {
                      class: ['iconfont', 'icon-suo'],
                      style: { fontSize: '16px', color: '#16A8F8' }
                    })
                  ]
                  // '授权'
                )
              ]),
              h('Tooltip', {
                attrs: {
                  placement: 'top',
                  trigger: 'hover',
                  content: '数据'
                }
              }, [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px',
                      marginBottom: '5px',
                      marginTop: '2px',
                      display: this.getButtonPermission('permission_role_modifyDataPermission')
                    },
                    on: {
                      click: () => {
                        // 调用数据方法
                        this.dataModifyModal(params)
                      }
                    }
                  },
                  [
                    h('span', {
                      class: ['iconfont', 'icon-shuju'],
                      style: { fontSize: '16px', color: '#16A8F8' }
                    })
                  ]

                  // '数据'
                )
              ]),

              h('Tooltip', {
                attrs: {
                  placement: 'top',
                  trigger: 'hover',
                  content: '用户'
                }
              }, [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px',
                      marginBottom: '5px',
                      marginTop: '2px',
                      display: this.getButtonPermission('permission_role_modifyUser')
                    },
                    on: {
                      click: () => {
                        // 调用用户方法
                        this.userModifyModal(params)
                      }
                    }
                  },
                  [
                    h('span', {
                      // <Icon type="md-close" />
                      class: ['iconfont', 'icon-pengyou'],
                      style: { fontSize: '16px', color: '#16A8F8' }
                    })
                  ]
                  // '用户'
                )
              ]),

              h('Tooltip', {
                attrs: {
                  placement: 'top',
                  trigger: 'hover',
                  content: '修改'
                }
              }, [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px',
                      marginBottom: '5px',
                      marginTop: '2px',
                      display: this.getButtonPermission('permission_role_modify')
                    },
                    on: {
                      click: () => {
                        // 调用修改角色方法
                        this.roleModifyModal(params)
                      }
                    }
                  },
                  [
                    h('span', {
                      // <Icon type="md-close" />
                      class: ['iconfont', 'icon-iconset0136'],
                      style: { fontSize: '16px', color: '#16A8F8' }
                    })
                  ]
                )]
              ),

              h('Tooltip', {
                attrs: {
                  placement: 'top',
                  trigger: 'hover',
                  content: '复制'
                }
              }, [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom: '5px',
                      marginTop: '2px',
                      display: this.getButtonPermission('permission_role_add')
                    },
                    on: {
                      click: () => {
                        // 调用修改角色方法
                        this.roleCopyModal(params)
                      }
                    }
                  },
                  [
                    h('span', {
                      class: ['iconfont', 'icon-fuzhi'],
                      style: { fontSize: '16px', color: '#16A8F8' }
                    })
                  ]
                  // '复制角色'
                )]
              ),

              h('Tooltip', {
                attrs: {
                  placement: 'top',
                  trigger: 'hover',
                  content: '删除'
                }
              }, [
                h('Button', {
                  props: {
                    size: 'small'
                  },

                  style: {
                    marginRight: '2px',
                    marginBottom: '5px',
                    marginTop: '2px',
                    display: this.getButtonPermission('permission_role_destroy')
                  },
                  // style:{padding: '2px 6px 2px'},
                  on: {
                    click: () => {
                      // 调用删除model
                      this.openDeleteRoleModal(params)
                    }
                  }
                }, [
                  h('span', {
                    class: ['iconfont', 'icon-shanchu'],
                    style: { fontSize: '16px', color: '#16A8F8' }
                  })
                  // h('strong','删除')
                ])]
              )

            ])
          }
        }
      ],
      // 添加角色
      addRoleModal: false,
      // 复制角色
      copyModal: false,
      // 添加角色
      formAddRole: {
        roleName: '',
        departmentId: '',
        description: ''
      },
      roleValidate: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          { max: 20, message: '不能超过20个字符', trigger: 'blur' }
        ],

        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写角色描述', trigger: 'blur' },
          { max: 100, message: '不能超过100个字符', trigger: 'blur' }
        ]
      },
      // 表单验证
      formValidate: {
        roleName: '',
        name: '',
        // formValidate.departmentId
        departmentId: '',
        description: ''
      },
      ruleValidate: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          { max: 20, message: '不能超过20个字符', trigger: 'blur' }
        ],

        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写角色描述', trigger: 'blur' },
          { max: 100, message: '不能超过100个字符', trigger: 'blur' }
        ]
      },
      formActionValidate: {},
      actionValidate: {},
      // 数据表单验证
      formDataValidate: {},
      dataValidate: {},
      shopDataGroup: [],
      deleteRoleParams: '',
      dataPmTree: ''
    }
  },
  methods: {
    handleRequestParams (current, pageSize) {
      const para = { 'params':
                 { page: current, pageSize: pageSize, roleName: this.roleModel, departmentId: this.departmentModel, order: this.order, dir: this.dir }
      }
      this.opIndex = ''
      return para
    },
    // 排序
    changeSort (info) {
      this.order = info.key
      if (info.order != 'normal') {
        this.dir = info.order
      } else {
        this.dir = ''
      }
      this.initDataList(1, this.pageSize)
    },
    search () {
      this.loading = true
      let _this = this
      _this.initDataList(1, _this.pageSize)
    },
    // 初始化列表数据
    initDataList (pageIndex, pageSize) {
      this.loading = true
      let _this = this
      const reqData = this.handleRequestParams(pageIndex, pageSize)
      getRoleList(reqData).then(res => {
        // @mark 这里要去掉 最外面data
        const data = res.data.result
        this.loading = false
        _this.tableData = data.list
        // 赋值分页数据
        _this.totalNum = parseInt(data.pageInfo.totalNum)
        _this.pageIndex = parseInt(data.pageInfo.pageIndex)
        _this.pageSize = parseInt(data.pageInfo.pageSize)
        _this.$nextTick(() => {
        })
      })
    },
    // 改变页码
    changePage (pageIndex) {
      if (!this.isPageChageFlag) {
        this.isPageChageFlag = true
        return false
      }
      this.initDataList(pageIndex, this.pageSize)
    },
    // 切换每页
    pageChange (pageSize) {
      if (this.pageIndex != 1) {
        this.isPageChageFlag = false
      } else {
        this.isPageChageFlag = true
      }
      this.pageIndex = 1
      this.pageSize = pageSize
      this.initDataList(this.pageIndex, pageSize)
    },
    // 修改角色Modal
    roleModifyModal (params) {
      let _this = this
      _this.opIndex = params.index
      let roleId = params.row.roleId
      const para = { 'params':
                    { roleId: roleId }
      }
      _this.dialogTilte = params.row.roleName
      getRoleView(para).then(res => {
        let roleData = res.data.result.roleInfo
        // 传值给modal
        _this.editRoleModal = true
        //
        _this.formValidate = roleData
        _this.formValidate.departmentId = roleData.departmentId + ''
      })
    },
    // 编辑角色表单提交
    handleSubmit (name) {
      let _this = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 请求接口
          let params = _this.formValidate
          const para = { 'params': params }
          roleModify(para).then(res => {
            // 更新列表中的值
            let roleData = res.data.result.roleInfo
            _this.$set(_this.tableData, _this.opIndex, roleData)
            _this.editRoleModal = false
            this.$Message.success('操作成功!')
          })
          // this.$Message.success('Success!');
        } else {
          this.$Message.error('请填写必填项!')
        }
      })
    },
    // 打开添加角色modal
    addRole () {
      this.addRoleModal = true
      let _this = this
      this.$refs['formAddRole'].resetFields()
      // this.$nextTick(() => {
      //   // console.log(this.$refs['formAddRole'])
      //       this.$refs['formAddRole'].resetFields();
      //       console.log(this.formAddRole)
      // })
    },
    handleAddSubmit (name) {
      let _this = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 请求接口
          let params
          if (name == 'formValidate') {
            params = _this.formValidate
          }
          if (name == 'formAddRole') {
            params = _this.formAddRole
          }
          let fromName = name
          const para = { 'params': params }
          // 请求参数需要封装
          roleAdd(para).then(res => {
            // 更新列表中的值
            // _this.editRoleModal =false;
            // 在列表里面插入数据
            _this.tableData.splice(0, 0, res.data.result.roleInfo)
            // _this.tableData.push(res.data.result.roleInfo);
            if (fromName == 'formAddRole') {
              _this.opIndex = 0
            }
            _this.modalCancel()
            this.$Message.success('操作成功!')
          })
          // this.$Message.success('Success!');
        } else {
          this.$Message.error('请填写必填项!')
        }
      })
    },
    // 关闭modal
    modalCancel () {
      this.editRoleModal = false
      this.addRoleModal = false
      this.copyModal = false
      this.useModal = false
      this.actionsModal = false
      this.dataModal = false
      this.deleteRoleModal = false
      // addRoleModal
    },
    // 复制角色
    roleCopyModal (params) {
      let _this = this
      let roleId = params.row.roleId
      _this.opIndex = params.index
      const para = { 'params':
                    { roleId: roleId }
      }
      _this.dialogTilte = params.row.roleName
      getRoleView(para).then(res => {
        let roleData = res.data.result.roleInfo
        // 传值给modal
        _this.copyModal = true
        //
        _this.formValidate = roleData
        _this.formValidate.departmentId = roleData.departmentId + ''
        _this.formValidate.roleName = roleData.roleName + '_复制'
      })
    },
    // 用户
    userModifyModal (params) {
      let _this = this
      // 请求用户列表
      _this.dialogTilte = params.row.roleName
      _this.opIndex = params.index
      // 获取用户列表数据
      let roleId = params.row.roleId
      _this.modifyRoleId = roleId
      const para = { 'params':
                        { roleId: roleId }
      }
      _this.useModal = true
      getListUse(para).then(res => {
        let activeRoleId = allStore.state.user.userInfo.userId
        // 赋值两个对象
        _this.roleUsers = []
        _this.allPermissUser = []
        for (let i = 0; i < res.data.result.allPermissUser.length; i++) {
          const item = res.data.result.allPermissUser[i]
          // 如果roleId 与当前用户相等，不可
          let roleDisabled = false
          if (item.userId == activeRoleId) {
            roleDisabled = true
          }
          _this.allPermissUser.push({
            key: item.userId,
            label: item.userName,
            disabled: roleDisabled
          })
        }
        _this.roleUsers = res.data.result.roleUsers
      })
    },
    render1 (item) {
      return item.label
    },
    handleChange (newTargetKeys, direction, moveKeys) {
      this.roleUsers = newTargetKeys
    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1
    },
    modifyUserSubmit () {
      let _this = this
      // 获取用户列表数据
      let arrUserIds = this.roleUsers
      const para = { 'params':
                        { roleId: _this.modifyRoleId, userIds: arrUserIds }
      }
      modifyUser(para).then(res => {
        // this.$Message.success(res.data.result);
        this.$Message.success('操作成功!')
        _this.modalCancel()
      })
    },
    // 授权
    actionsModifyModal (params) {
      // params
      let _this = this
      _this.dialogTilte = params.row.roleName
      _this.opIndex = params.index

      _this.opRoleId = params.row.roleId
      // 请求接口
      const para = { 'params':
            { roleId: params.row.roleId }
      }
      // this.$Spin.show();
      this.$store.state.checkArrData = []
      this.$store.state.checkSecondArr = {}
      this.hackReset = false
      this.allActions = []

      getListsAction(para).then(res => {
        // this.$Spin.hidden();
        // this.$Spin.hide();
        _this.actionsModal = true
        this.$store.state.roleId = _this.opRoleId
        this.$store.state.checkArrData = res.data.result.roleActions
        _this.checkAllGroupData = res.data.result.roleActions
        _this.fatherCheck = res.data.result.roleActions
        // 赋值循环
        this.allActions = res.data.result.actions
        // _this.erpData =res.data.result.actions.erp;
        // _this.xcData =res.data.result.actions.ptxXc;
        this.$nextTick(() => {
          this.hackReset = true
        })
      })
    },
    // 授权提交
    modifyActionSubmit () {
      // 提交所有的权限action
      // modifyAction
      let _this = this
      _this.actionsModal = true

      // 请求接口
      const para = { 'params':
              { roleId: _this.opRoleId, actionIds: this.$store.state.checkArrData }
      }
      if (this.$store.state.checkArrData.length > 0) {
        modifyAction(para).then(res => {
          // this.$Message.success(res.data.result);
          _this.actionsModal = false
          _this.modalCancel()
          this.$Message.success('操作成功!')
        })
      } else {
        this.$Message.warning('必须勾选一项')
      }
    },
    // 数据
    dataModifyModal (params) {
      //
      // 请求
      let _this = this
      _this.dialogTilte = params.row.roleName
      _this.opIndex = params.index

      _this.opRoleId = params.row.roleId
      // 请求接口
      // let roleIdArr = [];
      // roleIdArr.push(params.row.roleId);
      const para = { 'params':
            { roleId: params.row.roleId }
      }
      // 获取
      _this.shopDataGroup = []
      _this.resetStoreData()
      _this.isShowDataGroup = false

      getDataPermission(para).then(res => {
        _this.dataPmTree = res.data.result
        // console.log(_this.dataPmTree)
        // _this.shopDataGroup = res.data.result.shop;
        // _this.categoryDataGroup = res.data.result.category;
        // _this.vendorDataGroup = res.data.result.vendor;
        // _this.departmentDataGroup = res.data.result.department;
        // _this.xcdepartmentData = res.data.result.xcDepartment;
        // console.log(_this.departmentDataGroup)
        // _this.isShowDataGroup =true;
        viewDataPermission(para).then(resPerms => {
          _this.$store.state.viewPermission = resPerms.data.result
          _this.isShowDataGroup = true
          _this.dataModal = true
        })
      })
    },
    choiceAll (data) {
      let choicesAll = this.$refs.tree4.getCheckedNodes // 方法的运用 getSelectedNodes也是如此用法
    },
    // 重置store 的数据状态
    resetStoreData () {
      // s
      let restViewPermission = {
        roleId: 0,
        platformIds: [],
        accountIds: [],
        shopIds: [],
        categoryIds: [],
        vendorIds: [],
        departmentIds: []
      }
      this.$store.state.viewPermission = restViewPermission
    },
    // 获得树选中数据
    getTreeItemData () {
      // 获得店铺选中的数据
      if (this.$refs.treeChild !== undefined) {
        this.$refs.treeChild[0].getNode()
      }
      if (this.$refs.categoryChild !== undefined) {
        this.$refs.categoryChild[0].getNode()
      }
    },
    modifyDataSubmit () {
      let _this = this
      this.getTreeItemData()
      //  提交表单
      this.$store.state.viewPermission.roleId = _this.opRoleId
      const para = { 'params': this.$store.state.viewPermission
      }
      //
      modifyDataPermission(para).then(res => {
        // this.$Message.success(res.data.result);
        // this.$Message.success("修改成功");
        this.$Message.success('操作成功!')
        // 关闭弹窗
        _this.modalCancel()
      })
    },
    // 打开删除modal
    openDeleteRoleModal (params) {
      this.deleteRoleModal = true
      let _this = this
      let roleId = params.row.roleId
      const para = { 'params':
                    { roleId: roleId }
      }
      _this.dialogTilte = params.row.roleName
      this.deleteRoleParams = params.row
      // console.log(params);
    },
    // 删除角色
    deleteDataSubmit () {
      let _this = this
      const para = { 'params':
                    { roleId: this.deleteRoleParams.roleId }
      }
      destroyRole(para).then(res => {
        // this.$Message.success("删除成功!");
        this.$Message.success('操作成功!')
        _this.deleteRoleModal = false
        _this.tableData.splice(_this.deleteRoleParams._index, 1)
        _this.modalCancel()
      })
    },
    rowClassName (row, index) {
      // 判断是否操作后的index
      if (index === this.opIndex) {
        return 'demo-table-info-row'
      }
      return ''
    },
    // 按钮权限控制（显隐）
    // getButtonPermisson(htmlId,flag){
    //   console.log(allStore.state.user.userHtmlIds);
    //   for(var key in allStore.state.user.userHtmlIds.permission){
    //     if(key==htmlId&&allStore.state.user.userHtmlIds.permission[key]){
    //       return true
    //     }
    //   }
    //   if(flag == 'out'){
    //     return false
    //   }else{
    //     return "none"
    //   }

    // },
    getButtonPermission (htmlId, flag) {
      let htmlIdArr = []
      for (var key in allStore.state.user.userHtmlIds.ptxPermission) {
        htmlIdArr.push(key)
      }
      if (htmlIdArr.indexOf(htmlId) >= 0 && !allStore.state.user.userHtmlIds.ptxPermission[htmlId]) {
        if (flag == 'out') {
          return false
        } else {
          return 'none'
        }
      } else {
        return true
      }
    }

  },
  mounted () {
    let _this = this
    // 获取部门列表
    getDepartments().then(res => {
      const data = res.data.result
      _this.departmentList = data
    })
    // 获取列表数据
    _this.initDataList(_this.pageIndex, _this.pageSize)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
@import "./icon/iconfont.css";
.ivu-modal-body {

}
    .actions-tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
        border-radius: 0;
        background: #fff;
    }
    .actions-tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
        border-top: 1px solid #3399ff;
    }
    .actions-tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #3399ff;
        position: absolute;
        top: 0;
        left: 0;
    }

.ivu-table .demo-table-info-row td{
    background-color: #94d4f1!important;
}

.ivu-table-cell {
    padding-top: 4px;
    padding-left: 6px;
    padding-right: 4px;
}
</style>
