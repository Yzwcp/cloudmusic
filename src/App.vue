<template>
  <div id="app">
<!--    <van-button @click="logout">退出</van-button>-->
<!--    <van-button @click="isLogout">登录状态</van-button>-->
    <keep-alive exclude="Found">
      <router-view :key="key"/>
    </keep-alive>
    <music-audio v-show="isshow !=='/musiclrc' "></music-audio>
    <nav-bar v-show=" isshow == '/' || isshow == '/found'|| isshow == '/cloudVillage'|| isshow == '/boke'"></nav-bar>


  </div>
</template>

<script>
import NavBar from "@/components/content/NavBar/NavBar";
import musicAudio from "@/components/content/audio/musicAudio";
import {logoutAPI,isLoginApi} from "@/network/home";

export default {
  components:{NavBar,musicAudio},
  methods:{
    logout(){
      logoutAPI().then(res=>{
        console.log(res)
      })
      window.localStorage.removeItem('token')
    },
    isLogout(){
      isLoginApi().then(res=>{
        console.log(res)
      })
    }
  },
  computed:{
    key() {
      return this.$route.path + Math.random();
    },
    isshow(){
      return this.$route.path
    }
  }
}
</script>

<style>
</style>
