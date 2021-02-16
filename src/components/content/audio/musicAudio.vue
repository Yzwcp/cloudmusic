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
        <img :src="nowSong.picUrl" alt="" v-if="!loading">
        <loading :istext="false" v-if="loading"></loading>
      </div>

      <div class="two">{{nowSong.name}}<span class="author"><span class="line">-</span>{{nowSong.author}}</span>  </div>
      <div class="four">
        <van-circle stroke-width="45"  class="circle" v-model="currentRate" :rate="0"  color="black" layer-color="#A9A9A9"  size="24px"   />
        <van-icon v-if="!isPlay" @click.stop="btn" class="play" name="play"  size="14px"/>
        <van-icon v-if="isPlay"  @click.stop="btn" class="pause" name="pause" size="14px" />
        <van-icon  @click.stop="historybtn"  name="bars" size="22px"/>

      </div>
    </li>
    <transition name="fade">
    <div  class="bgbg" :show="show"  @touchmove.prevent  @click.stop="show = false" v-if="show">
      <scroll :scrollX="true" class="scrollX" @click.stop  :probeType="2" ref="scrollX">
        <div class="box" @click.stop>
          <div class="box-1" @click.stop>
            <div class="title"> <span>上次播放</span></div>
            <scroll class="scrollY">
              <SongList :ishistory="true" ref="one" :close="true" @removehis="removehis"  :playlistTracks="historySongList"></SongList>
            </scroll>
            <div class="next" @click.stop="next">下一页</div>

          </div>
          <div class="box-2" @click.stop>
            <div class="title">一周听歌记录Top100</div>
            <scroll class="scrollY" >
              <SongList :weekday="true"  ref="two"  :playlistTracks="weekData"></SongList>
            </scroll>
            <div class="next" @click.stop="before">上一页</div>
          </div>
        </div>
      </scroll>
<!--      <div>下一页</div>-->
    </div>
    </transition>
  </div>
</template>

