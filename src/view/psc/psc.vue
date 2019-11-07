<template>
    <div>      
  
    <Header class="home-header">
          <user style="float:right" v-bind:userName="formItem.userName" v-on:childByValue="childByValue"/>
      </Header>
    <Content class="main-content-con">
        
            <div class="layout-content">
            <Row type="flex" justify="start" class="code-row-bg"> 
                <!-- <i-Col span="1" ></i-Col> -->
                <i-Col :xxl="{span:4}" :lg="{span: 5}" :md="{span: 7}"  :xs="{span: 12}"  class="menu-item">
                    <a href="javascript:void(0)" @click="loginOther('ptxErp')">
                        <template>
                            <Card >
                                <div class="menu-item-title " >
                                    <h3>ERP系统</h3>
                                    <div class="img-item erp-img">
                                        <img  src="./image/erp_icon.jpg" >
                                    </div>
                                
                                </div>
                            </Card>
                        </template>
                    </a>
                </i-Col>
                <i-Col :xxl="{span:4}" :lg="{span: 5}" :md="{span: 7}"  :xs="{span: 12}"  class="menu-item">
                    <a href="javascript:void(0)" @click="loginOther('ptxXc')">
                        <template>
                            <Card >
                                <div class="menu-item-title " >
                                    <h3>销售参谋</h3>
                                    <div class="img-item erp-img">
                                        <img  src="./image/sell_icon.jpg" >
                                    </div>
                                
                                </div>
                            </Card>
                        </template>
                    </a>
                </i-Col>
                <i-Col :xxl="{span:4}" :lg="{span: 5}" :md="{span: 7}"  :xs="{span: 12}"  class="menu-item">
                    <a href="javascript:void(0)" @click="loginOther('ptxWk')">
                        <template>
                            <Card >
                                <div class="menu-item-title " >
                                    <h3>挖矿系统</h3>
                                    <div class="img-item erp-img">
                                        <img  src="./image/wk_icon.jpg" >
                                    </div>
                                
                                </div>
                            </Card>
                        </template>
                    </a>
                </i-Col>
                <i-Col :xxl="{span:4}" :lg="{span: 5}" :md="{span: 7}"  :xs="{span: 12}"   class="menu-item">
                    <a href="javascript:void(0)" @click="loginOther('ptxKf')">
                        <template>
                            <Card >
                                <div class="menu-item-title " >
                                    <h3>电话客服</h3>
                                    <div class="img-item erp-img">
                                        <img  src="./image/call_icon.jpg" >
                                    </div>
                                
                                </div>
                            </Card>
                        </template>
                    </a>
                </i-Col>
                <i-Col :xxl="{span:4}" :lg="{span: 5}" :md="{span: 7}"  :xs="{span: 12}"   class="menu-item">
                    <a href="javascript:void(0)" @click="loginOther('ptxKfjp')">
                        <template>
                            <Card >
                                <div class="menu-item-title " >
                                    <h3>乐天客服</h3>
                                    <div class="img-item erp-img">
                                        <img  src="./image/call_icon.jpg" >
                                    </div>
                                
                                </div>
                            </Card>
                        </template>
                    </a>
                </i-Col>                
                 <i-Col :xxl="{span:4}" :lg="{span: 5}" :md="{span: 7}"  :xs="{span: 12}"   class="menu-item" v-if="getButtonPermission('permission_permission_permission','out')">
                    <a href='./home'>
                        <template>
                            <Card >
                                <div class="menu-item-title " >
                                    <h3>权限系统</h3>
                                    <div class="img-item erp-img">
                                        <img  src="./image/permission_icon.jpg" >
                                    </div>
                                
                                </div>
                            </Card>
                        </template>
                    </a>
                </i-Col>


            </Row>
            <Row type="flex" class="code-row-bg"> 
                <i-Col span="1" ></i-Col>
               
            </Row>
            </div>
    </Content>
    <div>
        <Modal v-model="userModal" width="460" @on-ok="passwordModifyOk(formItem)" :mask-closable="false" v-if="hackReset" draggable>
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>修改密码</span>
            </p>
            <Form ref="formItem" :model="formItem" :rules="ruleValidate" >
                <FormItem prop="userName">
                <i-Input disabled  v-model="formItem.userName">
                    <span slot="prepend">
                    <Icon :size="16" type="ios-person"></Icon>
                    </span>
                </i-Input>
                </FormItem>
                <FormItem prop="passWd">
                <i-Input type="password"  placeholder="新密码" v-model="formItem.passWd">
                    <span slot="prepend">
                    <Icon :size="14" type="md-lock"></Icon>
                    </span>
                </i-Input>
                </FormItem>
                <FormItem prop="passWdCheck">
                <i-Input type="password"  placeholder="请再次输入新密码" v-model="formItem.passWdCheck">
                    <span slot="prepend">
                    <Icon :size="14" type="md-lock"></Icon>
                    </span>
                </i-Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="dashed" @click ="dashed">取消</Button>
                <Button type="primary" @click ="passwordModifyOk">确认</Button>
                </div>
        </Modal>
    </div>
    </div>

