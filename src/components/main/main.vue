<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <a href='/psc'>
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
          </a>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avatar="userAvatar" v-on:childByValue="childByValue"/>
          <!-- <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
      <Modal v-model="modal2" width="460" :mask-closable="false" @on-ok="passwordModifyOk(formItem)" draggable> 
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>修改密码</span>
        </p>
         <Form ref="formItem" :model="formItem" :rules="ruleValidate" >
            <FormItem prop="userName">
              <Input disabled  v-model="formItem.userName">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="passWd">
              <Input type="password"  placeholder="新密码" v-model="formItem.passWd">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
             <FormItem prop="passWdCheck">
              <Input type="password"  placeholder="请再次输入新密码" v-model="formItem.passWdCheck">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
        </Form>
         <div slot="footer">
              <Button type="dashed" @click ="dashed">取消</Button>
              <Button type="primary" @click ="passwordModifyOk">确认</Button>
            </div>
      </Modal>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import { setToken } from '@/libs/util'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/P.png'
import maxLogo from '@/assets/images/login-logo.png'
import store from '@/store'
import './main.less'
import { truncate } from 'fs'
import {
  passwordModify
} from '@/api/user'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    const checkthis = this
    const validatePass = function (rule, value, callback) {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value != checkthis.formItem.passWdCheck && checkthis.formItem.passWdCheck) {
          callback(new Error('两次输入密码不匹配！'))
        }else if(value != checkthis.formItem.passWdCheck &&!reg.test(value)){
          callback(new Error('密码必须是6到64位并包含大小写英文字母和数字'))
        }else{
          callback()
        }

      }
    }
    const validatePassCheck = function (rule, value, callback) {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if (value === '') {
        callback(new Error('请再次输入你的密码'))
      } else if (value !== checkthis.formItem.passWd) {
        callback(new Error('两次输入密码不匹配!'))
      } else if(!reg.test(value)){
          callback(new Error('密码必须是6到64位并包含大小写英文字母和数字'))
        }else {
        callback()
      }
    }
    return {
      formItem: {
        email: '',
        passWd: '',
        passWdCheck: ''
      },
      modal2: false,
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      ruleValidate: {
        // email: [
        //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //   { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        // ],
        passWd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { max: 32, message: '不能超过32个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passWdCheck: [
          { required: true, message: '请重复输入你的密码', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { max: 32, message: '不能超过32个字符', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        interest: [
          { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      // 'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    childByValue (childValue) {
      this.modal2 = childValue
      this.$refs["formItem"].resetFields();
      this.formItem.userName = store.state.user.userInfo.userName
    },
    passwordModifyOk () {
      let formItem = this.formItem
      this.$refs["formItem"].validate((valid) => {
        if(valid){
          this.modal2 = false;
          passwordModify(store.state.user,formItem).then(res => {
            this.$Message.success('修改密码成功!')
            setToken('')
            this.$router.push({
              // name: this.$config.homeName
              name:'/login'
            })
          })
        }
      })
    },
    dashed(){
      this.modal2 = false
      this.$refs['formItem'].resetFields();
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    var noPermissionAction = this.$store.state.user.userHtmlIds.ptxPermission
    var noPermissionMenu = []
    for(var key in noPermissionAction){
      if(!noPermissionAction[key]){
        noPermissionMenu.push(key)
      }
    }
    //排除没权限的页签
    if(!noPermissionMenu.includes(this.$route.meta.permissionTitle)){
      const { name, params, query, meta } = this.$route
      this.addTag({
        route: { name, params, query, meta }
      })
    }
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    this.formItem.userName = store.state.user.userInfo.userName
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
<style>
.ivu-tooltip-inner-with-width{word-wrap: break-word}
.ivu-tree-empty{margin-top: 10px;margin-left: 5px}
</style>
