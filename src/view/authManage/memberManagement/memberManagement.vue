<template>
    <div id = "memManage">
        <Card :bordered="false">
            <p slot="title">用户管理</p>
            <Row type="flex" class="code-row-bg" ref="filterBox" >
                <i-col span="4.8" style="padding-top:5px;padding-bottom:5px;padding-left:5px">
                    <label>用户名：</label>
                    <Input   style="width: 150px" v-model="userName" placeholder="请填写用户名" @on-enter="search" />
                </i-col>
                <i-col span="4.8" style="padding-top:5px;padding-bottom:5px;padding-left:5px">
                    <label>所属部门：</label>
                    <i-select :model.sync="model3" style="width:150px" v-model="department" placeholder="不限">
                        <i-option value="" style="width:160px">不限 </i-option>
                        <i-option v-for="item in departmentList" :value="item.departmentId" :key="item.departmentId">{{ item.departmentName }}</i-option>
                    </i-select>
                </i-col>
                <i-col span="4.8" style="padding-top:5px;padding-bottom:5px;padding-left:5px">
                    <label>邮箱：</label>
                    <Input   style="width: 150px" v-model="email" placeholder="请填写邮箱"  @on-enter="search" />
                </i-col>
                <i-col span="4.8" style="padding-top:5px;padding-bottom:5px;padding-left:5px">
                    <label>角色名称：</label>
                    <Input   style="width: 150px" v-model="roleName" placeholder="请填写角色名称"  @on-enter="search" />
                </i-col>
                <i-col span="4.8" style="padding-top:5px;padding-bottom:5px;padding-left:5px">
                    <label>状态：</label>
                    <i-select :model.sync="model3" style="width:150px" v-model="status" placeholder="不限" >
                        <i-option value="" style="width:160px">不限 </i-option>
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </i-select>
                </i-col>
                <i-col span="4.8" style="padding-top:5px;padding-bottom:5px;padding-left:5px">
                    <i-button type="primary" @click="search">查询</i-button>
                    <i-button type="success" style="margin-left:5px" @click="getOperationRole" v-if ='getButtonPermission("permission_user_userAddCopy","out")'>添加用户</i-button>
                </i-col>
            </Row>
            <br/>
            <Row type="flex" justify="center" class="code-row-bg">
                <i-col span="24">
                    <i-table stripe border :loading="loading" :height='tableHeight'  :columns="columns2" :data="dataList" ref="tableBox" @on-sort-change='changeSort'></i-table>
                    <br/>
                    <Page :page-size-opts=[10,25,50,100] :total="totalNum" :current="pageIndex" @on-change="changePage" :page-size="pageSize" @on-page-size-change="pageChange" show-total show-sizer show-elevator  style="float: right" />
                </i-col>
            </Row>
        </Card>
        <Modal
            :title = modalTitl1
            v-model="hackReset"
            :visible.sync="hackReset"
            :mask-closable ='false'
            :width="modalWidth" draggable>
            <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
                <Row :gutter="16">
                    <i-col :span = width>
                        <Row>
                            <i-col span ="12">
                                <FormItem label="用户名：" prop="name">
                                    <Input v-model="formItem.name" placeholder="请填写用户名" disabled/>
                                </FormItem>
                            </i-col>
                            <i-col span ="12">
                            <FormItem label="通用名：" prop='commonName'>
                                    <Input v-model="formItem.commonName" placeholder="请填写通用名"  />
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="12">
                                <FormItem label="所属部门：" prop="department">
                                    <i-select :model.sync="model3" v-model="formItem.department"  :disabled="isSuperAdminFlag">
                                         <i-option v-for="item in departmentList" :value="`${item.departmentId}`" :key="item.departmentId">{{ item.departmentName }}</i-option>
                                    </i-select>
                                </FormItem>
                            </i-col>
                            <i-col span ="12">
                            <FormItem label="邮箱：" prop='mail'>
                                    <Input v-model="formItem.mail" placeholder="请填写邮箱" />
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="12">
                                <FormItem label="允许远程：" prop="longRange">
                                    <Select v-model="formItem.longRange" placeholder="是否允许远程" >
                                        <Option v-for="item in listType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                             <i-col span ="12">
                                <FormItem label="状态：" prop="status">
                                    <Select v-model="formItem.status" placeholder="状态" >
                                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="24">
                                <FormItem label="密码：" prop="passWdModify">
                                    <Input  type="password" v-model="formItem.passWdModify" placeholder="请输入密码" />
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="24">
                                <FormItem label="重复密码：" prop="passWdCheckModify">
                                    <Input  type="password" v-model="formItem.passWdCheckModify" placeholder="请重复输入密码"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Tabs :animated="false" type = "card">
                            <TabPane label="全部角色">
                                <Checkbox-group v-model = checkmemberGroup @on-change="checkRoleChange">
                                    <!-- <Checkbox v-for="(item,key) in memberList" :key="key" :value='key' v-bind:label="item">{{item}}
                                    </Checkbox> -->
                                    <Row :gutter='8'>
                                      <i-col span="6"  v-for="(item,key) in memberList" :key="key" :value='key'>
                                         <!-- <Tooltip :content="item"> -->
                                          <Checkbox :label="key">{{item}}
                                              <!-- <span style="margin: 2px;" :class="changeClass(item.vendorCode)" >{{item.vendorCode}}</span> -->
                                          </Checkbox>
                                        <!-- </Tooltip> -->
                                      </i-col>
                                    </Row>
                                </Checkbox-group>
                            </TabPane>
                        </Tabs>
                    </i-col>
                    <i-col span = "12" v-if="roleValue">
                      <article>
                      <div v-if='hackReset' class = "out-modal-check user-tree">
                        <Tabs :animated="false" type = "card">
                            <!-- <TabPane v-for="(item1,key1) in actionListData" :key="key1" v-bind:label="key1" >
                                <Collapse v-model="pagetabs" accordion>
                                    <Panel  v-for="(item2,key2) in item1" :key ="key2" >
                                      {{item2.name}}
                                        <div slot="content" v-for="(item3,key3) in item2.child" :key ="key3" >
                                            <checkAllItem v-bind:dataGroup="item3"></checkAllItem>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </TabPane> -->
                             <template v-for="(item1,key1) in actionListData">
                                 <TabPane v-if="item1.list.length" v-bind:label="key1">
                                    <!-- <template v-if="item1.length"> -->
                                      <Collapse v-model="pagetabs" accordion>
                                          <Panel  v-for="(item2,key2) in item1.list"  :key ="key2" >
                                            {{item2.name}}
                                              <div slot="content" v-for="(item3,key3) in item2.child" :key ="key3" >
                                                  <checkAllItem v-bind:dataGroup="item3"></checkAllItem>
                                              </div>
                                          </Panel>
                                      </Collapse>
                                    <!-- </template> -->
                                </TabPane>
                            </template>
                            <template  >
                              <div >
                                <div v-for="(item,index) in listDataPermissionList.list" :value='item.departmentId' :key="index">
                                    <div v-if="item.isDefault ==0 && item.code =='shop'">
                                          <TabPane :label="item.name" v-if="item.items!==undefined  && item.items.lenght !== 0">
                                            <template >
                                                <treeShopItem v-bind:shopData="item.items" v-bind:parameterName="item.parameter"  ref="modif_ref"></treeShopItem>
                                            </template>

                                          </TabPane>
                                    </div>
                                    <div v-if="item.isDefault ==0 && item.code =='category'">
                                        <TabPane :label="item.name" v-if="item.items !==undefined  && item.items.lenght !== 0">
                                          <template>
                                            <treeCategoryItem v-bind:categoryData="item.items" v-bind:parameterName="item.parameter" ref="modif_ref" ></treeCategoryItem>
                                          </template>
                                        </TabPane>
                                    </div>
                                    <div v-if="item.isDefault ==0 && item.code =='vendor'">
                                        <TabPane :label="item.name" v-if="item.items !==undefined  && item.items.lenght !== 0">
                                          <vendorItem v-bind:vendorData="item.items" v-bind:parameterName="item.parameter" ref="modif_ref"></vendorItem>
                                        </TabPane>
                                    </div>
                                    <div v-if="item.isDefault ==1">
                                          <TabPane :label="item.name"  v-if="item.items !==undefined  && item.items.lenght !== 0">
                                            <departmentItem v-bind:departmentData="item.items" v-bind:parameterName="item.parameter" ref="modif_ref"></departmentItem>
                                          </TabPane>
                                    </div>
                                </div>
                              </div>
                            </template>
                            <!-- <TabPane label = '店铺'  v-if="listDataPermissionList.shop !==undefined  && listDataPermissionList.shop.lenght !== 0">
                              <treeShopItem v-bind:shopData="listDataPermissionList.shop" ref="treeChild"></treeShopItem>
                            </TabPane>
                            <TabPane label = '品类' v-if="listDataPermissionList.category !==undefined  && listDataPermissionList.category.lenght !== 0">
                              <treeCategoryItem v-bind:categoryData="listDataPermissionList.category" ref="categoryChild"></treeCategoryItem>
                            </TabPane>
                            <TabPane label = '供应商' v-if="listDataPermissionList.vendor !==undefined  && listDataPermissionList.vendor.lenght !== 0">
                              <vendorItem v-bind:vendorData="listDataPermissionList.vendor" ref="vendorChild"></vendorItem>
                            </TabPane>
                            <TabPane label = '组织结构' v-if="listDataPermissionList.department !==undefined  && listDataPermissionList.department.lenght !== 0">
                              <departmentItem v-bind:departmentData="listDataPermissionList.department" v-bind:departmentIdName="'disableDepartment'"  ref="departmentChild"></departmentItem>
                            </TabPane>
                            <TabPane label = '销参事业部数据' v-if="listDataPermissionList.xcDepartment !==undefined  && listDataPermissionList.xcDepartment.lenght !== 0">
                              <departmentItem v-bind:departmentData="listDataPermissionList.xcDepartment" v-bind:departmentIdName="'disableXcDepartment'"  ref="disableXcDepartment"></departmentItem>
                            </TabPane>                              -->
                        </Tabs>
                      </div>
                      </article>
                      <Spin size="large" fix v-if ='spinShow'></Spin>
                    </i-col>
                </Row>
            </Form>
            <div slot="footer">
              <Button type="dashed" @click ="dashed">取消</Button>
              <Button type="primary" @click ="modifyUser">确认</Button>
            </div>

        </Modal>
         <Modal
            :title = modalTitl1
            v-model="hackResetAdd"
            :visible.sync="hackResetAdd"
            :mask-closable ='false'
            :width="modalWidth" draggable>
            <Form ref="formItemAdd" :model="formItemAdd" :label-width="100" :rules="ruleValidate">
                <Row :gutter="16">
                    <i-col :span = width>
                        <Row>
                            <i-col span ="12">
                                <FormItem label="用户名：" prop="name">
                                    <Input v-model="formItemAdd.name" placeholder="请填写用户名" />
                                </FormItem>
                            </i-col>
                            <i-col span ="12">
                            <FormItem label="通用名：" prop='commonName'>
                                    <Input v-model="formItemAdd.commonName" placeholder="请填写通用名" />
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="12">
                                <FormItem label="所属部门：" prop="department">
                                    <i-select :model.sync="model3"  v-model="formItemAdd.department" :disabled="isSuperAdminFlag">
                                         <i-option v-for="item in departmentList" :value="`${item.departmentId}`" :key="item.departmentId">{{ item.departmentName }}</i-option>
                                    </i-select>
                                </FormItem>
                            </i-col>
                            <i-col span ="12">
                            <FormItem label="邮箱：" prop='mail'>
                                    <Input v-model="formItemAdd.mail" placeholder="请填写邮箱"/>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="12">
                                <FormItem label="允许远程：" prop="longRange">
                                    <Select v-model="formItemAdd.longRange" placeholder="是否允许远程" >
                                        <Option v-for="item in listType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                             <i-col span ="12">
                                <FormItem label="状态：" prop="status">
                                    <Select v-model="formItemAdd.status" placeholder="状态" disabled>
                                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="24">
                                <FormItem label="密码：" prop="passWd">
                                    <Input  type="password" v-model="formItemAdd.passWd" placeholder="请输入密码" />
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span ="24">
                                <FormItem label="重复密码：" prop="passWdCheck">
                                    <Input  type="password" v-model="formItemAdd.passWdCheck" placeholder="请重复输入密码"  />
                                </FormItem>
                            </i-col>
                        </Row>
                        <Tabs :animated="false" type = "card">
                            <TabPane label="全部角色">
                               <Checkbox-group v-model = checkmemberGroup @on-change="checkRoleChange">
                                    <!-- <Checkbox v-for="(item,key) in memberList" :key="key" :value='key' v-bind:label="item">{{item}}
                                    </Checkbox> -->
                                    <Row :gutter='8'>
                                      <i-col span="6"  v-for="(item,key) in memberList" :key="key" :value='key'>
                                          <Checkbox :label="key">{{item}}
                                              <!-- <span style="margin: 2px;" :class="changeClass(item.vendorCode)" >{{item.vendorCode}}</span> -->
                                          </Checkbox>
                                      </i-col>
                                    </Row>
                                </Checkbox-group>
                            </TabPane>
                        </Tabs>
                    </i-col>
                    <i-col span = "12" v-if="roleValue"  class = "out-modal-check user-tree">
                      <article>
                      <div v-if="hackResetAdd">
                        <Tabs :animated="false" type = "card">
                            <template v-for="(item1,key1) in actionListData">
                                 <TabPane v-if="item1.list.length" v-bind:label="key1" :index='index' >
                                      <Collapse v-model="pagetabs" accordion>
                                          <Panel  v-for="(item2,key2) in item1.list"  :key ="key2" >
                                            {{item2.name}}
                                              <div slot="content" v-for="(item3,key3) in item2.child" :key ="key3" >
                                                  <checkAllItem v-bind:dataGroup="item3"></checkAllItem>
                                              </div>
                                          </Panel>
                                      </Collapse>
                                </TabPane>
                            </template>
                            <template  >
                              <div v-for="(item,index) in listDataPermissionList.list" :value='item.departmentId' :key="index">
                                  <div v-if="item.isDefault ==0 && item.code =='shop'">
                                        <TabPane :label="item.name" v-if="item.items!==undefined  && item.items.lenght !== 0">
                                          <template >
                                              <treeShopItem v-bind:shopData="item.items" v-bind:parameterName="item.parameter" ref="add_ref"></treeShopItem>
                                          </template>

                                        </TabPane>
                                  </div>
                                  <div v-if="item.isDefault ==0 && item.code =='category'">
                                      <TabPane :label="item.name" v-if="item.items !==undefined  && item.items.lenght !== 0">
                                        <template>
                                          <treeCategoryItem v-bind:categoryData="item.items" v-bind:parameterName="item.parameter" ref="add_ref" ></treeCategoryItem>
                                        </template>
                                      </TabPane>
                                  </div>
                                  <div v-if="item.isDefault ==0 && item.code =='vendor'">
                                      <TabPane :label="item.name" v-if="item.items !==undefined  && item.items.lenght !== 0">
                                        <vendorItem v-bind:vendorData="item.items" v-bind:parameterName="item.parameter" ref="add_ref"></vendorItem>
                                      </TabPane>
                                  </div>
                                  <div v-if="item.isDefault ==1">
                                        <TabPane :label="item.name"  v-if="item.items !==undefined  && item.items.lenght !== 0">
                                          <departmentItem v-bind:departmentData="item.items" v-bind:parameterName="item.parameter" ref="add_ref"></departmentItem>
                                        </TabPane>
                                  </div>
                              </div>
                            </template>
                            <!-- <TabPane label = '店铺'  v-if="listDataPermissionList.shop !==undefined  && listDataPermissionList.shop.lenght !== 0">
                              <treeShopItem v-bind:shopData="listDataPermissionList.shop" ref="treeChildAdd"></treeShopItem>
                            </TabPane>
                            <TabPane label = '品类' v-if="listDataPermissionList.category !==undefined  && listDataPermissionList.category.lenght !== 0">
                              <treeCategoryItem v-bind:categoryData="listDataPermissionList.category" ref="categoryChildAdd"></treeCategoryItem>
                            </TabPane>
                            <TabPane label = '供应商' v-if="listDataPermissionList.vendor !==undefined  && listDataPermissionList.vendor.lenght !== 0">
                              <vendorItem v-bind:vendorData="listDataPermissionList.vendor" ref="vendorChildAdd"></vendorItem>
                            </TabPane>
                            <TabPane label = '组织结构' v-if="listDataPermissionList.department !==undefined  && listDataPermissionList.department.lenght !== 0">
                              <departmentItem v-bind:departmentData="listDataPermissionList.department" v-bind:departmentIdName="'disableDepartment'" ref="departmentChildAdd"></departmentItem>
                            </TabPane>
                            <TabPane label = '销参事业部数据' v-if="listDataPermissionList.department !==undefined  && listDataPermissionList.department.lenght !== 0">
                              <departmentItem v-bind:departmentData="listDataPermissionList.xcDepartment" v-bind:departmentIdName="'disableXcDepartment'" ref="disableXcDepartmentAdd"></departmentItem>
                            </TabPane>  -->
                        </Tabs>

                      </div>
                      </article>
                      <Spin size="large" fix v-if ='spinShowAdd'></Spin>
                    </i-col>
                </Row>
            </Form>
            <div slot="footer">
              <Button type="dashed" @click ="dashedAdd">取消</Button>
              <Button type="primary" @click ="modifyUserAdd">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import qs from 'qs'
