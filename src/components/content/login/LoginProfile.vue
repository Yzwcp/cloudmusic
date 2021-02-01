<template>
  <div class="logins">
    <div class="appimg" :style="login">
      <van-form ref="loginFormRef" @submit="onSubmit" class="form-p" @failed="failed">
        <van-field
            v-model="formData.user"
            name="用户名"
            label="用户名"
            :rules=rules.user
        />
        <van-field
            v-model="formData.password"
            type="password"
            name="密码"
            label="密码"
            :rules=rules.password
        />
        <div style="margin: 16px;">
          <van-button plain hairline block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import {getLoginListAPI} from "@/network/home";

export default {
name: "LoginProfile",
  data(){
    return{
      // 背景图
      login: {
        backgroundImage:"url(" + require("assets/img/app.webp")  + ")",
        backgroundPositionX:"50%",
        backgroundPositionY:"20%",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      },
      formData:{
        user:null,
        password:null
      },
      rules:{
        user:[
          {require:true,pattern :/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/}
        ],
        password: [{require:true}]
      },
      profile:null
    }
  },
  methods:{
    onSubmit(values) {
      getLoginListAPI(values['用户名'],values['密码']).then(res=> {
        console.log(res)
        if (res.data.code === 502){
          return this.$toast('密码错误')
        } else if(res.data.code === 501){
          return this.$toast('账号错误')
        }else {
          this.profile = res.data
          window.localStorage.setItem('token',res.data.token)
          this.$router.replace('/')
          this.$bus.$emit('setProfile',res.data)
        }
      })
    },
    failed(){
      this.$toast('手机号或密码错误')
    }
  }
}
</script>

<style scoped>
.appimg{
  position: absolute;
  z-index: 99;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding:330px 30px;
}
.van-cell{
  border-radius: 30px;
  margin: 10px 0;
}
.van-button--plain{
  background: rgba(0,0,0,0);
  border: 1px seashell solid;
  color: white;
  border-radius: 50px;
  outline: none;
}
.van-hairline--surround::after {
  border-width:0;
}
.van-field__error-message{
  position: absolute;
}
.logins{
  position: relative;
  top: -44px;
}
</style>
