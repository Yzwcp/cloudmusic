<template>
  <div class="audios">
    <audio @ended="ended" autoplay  @timeupdate="timeupdate" @canplay="canplay" :src="getStoreMusicInfo.musicUrl" ref="musicAudio"></audio>
    <li>
      <div class="hotimg">
        <img :src="getStoreMusicInfo.picUrl" alt="">
      </div>
      <div class="two">
          {{getStoreMusicInfo.musicTitle}} <span class="author">-{{getStoreMusicInfo.author}}</span>  </div>
      <div class="four">
        <van-circle stroke-width="45"  class="circle" v-model="currentRate" :rate="0"  color="black" layer-color="#A9A9A9"  size="24px"   />
        <van-icon v-show="!isShow" @click="playbtn" class="play" name="play"  size="14px"/>
        <van-icon  v-show="isShow" @click="stopbtn" class="pause" name="pause" size="14px" />
        <van-icon  name="bars" size="22px"/>
      </div>
    </li>
  </div>
</template>

<script>
// import {getMusicUrlAPI} from "@/network/home";
import {mapGetters,mapMutations} from 'vuex'

export default {
  name: "audios",
  data(){
    return{
      currentRate:0,
      //获取歌曲id
      musicUrlitemId:{},
      musicUrl:'',
      isShow:true,
    }
  },
  created() {
    this.$bus.$on('setMusicUrl',(res)=>{
      this.musicUrlitemId= res.id
    })

    //监听歌曲点击事件，点击歌曲为播放
    this.$bus.$on('musicisplay',(()=>{
      this.isShow =  true
    }))
  },
  methods:{
    ...mapMutations(['setPlay']),
    // 开始播放
    playbtn(){
      this.isShow = ! this.isShow
      this.play()
      //修改播放状态
      this.$store.commit('setShow',true)
    },
    //暂停播放
    stopbtn(){
      this.isShow = ! this.isShow
      //修改播放状态
       this.stop()
    },
    //当浏览器可以开始播放该音视频时产生该事件
    canplay(){
      this.currentRate = this.$refs.musicAudio.currentTime
      this.play()

    },
    //timeupdate  当前播放位置发生改变时产生该事件
    timeupdate(){
      this.currentRate = (this.$refs.musicAudio.currentTime / this.$refs.musicAudio.duration)*100
    },
    //播放结束btn
    ended(){
      //重新加载音乐源
      this.$refs.musicAudio.load()
    },
    //播放逻辑
    play(){
        this.$refs.musicAudio.play()},
    //暂停
    stop(){
      this.$refs.musicAudio.pause()
    }
  },
  computed:{
    ...mapGetters(['getStoreMusicInfo'])
  },
}
</script>

<style scoped>
.audios li{

  height: 49px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:0 18px 10px 18px;
}
.audios{
  position: fixed;
  bottom: 0;
  background: white;
  width: 100%;

}

.audios hotimg {
  padding-left:18px;
}
.audios li .two{
  width: 200px;
  white-space:nowrap;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  overflow: hidden;
  font-size: 14px;
}
.audios .four .circle{
  margin-right: 20px;
}
.audios .four{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.van-icon van-icon-circle{
}
.play,.pause{
  position: absolute;
  right: 64px;
}
.hotimg img{
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
.author{
  font-size: 12px;
  color:#A9A9A9 ;

}
</style>
