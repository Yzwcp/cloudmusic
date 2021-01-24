<template>
  <div id="login">
    <div class="login-block">
      <div class="cicle">
        <img v-if="userObj.avatarUrl" :src="userObj.avatarUrl" alt="">
        <van-icon v-else  class="shotImg" name="manager" color="#F9D8DA" size="50px"/>
      </div>
      <div v-if="!userObj.avatarUrl">
        <span @click="goLogin">立即登录</span>
      </div>
      <div  v-else class="logined">
        <p>云里看物</p>
        <span>开通</span>
        <span><i>Lv{{userObj.vipType}}</i></span>
      </div>
      <van-icon name="arrow" size="20px"  class="right-iocn" />
    </div>
  </div>
</template>

<script>
export default {
name: "Login",
  props:{
    userObj:{}
  },
  methods:{
    goLogin(){
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
#login{padding:0 18px}
.cicle{
  width: 60px;
  height: 60px;
  border-radius:30px ;
  background: #F7F1F1;
  position: relative;
  overflow: hidden;
}
.shotImg{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-30%);
}
.login-block{
  padding: 0 5px;
  height: 100px;
  display: flex;
  align-items: center;
}
span{
  margin: 0 5px 0 15px;
}
.cicle img{
  width: 60px;
  height: 60px;
}
.logined{

}
.logined p{
  line-height: 25px;
  margin: 0 10px;
  font-size: 20px;
}
.logined span:nth-child(2){
  background: black;
  color: white;
  font-size: 6px;
  padding: 2px 10px;
  display: inline-block;
  width: 30px;
  text-align: center;
  border-radius: 10px;
}
.logined span:nth-child(3){
  background: white;
  color: black;
  font-size: 10px;
  padding: 0 10px;
  border-radius: 10px;
  margin: 0 5px;
}
.right-iocn{
  position: absolute;
  right: 18px;
}
</style>
