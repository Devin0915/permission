<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" id="login-email" placeholder="请输入用户名或邮箱">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" id="login-password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <Row>
      <i-col span="8">
        <FormItem prop="checkIden">
          <Input  v-model="form.checkIden" id="login-checkWord" placeholder="请输入验证码"/>
        </FormItem>    
      </i-col>
      <i-col span="8" style= 'float:right'>
        <img :src="imgUrl" id="captcha" style="cursor:pointer" @click ="getcheckIden"/>
      </i-col>
    </Row>
    <FormItem>
      <Button @click="handleSubmit" id="login-submit" type="primary" long :disabled="handleSubmitFlag">
          <span v-if="!handleSubmitFlag">登录</span>
          <span v-else>Loading...</span>
      </Button>
    </FormItem>
  </Form>
</template>
<script>
import {
  showCaptchaImage
} from '@/api/user'
export default {
  name: 'LoginForm',
  props: {
    sonHandleSubmitFlag:'',
    imgUrl:"",
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '不能少于6个字符', trigger: 'blur' },
          { max: 32, message: '不能超过32个字符', trigger: 'blur' }
        ]
      }
    },
    checkIdenRules:{
      type:Array,
      default:()=>{
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  data () {
    return {
      handleSubmitFlag:this.sonHandleSubmitFlag,
      form: {
        userName: '',
        password: '',
        checkIden:''
      },
    }
  },
  watch:{
    sonHandleSubmitFlag:function(newValue,oldValue){
      this.handleSubmitFlag = newValue
    },
      handleSubmitFlag:function(newValue){
      this.$emit('sonToFatherFlag', newValue)
    }
  }, 
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        checkIden:this.checkIdenRules
      }
    }
  },
  methods: {
    handleSubmit () {
      var dom = document.getElementsByClassName("ivu-btn-long")[0]
      dom.focus();
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.handleSubmitFlag = true;
          let loginInfo = {}
          loginInfo.entity = this.form.userName,
          loginInfo.password = this.form.password,
          loginInfo.captcha = this.form.checkIden,
          this.$emit('on-success-valid', loginInfo)
        }
      })
    },
    getcheckIden(){
      this.$emit('on-false-valid')
    }
  }
}
</script>
