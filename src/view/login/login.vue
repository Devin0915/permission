<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" @sonToFatherFlag="sonToFatherFlag" @on-false-valid="getCaptchaImage" :imgUrl="imgUrl" :sonHandleSubmitFlag ='handleSubmitFlag'></login-form>
          <div class="passWdmod">
             <label @click="modal">修改密码</label>
          </div>
        </div>
      </Card>
    </div>
    <Modal v-model="modal2" width="460" :mask-closable="false" draggable>
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>修改密码</span>
        </p>
         <!-- <Form ref="formItem" :model="formItem" :rules="ruleValidate" @keydown.enter.native="handleSubmit"> -->
          <Form ref="formItem" :model="formItem" :rules="ruleValidate">
            <FormItem prop="email">
              <Input  placeholder="请输入用户名或者邮箱" v-model="formItem.email">
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
            <Row type="flex" class="code-row-bg">            
                <i-col span="12" style="padding-bottom:10px;margin-right:15px">
                    <FormItem prop="identifyingCode">
                      <Input placeholder="请输入验证码" v-model="formItem.identifyingCode" />
                    </FormItem>
                </i-col>
                <i-col span="10" style="padding-bottom:10px;">
                    <Button type="primary" @click='cendIdentCodeValid(formItem)' :disabled ="netFlag" >{{cendIdentCodeTitle}}</Button>
                </i-col>  
            </Row>
        </Form>
        <div slot="footer">
          <Button type="dashed" @click ="dashed">取消</Button>
          <Button type="primary" @click ="passwordRest">确认</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import {
  cendIdentCode,
  passwordRest,
  showCaptchaImage
} from '@/api/user'
export default {
  components: {
    LoginForm
  },
  data(){
      const checkthis = this
      const validatePass = function (rule, value, callback) {
        var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,64}$/
      if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (value != checkthis.formItem.passWdCheck && checkthis.formItem.passWdCheck) {
            callback(new Error('两次输入密码不匹配！'))
          } else if(!reg.test(value)){
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
        imgUrl:"",
        uid:'',
        handleSubmitFlag:false,
        cendIdentCodeTitle:"发送验证码",
        netFlag:false,
        formItem: {
          email: '',
          passWd: '',
          passWdCheck: '',
          identifyingCode : ''
        },
        count: '',
        timer: null,
        modal2: false,
        ruleValidate: {
          email: [
            { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
            // { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
          ],
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
          identifyingCode: [
            { required: true, message: '请输入验证码', trigger: 'change' },
            // { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
          ]
        }
      }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    dashed(){
      this.modal2 = false;

    },
    sonToFatherFlag(value){
      this.handleSubmitFlag = value
    },
    handleSubmit (loginInfo) {
      loginInfo.uid = this.uid
      this.handleLogin(loginInfo).then(res => {
        
        localStorage.setItem("tagNaveList",'[{"name":"home","params":{},"query":{},"meta":{"hideInMenu":true,"title":"首页","notCache":true,"icon":"md-home"}}]')
        this.getUserInfo(res).then(res => {
          this.handleSubmitFlag = false
          this.$router.push({
            // name: this.$config.homeName
            name:'psc'
          })
        })
      }).catch(res =>{
        console.log(this.handleSubmitFlag)
        this.handleSubmitFlag = false;
        console.log(res)
        this.getCaptchaImage()
      })
    },
    modal(){
      this.modal2 = true;
      this.$refs['formItem'].resetFields();
    },
    passwordRest(){
      this.$refs["formItem"].validate((valid)=>{
        if(valid){
          passwordRest(this.formItem).then( res => {
            this.modal2 = false;
            this.$Message.success('修改密码成功!');
          })
        }
      })
      
    },
    cendIdentCodeValid(formItem){
      const TIME_COUNT = 60
      var _this = this
      this.$refs['formItem'].validateField('email',function(validMessege){
        if(!validMessege){
          cendIdentCode(formItem).then(res =>{
            if (!_this.timer) {
              _this.count = TIME_COUNT;
              _this.timer = setInterval(() => {
                if (_this.count > 0 && _this.count <= TIME_COUNT) {
                  _this.count--;
                  _this.netFlag =true
                  _this.cendIdentCodeTitle = "重新获取("+_this.count+"秒)"
                } else {
                  clearInterval(_this.timer);
                  _this.timer = null;
                  _this.netFlag = false
                  _this.cendIdentCodeTitle = "发送验证码"
                }
              }, 1000)
            }
          })
        }
      });
    },
    getCaptchaImage(){
      showCaptchaImage().then(res =>{
        console.log(res.data.result)
        this.uid= res.data.result.uid,
        this.imgUrl = res.data.result.img
      })
    }
  },
  mounted() {
   this.getCaptchaImage()
  },
}
</script>

<style scope>
  .passWdmod {
    text-align: right
  }
  label{
    cursor:pointer;
  }
</style>
