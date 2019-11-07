<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar icon="ios-person" :src="userAvatar"/>
         
      </Badge>
      <span style="margin-left: 6px;">{{userName}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem name="resetPassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import store from '@/store'
export default {
  name: 'User',
  data () {
    return {
      modal2: true,
      userName:''
    }
  },
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$emit('childByValue', this.modal2)
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'resetPassword': this.message()
          break
      }
    }
  },
   mounted () {
     this.userName =  store.state.user.userInfo.userName;
   }
  
}
</script>
<style>
.ivu-icon-ios-person{
  font-size: 24px
}
</style>