</template>
<script>
import HeaderBar from './template/main/components/header-bar'
import User from './template/main/components/user/'
import store from '@/store'
import { setToken } from '@/libs/util'
import {passwordModify,getSingleSignOnUrl} from '@/api/user'
import Cookies from 'js-cookie'
export default {
    components: {
        User
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
                }else if(!reg.test(value)){
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
            userModal:false,
            hackReset:false,
            formItem:{
                email: '',
                passWd: '',
                passWdCheck: ''
            },
            ruleValidate:{
                passWd: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                passWdCheck: [
                    { required: true, message: '请重复输入你的密码', trigger: 'blur' },
                    { validator: validatePassCheck, trigger: 'blur' }
                ],
                interest: [
                    { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
                    { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        childByValue(){
            this.userModal = true;
            this.hackReset = true;
            this.$refs['formItem'].resetFields();
            this.formItem.userName = store.state.user.userInfo.userName
            
        },
        passwordModifyOk () {
            let formItem = this.formItem
            console.log(store)
            this.$refs["formItem"].validate((valid) => {
                if(valid){
                this.userModal = false;
                passwordModify(store.state.user,formItem).then(res => {
                    this.dashed();
                    setToken('')
                    this.$router.push({
                    // name: this.$config.homeName
                        name:'/login'
                    })
                })
                }
            })            
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
        },
        dashed(){
            // this.hackReset = false
            this.userModal = false
            this.$refs['formItem'].resetFields();
        },
        loginOther(systemCode){
            // /api/user/getSingleSignOnUrl

            // getSingleSignOnUrl
            var datas = {"systemCode":systemCode}
            getSingleSignOnUrl(datas).then(res => {
                    var url = res.data.result.singleSignOnUrl+"?"+ 'token='+ JSON.parse(store.state.user.token).authToken;
                    // console.log(url)
                    // var url = keyUrl+ "?"+ 'token='+ JSON.parse(store.state.user.token).authToken;
                    // window.location.href = url;
                    window.open(url, "_blank"); 
            })
    
        }
    },
    mounted () {
        this.formItem.userName = store.state.user.userInfo.userName
    }
}
</script>

<style >
.psc .ivu-card-head{
    /* background-color: #16A8F8; */
    font-size: 18px;
}
.home-header{
    background-color: #ffffff;
    height: 50px;
    line-height: 50px;
        border-bottom: 1px solid #dcdee2;
    border-color: #e8eaec;
}
.main-content-con{
    /* background-color: rebeccapurple; */
    width: 100%;
    height: 100%;
    /* background: yellow; */
    position: absolute;
    background-image: url('../../assets/images/home_gj.jpg') ;
    background-size:100% 100%;  
}
.layout-content{
    margin-left: 50px;
    /* margin-right: 40px; */
}
.menu-item{
    /* background-color: red; */
    margin-top: 20px;
    height: 180px;
    /* width: 360px; */
        text-align: center;
    margin-right: 50px;

}
.menu-item .ivu-card-body:hover{
    box-shadow:12px 20px 16px #E8E5E5;
     /* border:1px solid green; */

}
.menu-item-title{}
.menu-item-title h3{
    line-height: 140px;
    font-size: 20px;
    display: inline;
}
.img-item{
    float: right;
    height: 140px;
    text-align:center;
    
}
.img-item img{
    margin-top: 20px;
    width: 116px; 
    height: 108px;
}
.menu-item a{
    color: #8E8E8E;
}

.menu-item a:hover{
    color: #2D8cF0;
}
</style>