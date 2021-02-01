<template>
  <div class="home">
      <Login :userObj="userObj"></Login>
      <grid></grid>
      <my-love></my-love>
      <play-list :playList="playList"></play-list>
  </div>
</template>

<script>
import Login from "@/views/home/childComps/Login";
import Grid from "@/views/home/childComps/Grid";
import MyLove from "@/views/home/childComps/MyLove";
import PlayList from "@/views/home/childComps/PlayList";

import {userObjAPI,getPlayListAPI} from '@/network/home'
export default {
  name: 'Home',
  components: {
    Login, Grid, MyLove, PlayList
  },
  data() {
    return {
      //用户详情
      userObj: {},
      //收藏列表
      playList:{},
    }
  },
  created() {
     if (window.localStorage.getItem('token')) this.getUserObj()

  },
  methods: {
    //获取用户账号信息
    getUserObj() {
      userObjAPI().then(res=>{
        if (res.data.code!==200) return this.$toast('获取用户数据失败')
        this.userObj = res.data.profile
      }).finally(()=>{
        //获取用户收藏专栏
        getPlayListAPI(this.userObj.userId).then(res=>{
          if(res.data.code!==200) return this.$toast('获取收藏列表失败')
          res.data.playlist.shift()
          this.playList=res.data.playlist
        })
      })
    },

  },
}
</script>
<style scoped>
</style>