<script>
// import {getMusicUrlAPI} from "@/network/home";
import {mapState,mapMutations,mapGetters} from 'vuex'
import {deepClone} from "@/common/deepClone";
import {getLyricAPI, getMusicUrlAPI, getHistory, SingInfo} from "@/network/home";
import scroll from '@/components/common/scroll/Scroll'
import SongList from "@/components/content/singList/ChildComps/SongList";
import loading from "@/components/common/loading/loading";
export default {
  name: "audios",
  data(){
    return{
      show:false,
      currentRate:0,
      weekData:[],
      historySongList:[],
      arr:[]
    }
  },
  components:{scroll,SongList,loading},
  created() {
    this._getHistory()


  },
  methods:{
    ...mapMutations(['setsongTimeArr','setSongLrclist','setNowSong','nowMusicList','setIsplay','setAudioDuration','setAudioCurrentTime']),
    async _getHistory(){
      this.historySongList = JSON.parse(window.localStorage.getItem('historySong'))
     const {data:res} = await getHistory(389780412)
      if (!window.localStorage.getItem('token')) return this.weekData= []
      res.allData.some((item)=>{
        this.weekData.push(new SingInfo(item.song))
      })
    },
    btn(){
      //修改播放状态
      this.setIsplay(!this.isPlay)
      if (!this.isPlay) return  this.$refs.musicAudio.pause()
      this.$refs.musicAudio.play()
    },
    _canplay(){
    },
    _timeupdate(){

      this.$store.state.audioInfo_currentTime = this.$refs.musicAudio.currentTime


      // console.info('start:' + this.$refs.musicAudio.buffered.start(0) + ',end:' + this.$refs.musicAudio.buffered.end(0));
    },
    _ended(){
      //自动播放下一首
      this.autoNext()
    },
    next(){
      this.$refs.scrollX.scrollTo(-this.$refs.one.$el.clientWidth)
    },
    before(){
      this.$refs.scrollX.scrollTo(this.$refs.one.$el.clientWidth)
    },
    removehis(id){
      setTimeout(()=>{
        var arr= JSON.parse(window.localStorage.getItem('historySong'))
        arr = arr.filter(item=>{
          return item.id !==id
        })
        window.localStorage.setItem('historySong',JSON.stringify(arr))
        this.historySongList = arr
      },200)
    },
    //随机播放
    random(){
      this.$refs.musicAudio.loop  =false

      // var i = that.nowSong.index
      var length = this.setlengh
      var i =Math.floor(Math.random() * length)
      //排除本身现在播放的歌曲
      while (i == this.nowSong.index){
        i =Math.floor(Math.random() * length)
      }
      return i
    },
    //列表播放
    add(chagne){
      this.$refs.musicAudio.loop  =false

      let i = null
      this.$store.state.nowMusicList.forEach((item,index)=>{
        if (item.id == this.$store.state.nowSong.id){

          i = index
        }
      })
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
      return i
    },
    //自动下一首
    async autoNext(chagne=true){

      var  i =null
      if(this.songLoop ==0){
        i = this.add(chagne)
      }else if(this.songLoop ==1){
        i = this.random()
      }else{
        //单曲循环
        i =this.nowSong.index

        this.setNowSong({})

      }


      //在vux查找当前点击音乐
      var obj ={}
      this.$store.state.nowMusicList.some((item,index)=>{
        if (index  == i)  {
          obj =deepClone( item)
        }
      })

      //根据当前音乐 的id查找音乐url
      const {data:songurl} = await getMusicUrlAPI(obj.id)
      if(songurl.code!=200) return  this.$toast('没有找到歌曲')
      obj.url = songurl.data[0].url
      const {data:lrcurl} = await getLyricAPI(obj.id)
      if(lrcurl.code!=200) return  this.$toast('没有找到歌词')
      //版权
      if(!obj.url){
        this.$toast('当前歌曲没有版权,为您自动播放下一首')
        this.autoNext()
        this.$forceUpdate()
      }
      //判断有没有歌词
      if (!lrcurl.lrc){
        //发送当前点击音乐信息到vux
        this.$store.commit('setNowSong',obj)
        //发送歌词素组
        this.$store.commit('setSongLrclist',['这首歌没有歌词'])
        //发送歌词时间素组
        this.$store.commit('setsongTimeArr',[0])
        return
      }




      //歌词text素组
      let lrctext =  lrcurl.lrc.lyric.replace(/\[(.+?)\]/g,'')
      let lrctextarr =  lrctext.split('\n')

      //歌词时间数组
      var arr2 =[]
      let dd  =lrcurl.lrc.lyric.replace(/[:]/g,'')
      let str8 = dd.match(/(?<=\[)\S+(?=\])/g)
      //判断有没有时间
      if (str8){
        str8.some((item)=>{
          arr2.push(parseInt(item))
        })
      }
      Promise.all([songurl,lrcurl]).then(()=>{
        //发送当前点击音乐信息到vux
        this.setNowSong(obj)
        //发送歌词素组
        this.setSongLrclist(lrctextarr)
        this.setsongTimeArr(arr2)

        this.setIsplay(true)

      })
    },
    goLrc(){
        this.$router.push('/musiclrc')
    },
    _playing(){
      //初始化当前播放时间
      this.setAudioCurrentTime(this.$refs.musicAudio.currentTime)
      this.setAudioDuration(this.$refs.musicAudio.duration)
    },
    historybtn(){
      this.show=true
      this.historySongList = JSON.parse(window.localStorage.getItem('historySong'))

    }
  },
  computed:{
    ...mapState(['songLoop','isPlay','isShow','nowSong','audioInfo_NowTime','volume','loading']),
    ...mapGetters(['setPrecent','setlengh']),
    isshow(){
     return this.$route.path
    },


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
    },
    volume(){
      this.$nextTick(()=>{
        this.$refs.musicAudio.volume =this.volume

      })
    },
    songLoop(){

      if (this.songLoop !==3){
        this.$refs.musicAudio.loop  =false
        this.$forceUpdate()
      }else {
        this.$refs.musicAudio.loop  =true
      }

    },
    nowSong(){

      //历史播放
      var arr =[]
      if(window.localStorage.getItem('historySong')){
        arr= JSON.parse(window.localStorage.getItem('historySong'))
        var is =  arr.some(item=>{
          return item.id == this.nowSong.id
        })
        if(!is){
          arr.push(this.nowSong)

          window.localStorage.setItem('historySong',JSON.stringify(arr))
        }
      }else{
        arr.push(this.nowSong)
        window.localStorage.setItem('historySong',JSON.stringify(arr))
      }
    },
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .3s;

}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translate(0,100%);
}
.title{
  height: 30px;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
}.next{
  height: 50px;
  text-align: center;
  font-size: 14px;
  line-height: 50px;
}
.scrollY{
  height:420px;
  overflow: hidden;

}
.SongList{border-radius: 20px}
.box{
  /*position: relative;*/
  /*!*left: 50%;*!*/
  /*!*background: rgba(0,0,0,0);*!*/
  height: 500px;
  /*background: white;*/
  display: inline-flex;
  padding: 0 10px;
  /*border-radius: 20px;*/
}
.scrollX{
  background: rgba(0,0,0,0);

  position: relative;
  /*left: 50%;*/ top: 50%;
  transform: translate(-0,-50%);
  width: 100%;
  height: 500px;
  box-sizing: border-box;
}
.box-1{
  width: 340px;
  background: white;
  height: 500px;
  border-radius: 20px;
  margin-right: 5px;
}
.box-2{
  width: 340px;
  background: white;
  height:500px;
  border-radius: 20px;
}
.bgbg{
  width: 100%;
  position: fixed;
  z-index:999;
  top: 0;
  height: 100vh;
  background: rgba(0,0,0,0.5);
}
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
.audios .hotimg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
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