import allStore from '@/store'
import store from './store/index'
import { getMemberList, userPermissionsList, getDepartments, getParam, ModifyStatus, getUserInfo, action, listDataPermission, userModify, userAddCopy } from '@/api/user'
import { getMemberView, roleModify, roleAdd } from '@/api/role'
import checkAllItem from './template/checkAllItem'
import treeCategoryItem from './template/treeCategoryItem'
import vendorItem from './template/vendorItem'
import treeShopItem from './template/treeShopItem'
import departmentItem from './template/departmentItem'
import { Transform } from 'stream'
import { mapActions } from 'vuex'
import { tableHeightFun } from '@/commonFuc/commonFuc'

export default{
  components: {
    checkAllItem,
    treeCategoryItem,
    vendorItem,
    treeShopItem,
    departmentItem
    // buttonPermisson
  },
  name: 'memberManagement',
  data () {
    const checkthis = this
    const validatePassAdd = function (rule, value, callback) {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value != checkthis.formItemAdd.passWdCheck && checkthis.formItemAdd.passWdCheck) {
          callback(new Error('两次输入密码不匹配！'))
        } else if (!reg.test(value)) {
          callback(new Error('密码必须是6到64位并包含大小写英文字母和数字'))
        } else {
          callback()
        }
      }
    }
    const validatePassCheckAdd = function (rule, value, callback) {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if (value === '') {
        callback(new Error('请再次输入你的密码'))
      } else if (value !== checkthis.formItemAdd.passWd) {
        callback(new Error('两次输入密码不匹配!'))
      } else if (!reg.test(value)) {
        callback(new Error('密码必须是6到64位并包含大小写英文字母和数字'))
      } else {
        callback()
      }
    }
    const validatePass = function (rule, value, callback) {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if ((value || checkthis.formItem.passWdCheckModify) && value != checkthis.formItem.passWdCheckModify && checkthis.formItem.passWdCheckModify) {
        callback(new Error('两次输入密码不匹配！'))
      } else if ((value || checkthis.formItem.passWdCheckModify) && !reg.test(value)) {
        callback(new Error('密码必须是6到64位并包含大小写英文字母和数字'))
      } else {
        callback()
      }
    }
    const validatePassCheck = function (rule, value, callback) {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if ((value || checkthis.formItem.passWdModify) && value !== checkthis.formItem.passWdModify) {
        callback(new Error('两次输入密码不匹配!'))
      } else if ((value || checkthis.formItem.passWdCheckModify) && !reg.test(value)) {
        callback(new Error('密码必须是6到64位并包含大小写英文字母和数字'))
      } else {
        callback()
      }
    }
    return {
      // showFlag:true,
      // buttonInfo:{
      //   title:'添加devins'
      // },
      // 标识变量（防止on-page-size-change事件会触发on-change事件）
      isPageChageFlag: true,
      operationId: '',
      isSuperAdminFlag: true,
      tableHeight: '',
      sort: 'DESC',
      htmlIdsValid: {},
      loading: false,
      isActive: true,
      modalTitl1: '',
      currentUserId: '',
      modalWidth: '1200',
      width: '12',
      indeterminate: true,
      checkAll: false,
      status: '',
      roleValue: true,
      department: '',
      userName: '',
      email: '',
      roleName: '',
      spinShow: true,
      spinShowAdd: true,
      copy: false,
      departmentList: '',
      roleListData: {},
      listDataPermissionList: {},
      actionListData: {},
      self: this,
      tableData: [],
      pagetabs: 'productmanage',
      totalNum: 0,
      pageIndex: 1,
      pageSize: 10,
      modal1: false,
      model3: '',
      hackReset: false,
      hackResetAdd: false,
      modifyFlag: false,
      addListFlag: false,
      order: '',
      dir: '',
      // dialogTilte: '',
      index: 1,
      formDynamic: {
        items: [
          {
            value: '',
            index: 1,
            status: 1
          }
        ]
      },
      listType: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      statusList: [
        {
          value: '1',
          label: '正常'
        },
        {
          value: '0',
          label: '禁止'
        }
      ],
      model1: '1',
      formItem: {
        name: '',
        commonName: '',
        department: '',
        mail: '',
        status: '1',
        longRange: '0',
        passWdModify: '',
        passWdCheckModify: ''
      },
      formItemAdd: {
        name: '',
        commonName: '',
        department: '',
        mail: '',
        status: '1',
        longRange: '0',
        passWd: '',
        passWdCheck: '',
        disableAction: [],
        disableShop: [],
        disableCategory: [],
        disableVendor: [],
        disableDepartment: [],
        xcDepartment: []
      },
      checkmemberGroup: [],
      memberList: {},
      ruleValidate: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { max: 64, message: '不能超过64个字符', trigger: 'blur' }
        ],
        commonName: [
          { required: true, message: '通用名不能为空', trigger: 'blur' },
          { max: 64, message: '不能超过64个字符', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '所属部门不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        passWd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { max: 64, message: '不能超过64个字符', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { validator: validatePassAdd, trigger: 'blur' }
        ],
        passWdCheck: [
          { required: true, message: '请重复输入你的密码', trigger: 'blur' },
          { max: 64, message: '不能超过64个字符', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { validator: validatePassCheckAdd, trigger: 'blur' }
        ],
        passWdModify: [
          { max: 64, message: '不能超过64个字符', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passWdCheckModify: [
          { max: 64, message: '不能超过64个字符', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        city: [
          { required: true, message: 'Please select the city', trigger: 'change' }
        ],
        gender: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ],
        interest: [
          { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        date: [
          { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
        ],
        time: [
          { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
        ],
        desc: [
          { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
          { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
        ]
      },
      columns2: [
        {
          title: 'ID',
          minWidth: 70,
          sortable: 'custom',
          align: 'center',
          key: 'userId'
        },
        {
          title: '用户名',
          sortable: 'custom',
          key: 'userName',
          minWidth: 100

        },
        {
          title: '通用名',
          key: 'commonName',
          minWidth: 100
        },
        {
          title: '所属部门',
          sortable: 'custom',
          key: 'department',
          minWidth: 110
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth: 200
        },
        {
          title: '角色',
          key: 'roleName',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '允许远程',
          key: 'isRemotely',
          minWidth: 90,
          render: (h, params) => {
            var _this = this
            if (params.row.isRemotely == '1') {
              return [
                h('span', '是')
              ]
            } else {
              return [
                h('span', '否')
              ]
            }
          }
        },
        {
          title: '创建人',
          key: 'createdBy',
          sortable: 'custom',
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'createdAt',
          sortable: 'custom',
          minWidth: 150
        },
        {
          title: '状态',
          key: 'status',
          sortable: 'custom',
          minWidth: 80,
          render: (h, params) => {
            var _this = this
            if (params.row.status) {
              return [
                h(
                  'Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    }
                  }, '正常'
                )
              ]
            } else {
              return [
                h(
                  'Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '禁止'
                )
              ]
            }
          }
        },
        {
          title: '更新人',
          key: 'updatedBy',
          sortable: 'custom',
          minWidth: 100
        },
        {
          title: '更新时间',
          sortable: 'custom',
          key: 'updatedAt',
          minWidth: 150
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 150,
          width: 150,
          fixed: 'right',
          render: (h, params) => {
            var _this = this
            return [
              h('Tooltip',
                {
                  props: {
                    content: '编辑',
                    transfer: true
                  }
                }, [
                  h(
                    'Button',
                    {
                      props: {
                        // type: 'success',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom: '5px',
                        display: this.getButtonPermission('permission_user_modify')
                      },
                      on: {
                        click: () => {
                          _this.getOperationRole(params, '编辑')
                        }
                      }
                    },
                    [
                      h('span', {
                        // 编辑
                        // <Icon type="md-close" />
                        class: ['iconfont', 'icon-iconset0136'],
                        style: { fontSize: '16px', color: '#16A8F8' }
                      })
                    ]
                  )
                ]
              ),
              h('Tooltip', {
                props: {
                  content: '复制',
                  transfer: true
                }
              },
              [
                h(
                  'Button',
                  {
                    props: {
                    // type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom: '5px',
                      display: this.getButtonPermission('permission_user_userAddCopy')
                    },
                    on: {
                      click: () => {
                        _this.getOperationRole(params, '添加')
                      }
                    }
                  },
                  [
                    h('span', {
                      class: ['iconfont', 'icon-fuzhi'],
                      style: { fontSize: '16px', color: '#16A8F8' }
                    })
                  ]
                )
              ]),
              h(
                'Tooltip', { props: {
                  content: '删除',
                  transfer: true
                }
                }, [
                  h(
                    'Button',
                    {
                      props: {
                        // type: 'error',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom: '5px',
                        display: this.getButtonPermission('permission_user_modifyStatus')
                      },
                      on: {
                        click: () => {
                          this.remove(params.row.userId)
                        }
                      }
                    },
                    [
                      h('span', {
                        class: ['iconfont', 'icon-shanchu'],
                        style: { fontSize: '16px', color: '#16A8F8' }
                      })
                      // h('strong','删除')
                    ]
                  )
                ]
              )

            ]
          }
        }
      ],
      dataList: [],
      // 增加一个重新渲染角色数据模块
      isShowListDataPermission: false
    }
  },
  watch: {
    tableHeight: {
      handler (newVal, oldVal) {
        this.$nextTick(() => {
          tableHeightFun(this, 'filterBox')
        })
      }
    }
  },
  methods: {
    dashed () {
      this.hackReset = false
    },
    dashedAdd () {
      this.hackResetAdd = false
    },
    // 点击编辑和添加复制时实时更新当前登陆人的角色权限
    getOperationRole (params, str) {
      this.spinShow = true
      this.spinShowAdd = true
      this.$refs['formItem'].resetFields()
      this.$refs['formItemAdd'].resetFields()
      this.listDataPermissionList = {}
      this.actionListData = {}
      var _this = this
      let userIdobj = { 'userId': this.operationId,
        'operatorId': this.operationId
        //  "operatorId" : this.$store.state.user.userInfo.userId
      }
      userIdobj = JSON.stringify(userIdobj)
      getUserInfo(userIdobj).then((res) => {
        this.memberList = res.data.result.operatorRoleDetails
        this.$store.state.user.userInfo.operatorRoleDetails = res.data.result.operatorRoleDetails
        // console.log(res.data.result.disableData)
        this.$store.state.memberViewPermission.disableData = res.data.result.disableData
        // console.log("this.$store.state")
        // console.log(this.$store.state.memberViewPermission)
        // console.log(_this.isShowListDataPermission)
        if (res.data.result.isSuperAdmin) {
          this.isSuperAdminFlag = false
        } else {
          this.isSuperAdminFlag = true
        }
        console.log('str is ' + str)
        if (str == '添加') {
          this.addUserDom(params)
        } else if (str == '编辑') {
          this.modifyUserDom(params)
        } else {
          // console.log()
          this.addUser()
        }
      })
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

    addUser () {
      this.modalTitl1 = '添加用户'
      this.roleValue = false
      this.width = 24
      this.modalWidth = 700
      this.checkmemberGroup = []
      this.actionListData = {}
      this.formItemAdd.name = ''
      this.formItemAdd.commonName = ''
      this.formItemAdd.department = ''
      this.formItemAdd.mail = ''
      this.formItemAdd.longRange = '0'
      this.formItemAdd.status = '1'
      this.formItemAdd.passWd = ''
      this.formItemAdd.passWdCheck = ''
      this.listDataPermissionList = {}
      this.$store.state.memberViewPermission.disableAction = []
      var _this = this
      Object.keys(_this.$store.state.memberViewPermission.disableData).forEach(function (key) {
        _this.$store.state.memberViewPermission.disableData[key] = []
      })
      // this.$store.state.memberViewPermission.disableData.disableShop= []
      // this.$store.state.memberViewPermission.disableData.disableCategory= []
      // this.$store.state.memberViewPermission.disableData.disableVendor= []
      // this.$store.state.memberViewPermission.disableData.disableDepartment= []
      // this.$store.state.memberViewPermission.disableData.disableXcDepartment= []
      this.hackResetAdd = true
      this.$refs['formItemAdd'].resetFields()
    },
    modifyUser () {
      var _this = this
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          for (let index = 0; index < _this.listDataPermissionList.list.length; index++) {
            const element = _this.listDataPermissionList.list[index]
            this.$refs.modif_ref[index].getDisableValue
          }
          if (this.modalTitl1 == '编辑用户') {
            let params = {}
            // 循环和调用refs 里面的方法

            this.$store.state.memberViewPermission.disableAction = this.$store.state.memberViewPermission.disableActionArr
            params.userId = this.currentUserId
            params.userName = this.formItem.name
            params.commonName = this.formItem.commonName
            params.departmentId = this.formItem.department
            params.email = this.formItem.mail
            params.status = this.formItem.status
            params.isRemotely = this.formItem.longRange
            params.passwordNew = this.formItem.passWdModify
            params.passwordConfirm = this.formItem.passWdCheckModify
            params.updatedBy = this.$store.state.user.userInfo.userName
            params.roleDetails = this.checkmemberGroup

            params.disableAction = this.$store.state.memberViewPermission.disableAction
            // state 的值添加到参数里面
            params.disableData = this.$store.state.memberViewPermission.disableData
            // params.disableShop = this.$store.state.memberViewPermission.disableShop
            // params.disableCategory = this.$store.state.memberViewPermission.disableCategory
            // params.disableVendor = this.$store.state.memberViewPermission.disableVendor
            // params.disableDepartment = this.$store.state.memberViewPermission.disableDepartment
            // params.disableXcDepartment = this.$store.state.memberViewPermission.disableXcDepartment
            console.log(params)
            userModify(params).then(res => {
              this.hackReset = false
              this.$refs['formItem'].resetFields()
              this.order = ''
              this.dir = ''
              this.initDataList(1, this.pageSize)
              this.$Message.success('操作成功!')
            })
          } else if (this.modalTitl1 == '复制') {
            // if(this.listDataPermissionList.shop){
            //    this.$refs.treeChild.getShopsValue();
            // }
            // if(this.listDataPermissionList.category){
            //    this.$refs.categoryChild.getCategoryValue();
            // }
            // if(this.listDataPermissionList.vendor){
            //   this.$refs.vendorChild.getvendorsValue();
            // }

            // if(this.listDataPermissionList.department){
            //   this.$refs.departmentChild.getDepartmentValue();
            // }
            // if(this.listDataPermissionList.xcDepartment){
            //   this.$refs.disableXcDepartment.getDepartmentValue();
            // }
            this.$store.state.memberViewPermission.disableAction = this.$store.state.memberViewPermission.disableActionArr
            this.formItemAdd.name = this.formItem.name
            this.formItemAdd.commonName = this.formItem.commonName
            this.formItemAdd.department = this.formItem.department + ''
            this.formItemAdd.mail = this.formItem.mail
            this.formItemAdd.status = this.formItem.status
            this.formItemAdd.longRange = this.formItem.longRange
            this.formItemAdd.passWd = this.formItem.passWd
            this.formItemAdd.passWdCheck = this.formItem.passWdCheck
            // @MARK:循环取值做参数
            this.formItemAdd.disableAction = this.$store.state.memberViewPermission.disableAction

            // this.formItemAdd.disableShop = this.$store.state.memberViewPermission.disableShop
            // this.formItemAdd.disableCategory = this.$store.state.memberViewPermission.disableCategory
            // this.formItemAdd.disableVendor = this.$store.state.memberViewPermission.disableVendor
            // this.formItemAdd.disableDepartment = this.$store.state.memberViewPermission.disableDepartment
            // this.formItemAdd.disableXcDepartment = this.$store.state.memberViewPermission.disableXcDepartment
          }
        } else {
          this.$Message.error('请填写完整信息!')
        }
      })
    },
    modifyUserAdd () {
      var _this = this
      this.$refs['formItemAdd'].validate((valid) => {
        console.log(valid)
        if (valid) {
          let params = {}
          for (let index = 0; index < _this.listDataPermissionList.list.length; index++) {
            const element = _this.listDataPermissionList.list[index]
            _this.$refs.add_ref[index].getDisableValue
          }
          // if(this.listDataPermissionList.shop){
          //    this.$refs.treeChildAdd.getShopsValue();
          // }
          // if(this.listDataPermissionList.category){
          //    this.$refs.categoryChildAdd.getCategoryValue();
          // }
          // if(this.listDataPermissionList.vendor){
          //   this.$refs.vendorChildAdd.getvendorsValue();
          // }

          // if(this.listDataPermissionList.department){
          //   this.$refs.departmentChildAdd.getDepartmentValue();
          // }
          // if(this.listDataPermissionList.department){
          //   this.$refs.disableXcDepartmentAdd.getDepartmentValue();
          // }

          this.$store.state.memberViewPermission.disableAction = this.$store.state.memberViewPermission.disableActionArr
          params.userId = this.currentUserId
          params.userName = this.formItemAdd.name
          params.commonName = this.formItemAdd.commonName
          params.departmentId = this.formItemAdd.department
          params.email = this.formItemAdd.mail
          params.isRemotely = this.formItemAdd.longRange
          params.passwordNew = this.formItemAdd.passWd
          params.status = this.formItemAdd.status
          params.passwordConfirm = this.formItemAdd.passWdCheck
          params.createdBy = this.$store.state.user.userInfo.userName
          params.roleDetails = this.checkmemberGroup
          params.disableAction = this.$store.state.memberViewPermission.disableAction

          // @mark 传禁止权限对象
          params.disableData = this.$store.state.memberViewPermission.disableData
          // params.disableShop = this.$store.state.memberViewPermission.disableShop
          // params.disableCategory = this.$store.state.memberViewPermission.disableCategory
          // params.disableVendor = this.$store.state.memberViewPermission.disableVendor
          // params.disableDepartment = this.$store.state.memberViewPermission.disableDepartment
          // params.disableXcDepartment = this.$store.state.memberViewPermission.disableXcDepartment
          console.log(params)
          userAddCopy(params).then(res => {
            this.hackResetAdd = false
            this.$refs['formItemAdd'].resetFields()
            this.order = ''
            this.dir = ''
            this.initDataList(1, this.pageSize)
            this.$Message.success('操作成功!')
          })
        } else {
          this.$Message.error('请填写完整信息!')
        }
      })
    },
    checkRoleChange () {
      this.spinShow = true
      this.spinShowAdd = true
      this.actionListData = {}
      this.listDataPermissionList = {}
      if (this.checkmemberGroup.length > 0) {
        this.roleValue = true
        this.width = 12
        this.modalWidth = 1200
        this.getUserPermissionsList(this.checkmemberGroup)
      } else {
        this.roleValue = false
        this.width = 24
        this.modalWidth = 600
        this.listDataPermissionList = {}
      }
    },
    search () {
      this.pageIndex = 1
      this.order = ''
      this.dir = ''
      this.initDataList(this.pageIndex, this.pageSize)
    },
    remove (userId) {
      let _this = this
      this.$Modal.confirm({
        title: '删除',
        content: `您确认要删除吗？`,
        onOk: function () {
          _this.$Loading.start()
          let para = { 'userId': userId,
            'type': 'del'
          }
          ModifyStatus(para).then((res) => {
            _this.initDataList(_this.pageIndex, _this.pageSize)
            this.$Message.success('操作成功!')
          })
        }
      })
    },
    handleRequestParams (current, pageSize, reqObj) {
      const userInfo = allStore.state.user.userInfo
      // 这里还需要拼接请求参数
      const para = { 'params':
                            { pageIndex: current, pageSize: pageSize, userName: this.userName.trim(), department: this.department, email: this.email.trim(), roleName: this.roleName.trim(), status: this.status, order: this.order, dir: this.dir }
      }
      const reqData = { 'id': 1, 'jsonrpc': '2.0', 'method': ''
      }
      Object.assign(reqData, para)
      this.opIndex = ''
      return reqData
    },
    initDataList (pageIndex, pageSize) {
      this.loading = true
      let _this = this
      const reqData = this.handleRequestParams(pageIndex, pageSize)

      getMemberList(reqData).then(res => {
        // @mark 这里要去掉 最外面data
        var myDate1 = new Date()
        const data = res.data.result
        this.loading = false
        _this.dataList = data.list
        _this.totalNum = data.pageInfo.totalNum - 0
        _this.pageIndex = data.pageInfo.pageIndex - 0
        _this.pageSize = data.pageInfo.pageSize - 0
        _this.$nextTick(() => {
          tableHeightFun(this, 'filterBox')
        })
      })
    },
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
    getArrEqual (obj1, obj2) {
      var newArr = []
      if (obj2 instanceof Array) {
        return newArr
      }
      let obj1Arr = []
      let obj2Arr = []
      for (var key1 in obj1) {
        obj1Arr.push(key1 + '')
      }
      for (var key2 in obj2) {
        obj2Arr.push(key2 + '')
      }
      for (let i = 0; i < obj2Arr.length; i++) {
        for (let j = 0; j < obj1Arr.length; j++) {
          if (obj1Arr[j] === obj2Arr[i]) {
            newArr.push(obj1Arr[j])
          }
        }
      }
      return newArr
    },
    addUserDom (params) {
      var _this = this
      _this.$refs['formItemAdd'].resetFields()
      _this.listDataPermissionList = {}
      _this.addListFlag = false
      _this.modifyFlag = true
      _this.modalTitl1 = '添加用户(复制)'
      _this.checkmemberGroup = []
      let userIdobj = { 'userId': params.row.userId
        //  "operatorId" : this.$store.state.user.userInfo.userId
      }
      userIdobj = JSON.stringify(userIdobj)
      console.log('添加用户')
      getUserInfo(userIdobj).then((res) => {
        let userInfo = res.data.result
        // _this.memberList = res.data.result.roleDetails
        // _this.$refs.vendorChild.getvendorsValue()
        console.log('userInfo.disableData')
        // isShowListDataPermission
        console.log(userInfo.disableData)
        console.log(_this.isShowListDataPermission)
        _this.formItemAdd.name = userInfo.userName
        _this.formItemAdd.department = userInfo.department + ''
        _this.formItemAdd.commonName = userInfo.commonName
        _this.formItemAdd.mail = userInfo.email
        _this.formItemAdd.longRange = userInfo.isRemotely + ''
        _this.formItemAdd.status = userInfo.status + ''
        _this.formItemAdd.passWdModify = ''
        _this.formItemAdd.passWdCheckModify = ''
        userInfo.disableAction == undefined ? [] : _this.$store.state.memberViewPermission.disableAction = userInfo.disableAction
        userInfo.disableData == undefined ? [] : _this.$store.state.memberViewPermission.disableData = userInfo.disableData

        // userInfo.disableShop == undefined ? [] : _this.$store.state.memberViewPermission.disableShop = userInfo.disableShop;
        // userInfo.disableCategory == undefined ? [] : _this.$store.state.memberViewPermission.disableCategory = userInfo.disableCategory;
        // userInfo.disableVendor == undefined ? [] : _this.$store.state.memberViewPermission.disableVendor = userInfo.disableVendor;
        // userInfo.disableDepartment == undefined ? [] : _this.$store.state.memberViewPermission.disableDepartment = userInfo.disableDepartment;
        // userInfo.xcDepartment == undefined ? [] : _this.$store.state.memberViewPermission.xcDepartment = userInfo.xcDepartment;
        // _this.$store.state.memberViewPermission.disableAction = userInfo.disableAction
        // _this.$store.state.memberViewPermission.disableShop= userInfo.disableShop
        // _this.$store.state.memberViewPermission.disableCategory= userInfo.disableCategory
        // _this.$store.state.memberViewPermission.disableVendor= userInfo.disableVendor
        // _this.$store.state.memberViewPermission.disableDepartment=userInfo.disableDepartment
        _this.currentUserId = userInfo.userId
        _this.hackResetAdd = true
        // const roleListKeyCurrent =  Object.getOwnPropertyNames(_this.memberList);
        // const roleListKeyUser = Object.getOwnPropertyNames(userInfo.roleDetails);
        _this.checkmemberGroup = _this.getArrEqual(_this.memberList, userInfo.roleDetails)
        if (_this.checkmemberGroup.length) {
          // this.spinShow = true;
          // this.spinShowAdd = true;
          _this.getUserPermissionsList(_this.checkmemberGroup)
          _this.roleValue = true
          _this.width = 12
          _this.modalWidth = 1200
        } else {
          _this.roleValue = false
          _this.width = 24
          _this.modalWidth = 600
          _this.listDataPermissionList = {}
        }
      })
    },
    modifyUserDom (params) {
      var _this = this
      _this.$refs['formItem'].resetFields()
      _this.listDataPermissionList = {}
      _this.addListFlag = false
      _this.modifyFlag = true
      _this.modalTitl1 = '编辑用户'
      _this.checkmemberGroup = []
      let userIdobj = { 'userId': params.row.userId
        //  "operatorId" : this.$store.state.user.userInfo.userId
      }
      userIdobj = JSON.stringify(userIdobj)
      getUserInfo(userIdobj).then((res) => {
        let userInfo = res.data.result
        _this.$store.state.memberViewPermission.disableAction = res.data.result.disableAction
        _this.formItem.name = userInfo.userName
        _this.formItem.department = userInfo.department + ''
        _this.formItem.commonName = userInfo.commonName
        _this.formItem.mail = userInfo.email
        _this.formItem.longRange = userInfo.isRemotely + ''
        _this.formItem.status = userInfo.status + ''
        _this.formItem.passWdModify = ''
        _this.formItem.passWdCheckModify = ''
        userInfo.disableAction == undefined ? [] : _this.$store.state.memberViewPermission.disableAction = userInfo.disableAction

        console.log(userInfo.disableData)
        userInfo.disableData == undefined ? [] : _this.$store.state.memberViewPermission.disableData = userInfo.disableData
        // console.log(_this.$store.state.memberViewPermission.disableData.disableShopIds )
        // userInfo.disableShop == undefined ? [] : _this.$store.state.memberViewPermission.disableShop = userInfo.disableShop;
        // userInfo.disableCategory == undefined ? [] : _this.$store.state.memberViewPermission.disableCategory = userInfo.disableCategory;
        // userInfo.disableVendor == undefined ? [] : _this.$store.state.memberViewPermission.disableVendor = userInfo.disableVendor;
        // userInfo.disableDepartment == undefined ? [] : _this.$store.state.memberViewPermission.disableDepartment = userInfo.disableDepartment;
        // userInfo.disableXcDepartment == undefined ? [] : _this.$store.state.memberViewPermission.disableXcDepartment = userInfo.disableXcDepartment;

        _this.currentUserId = userInfo.userId
        _this.hackReset = true
        _this.checkmemberGroup = _this.getArrEqual(_this.memberList, userInfo.roleDetails)
        if (_this.checkmemberGroup.length) {
          _this.getUserPermissionsList(_this.checkmemberGroup)
          _this.roleValue = true
          _this.width = 12
          _this.modalWidth = 1200
        } else {
          _this.roleValue = false
          _this.width = 24
          _this.modalWidth = 600
          _this.listDataPermissionList = {}
        }
      })
    },
    handleCheckAll (item) {
      const currentCheckAllGroup = []
      item.child.forEach(element => {
        currentCheckAllGroup.push(element.name)
      })
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        checkAllGroup = currentCheckAllGroup
      } else {
        checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === 3) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    checkAllFuc (item) {
      return 'checkAll' + item.actionId
    },
    // 获取角色权限
    getUserPermissionsList (arrList) {
      action(arrList).then(res1 => {
        this.actionListData = res1.data.result
        this.spinShow = false
        this.spinShowAdd = false
      })
      listDataPermission(arrList).then(res2 => {
        this.listDataPermissionList = res2.data.result
        console.log(this.listDataPermissionList)
      })
    },
    resetStoreData () {
      // s
      let restViewPermission = {
        roleId: 0,
        platformIds: [],
        accountIds: [],
        shopIds: [],
        categoryIds: [],
        vendorIds: [],
        departmentIds: [],
        disableAction: [],
        disableShop: [],
        disableCategory: [],
        disableVendor: [],
        disableDepartment: [],
        disableXcDepartment: []
      }
      this.$store.state.memberViewPermission = restViewPermission
    },
    showFlag (arr) {
      if (arr.length > 0) {
        return true
      } else {
        return false
      }
    },
    getButtonPermission (htmlId, flag) {
      let htmlIdArr = []
      for (var key in this.$store.state.user.userHtmlIds.ptxPermission) {
        htmlIdArr.push(key)
      }
      if (htmlIdArr.indexOf(htmlId) >= 0 && !this.$store.state.user.userHtmlIds.ptxPermission[htmlId]) {
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
    // this.htmlIdsValid = JSON.stringify(this.$store.state.user.userInfo.userHtmlIds)
    this.htmlIdsValid = this.$store.state.user.userHtmlIds
    // this.mockTableData()
    _this.operationId = this.$store.state.user.userInfo.userId
    _this.memberList = this.$store.state.user.userInfo.operatorRoleDetails
    getDepartments().then(res => {
      const data = res.data.result
      _this.departmentList = data
    })
    _this.initDataList(_this.pageIndex, _this.pageSize)
    _this.resetStoreData()
    window.onresize = function () {
      tableHeightFun(_this, 'filterBox')
    }
  }
}
</script>
<style>
@import "./icon/iconfont.css";
.user-tree .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
    border-radius: 0;
    background: #fff;
}
.user-tree .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
    border-top: 1px solid #3399ff;
    /* background: #92c1f0 */

}
.user-tree .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
}
/* .ivu-spin-fix{
  height:30vh
} */
</style>
