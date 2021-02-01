<template>
  <div :class="{audios:true,bottom:isshow=='/' || isshow == '/found'|| isshow == '/cloudVillage'|| isshow == '/boke'}"
    v-if="isShow"
  >
    <audio
        :src="nowSong.url"
        ref="musicAudio"
        @canplay="_canplay"
        @timeupdate="_timeupdate"
        @ended="_ended"
        autoplay
        @playing="_playing"
    ></audio>
    <li @click="goLrc">
      <div class="hotimg">
        <img :src="nowSong.picUrl" alt="">
      </div>
      <div class="two">{{nowSong.name}}<span class="author"><span class="line">-</span>{{nowSong.author}}</span>  </div>
      <div class="four">
        <van-circle stroke-width="45"  class="circle" v-model="currentRate" :rate="0"  color="black" layer-color="#A9A9A9"  size="24px"   />
        <van-icon v-if="!isPlay" @click.stop="btn" class="play" name="play"  size="14px"/>
        <van-icon v-if="isPlay"  @click.stop="btn" class="pause" name="pause" size="14px" />
        <van-icon  name="bars" size="22px"/>
      </div>
    </li>
  </div>
</template>

<script>
// import {getMusicUrlAPI} from "@/network/home";
import {mapState,mapMutations,mapGetters} from 'vuex'
import {deepClone} from "@/common/deepClone";
import {getLyricAPI, getMusicUrlAPI,} from "@/network/home";

export default {
  name: "audios",
  data(){
    return{
      currentRate:0,
    }
  },
  created() {

  },
  methods:{
    ...mapMutations(['setNowSong','nowMusicList','setIsplay','setAudioDuration','setAudioCurrentTime']),
    btn(){
      //修改播放状态
      this.setIsplay(!this.isPlay)
      if (!this.isPlay) return  this.$refs.musicAudio.pause()
      this.$refs.musicAudio.play()
    },
    _canplay(){
    },
    _timeupdate(){
        this.setAudioCurrentTime(this.$refs.musicAudio.currentTime)
      console.info('start:' + this.$refs.musicAudio.buffered.start(0) + ',end:' + this.$refs.musicAudio.buffered.end(0));
    },
    _ended(){
      //自动播放下一首
      this.autoNext()
    },
    //自动下一首
    async autoNext(){
      var i = this.nowSong.index
      i = i + 1
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

      })

    },
    goLrc(){
        this.$router.push('/musiclrc')
    },
    _playing(){
      //初始化当前播放时间
      this.setAudioCurrentTime(this.$refs.musicAudio.currentTime)
      this.setAudioDuration(this.$refs.musicAudio.duration)
    }
  },
  computed:{
    ...mapState(['isPlay','isShow','nowSong','audioInfo_NowTime']),
    ...mapGetters(['setPrecent','setlengh']),
    isshow(){
     return this.$route.path
    }

  },
  watch:{
    setPrecent(){
      this.currentRate = this.setPrecent

    },
    isPlay(){
      this.$nextTick(()=>{
        if (!this.isPlay) return  this.$refs.musicAudio.pause()
        this.$refs.musicAudio.play()
      })
    },
    audioInfo_NowTime(){
        this.$refs.musicAudio.currentTime=this.audioInfo_NowTime
    }
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
  position: sticky;
  bottom: 0px;
  background: white;
  width: 100%;

}
.line{margin: 0 5px}
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
.bottom{
  bottom: 50px;
}
</style>
