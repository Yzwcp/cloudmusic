<template>
  <div class="home">
      <Login @click.native="gologin" :level="level" :userObj="userObj"></Login>
      <grid></grid>
      <my-love @click.native="godetail" :likelength="likelength" ></my-love>
      <play-list :playList="playList"></play-list>
  </div>
</template>

<script>

import Login from "@/views/home/childComps/Login";
import Grid from "@/views/home/childComps/Grid";
import MyLove from "@/views/home/childComps/MyLove";
import PlayList from "@/views/home/childComps/PlayList";

import {userObjAPI, getPlayListAPI, getLikeListAPI,getLevelAPI} from '@/network/home'
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
      likeListId:null,//喜欢歌单id
      likelength:null ,     //喜欢歌单长度
      level:null, //等级
    }
  },
  created() {
     if (window.localStorage.getItem('token')) {
       this.getUserObj()
     }

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
          // 喜欢的音乐歌单id
          this.likeListId = res.data.playlist[0].id
          res.data.playlist.shift()
          res.data.playlist.shift()

          console.log(res )

          this.playList=res.data.playlist
        })
        //喜欢歌单列表
        getLikeListAPI(this.userObj.userId).then(res=>{
          this.likelength = res.data.ids.length
        })
        //用户等级
        getLevelAPI().then(res=>{
         this.level = res.data.data.level
        })
      })
    },
    godetail(){
      this.$router.replace(`singlist/${this.likeListId}`)
    },
    gologin(){
      this.$router.replace('/login')
    }
  },
}
</script>
<style scoped>
</style>
