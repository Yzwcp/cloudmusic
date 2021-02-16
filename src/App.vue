<template>
  <div id="app">
<!--    <van-button @click="logout">退出</van-button>-->
<!--    <van-button @click="isLogout">登录状态</van-button>-->
    <transition :name="transitionName">
        <keep-alive>

          <router-view :key="key"/>
        </keep-alive>

    </transition>
<!--    <transition name="v" >-->
      <music-audio v-show="isshow !== '/musiclrc' && ex !== '/songlistcomment' "></music-audio>
<!--    </transition >-->
    <nav-bar v-show=" isshow == '/' || isshow == '/found'|| isshow == '/cloudVillage'|| isshow == '/boke'"></nav-bar>


  </div>
</template>

<script>
import NavBar from "@/components/content/NavBar/NavBar";
import musicAudio from "@/components/content/audio/musicAudio";
import {logoutAPI,isLoginApi} from "@/network/home";

export default {
  components:{NavBar,musicAudio},
  data(){
    return{
      transitionName:''
    }
  },
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
    },
    ex(){
      var str= this.$route.path
      return  str.slice(0,16)
    }
// /songlistcomment
  },
  watch:{
    $route(to){
      // console.log(to.path)
      // console.log(from.path)
      if (to.meta.index==0){
        this.transitionName  ='slide-left'
      }else{
        this.transitionName  =''
      }
    }
  }
}
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(0,-100%, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(0,100%, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%,0,0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%,0,0);
}
</style>
