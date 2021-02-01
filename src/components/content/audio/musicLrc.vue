<template>
  <div class="musicLrc">
      <nav-bar>
        <div class="left" @click="goback" slot="left"><van-icon name="arrow-down" size="22px"/></div>
        <div class="center" slot="center">
          <div> {{nowSong.name}} </div>
          <p>{{nowSong.author}}</p>
        </div>
        <div class="left" slot="right"><van-icon name="revoke" size="24px"/></div>
      </nav-bar>
    <div class="content bgcontent" >
      <div class="bgcontent" :style="{background:'url(' + nowSong.picUrl + ')no-repeat center',backgroundSize:'200%',filter:'blur(40px)'}"></div>
      <img @click="showLrcComps" :src="nowSong.picUrl" alt="">
      <div class="progress">
        <span >{{ audioInfo_currentTime| format}}</span>
        <van-slider active-color="#E6E6E6" inactive-color="#949394" v-model="getProgressdata" button-size="8px" @input="sliderChange" />
        <span >{{ audioInfo_duration  | format}}</span>
      </div>
      <div class="tabnav">
        <li><van-icon size="22px" name="replay" color="white" /></li>
        <li><van-icon @click="before" size="22px"  color="white" name="play" class="reserve" /></li>
        <li><van-icon size="40px" @click="btn" color="white" v-show="!isPlay" name="play-circle-o" /><van-icon color="white" @click="btn" size="40px" v-show="isPlay" name="pause-circle-o" /></li>
        <li><van-icon @click="next" size="22px" color="white" name="play" /></li>
        <li><van-icon size="22px" name="bars"  color="white"/></li>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import {mapGetters,mapMutations,mapState} from 'vuex'
import {deepClone} from "@/common/deepClone";
import {getLyricAPI, getMusicUrlAPI} from "@/network/home";
export default {
name: "musicLrc",
  data(){
    return{
      getProgressdata:0,
    }
  },
  components:{NavBar},
  created() {
    //如果页面刷新 就跳转到首页
    if (this.setlengh ==0) return  this.$router.replace('/')

  },
  methods:{
  ...mapMutations(['setIsplay','setNowSong','setAudioCurrentTime','setAudioInfo_NowTime']),
    goback(){
    //设置显示音乐播放器
      this.$router.back()
    },
    sliderChange(v){
      this.getProgressdata = v
      this.setAudioInfo_NowTime((this.audioInfo_duration * v * 0.01).toFixed(6))
    },
    btn(){
      //修改播放状态
      this.setIsplay(!this.isPlay)
    },
    //上一首
    before(){
      this.autoNext(false)
    },
    //下一首
    next(){
      this.autoNext(true)
    },
    async autoNext(chagne){
      var i = this.nowSong.index
      if (chagne){
        i = i + 1
      }else{
        i = i - 1
      }
      if (i<0){
        i=this.setlengh-1
      }
      if(i>this.setlengh-1){
        i=0
      }
      //在vux查找当前点击音乐
      var obj ={}
      this.$store.state.nowMusicList.some((item)=>{
        if (item.index  == i)  {
          obj =deepClone( item)
        }
      })
      //根据当前音乐 的id查找音乐url
      const {data:songurl} = await getMusicUrlAPI(obj.id)
      if(songurl.code!=200) return  this.$toast('没有找到歌曲')
      obj.url = songurl.data[0].url
      const {data:lrcurl} = await getLyricAPI(obj.id)
      if(lrcurl.code!=200) return  this.$toast('没有找到歌词')
      obj.lrc = lrcurl.lrc.lyric
      Promise.all([songurl,lrcurl]).then(()=>{
        //发送当前点击音乐信息到vux
        this.setNowSong(obj)
        this.setIsplay(true)

      })

    },
    //显示歌词
    showLrcComps(){

    }

  },

  computed:{
  ...mapGetters(['setPrecent','setlengh']),
    ...mapState(['isPlay','nowSong','audioInfo_duration','audioInfo_currentTime'])
  },
  watch:{
    setPrecent(){
      this.getProgressdata = this.setPrecent
    },
  },
  filters:{
    format(val){
      const mm=Math.floor(val/60)
      const m =Math.floor(val/60)<10? "0" + mm : mm
      return  parseInt(val % 60)<10 ? m+':' + '0' + parseInt(val % 60) :
          m+':' + parseInt(val % 60)
    }
  }
}
</script>

<style scoped>
.musicLrc .left{justify-content: center;display: flex;align-items: center}
.nav-bar{
  position: absolute;
  top: 0;
  color: white;
  text-align: center;
  width: 100%;
  z-index: 99;
}
.musicLrc{
  position: absolute;
  top: 0;
  z-index: 100;
  background: white;
  width: 100%;
}
.content{
  height:100vh;
}
.content{
  height:  100vh;
  align-items:center;
}
.musicLrc img{
  width: 200px;
  height: 200px;
  border-radius: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border: #FC4032 1px solid;
}
.tabnav{height: 80px}
.tabnav,.progress{
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.progress{ bottom: 80px;color: white;}
.reserve{transform: rotate(180deg)}
.progress span{margin:  0 10px;font-size: 14px}
.center{display: flex;flex-direction: column;justify-content: center;align-items: center}
.center p{line-height: 20px;color: #A9A9A9;font-size: 2px }
.center div{
    line-height:14px;
    font-size: 14px;
    width: 200px;
    white-space:nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    overflow: hidden;
}
.bgcontent{
  height: 100vh;  content: "11";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
.bgcontent ::before {

}
</style>
