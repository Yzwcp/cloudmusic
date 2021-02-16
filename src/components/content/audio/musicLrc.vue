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
      <div class="volume">
        <van-icon size="14px"  active-color="#E6E6E6" inactive-color="#949394" class="volume-icon" name="volume" color="white" />
        <van-slider @input="_volumeIpt" active-color="#E6E6E6" inactive-color="#949394" v-model="volume" button-size="8px"  />
      </div>

      <div class="bgcontent" :style="{background:'url(' + nowSong.picUrl + ')no-repeat center',backgroundSize:'200%',filter:'blur(40px)'}"></div>
        <img class="img" v-if="!isShowLrc" @click="showLrcComps" :src="nowSong.picUrl" alt="">
      <scroll class="lrc"
              :data="nowSong.lrc"
              :probeType="2"
              @scroll="_scroll"
              ref="scrollLRC"
              v-if="isShowLrc"
      >
        <ul>
          <div               @click="showLrcComps"
                             ref="context" class="context" >
              <li :class="{red: index == songPosition}" v-for="(item,index) in songLrclist" :key="index">{{item}}</li>
          </div>
        </ul>
      </scroll>

      <div class="progress">
        <span >{{ audioInfo_currentTime| format}}</span>
        <van-slider active-color="#E6E6E6" inactive-color="#949394" v-model="getProgressdata" button-size="8px" @input="sliderChange" />
        <span >{{ audioInfo_duration  | format}}</span>
      </div>
      <div class="tabnav">
        <li><van-icon size="22px" @click="loopbtn" v-if="songLoop==0" name="revoke" color="white" />
        <van-icon size="22px" @click="loopbtn" v-if="songLoop==2" name="replay" color="white"/>
        <van-icon name="filter-o" @click="loopbtn" v-if="songLoop==1" color="white" size="22px"/>
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
import scroll from '@/components/common/scroll/Scroll'
export default {
  name: "musicLrc",
  data(){
    return{
      getProgressdata:0,
      volume:40,
      arr:[],
      isShowLrc:false,
      loop:[{ mode:0, toast:'列表播放'},{mode:1,toast:'随机播放'},{mode:2,toast:'单曲循环'}]

    }
  },
  components:{NavBar,scroll},
  created() {
    //如果页面刷新 就跳转到首页
    if (this.setlengh ==0) return  this.$router.replace('/')
  },
  methods:{
    ...mapMutations(['setLoop','setVolume','setSongLrclist','setsongTimeArr','scrollPosition','setSongPosition','setIsplay','setNowSong','setAudioCurrentTime','setAudioInfo_NowTime']),
    goback(){
      //设置显示音乐播放器


      this.$router.back(-1)
    },
    sliderChange(v){
      this.getProgressdata = v
      this.setAudioInfo_NowTime((this.audioInfo_duration * v * 0.01).toFixed(6))
    },
    _volumeIpt(v){
      this.setVolume(v*0.01)
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


    //随机播放
    random(){
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
      let i = null
      this.nowMusicList.forEach((item,index)=>{
        if (item.id == this.nowSong.id){

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


    async autoNext(chagne=true){
      var  i =null
      i = this.add(chagne)
      //判断是不是随机播放
      if(this.songLoop ==1){
         i = this.random()
      }
      console.log(i)
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
      if(!obj.url){
        this.$toast('当前歌曲没有版权,为您自动播放下一首')
        this.autoNext(chagne)
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
    _scroll(){
      // position
      // this.scrollPosition(position)
    },
    format(val){
      const mm=Math.floor(val/60)
      const m =Math.floor(val/60)<10? "0" + mm : mm
      return  parseInt(val % 60)<10 ? m+':' + '0' + parseInt(val % 60) :
          m+':' + parseInt(val % 60)
    },
    //排序
    sortArray(m,n) {
      if (m > n) {
        return 1
      } else if (m < n) {
        return -1
      } else {
        return 0
      }
    },
    //判断是否小数
    isInterger(value){
      return Math.round(value) ===value
    },
    // 歌词素组
    //查找当前播放滚动位置
    setTextPosition(){
      var nowtime =this.format(this.$store.state.audioInfo_currentTime)
      var _nowtime= parseInt(nowtime.replace(/[:]/,''))+0.1
      let arr=[]
      arr.push(...this.songTimeArr)
      arr.push(_nowtime)
      arr.sort(this.sortArray)
      let a=1
      for (let i=0;i<arr.length;i++) {
        if (!this.isInterger(arr[i])) {
          a=i
        }
      }
      this.$store.state.songPosition  =  a-1
    },
    showLrcComps(){
      this.isShowLrc = !this.isShowLrc
    },
    loopbtn(){
      this.setLoop(this.songLoop+1)
      this.loop.some(item=>{
        if(this.songLoop==item.mode){
          this.$toast(item.toast)
        }
      })
    }
  },
  computed:{
    ...mapGetters(['songLoop','setPrecent','setlengh']),
    ...mapState(['loading','songLoop','songLrclist','songTimeArr','nowMusicList','isPlay','nowSong','audioInfo_duration','audioInfo_currentTime','songPosition'])
  },
  watch:{
    //进度条
    setPrecent(){
      this.getProgressdata = this.setPrecent
    },
    // 歌曲滚动位置
    songPosition(){
      if(this.isShowLrc){
        this.$nextTick(()=>{
          this.$refs.scrollLRC.scrollTo(0,this.songPosition*-50,300)
        })
      }
    },
    //监听是否切歌
    setnowsonglrc(){
      //初始化歌曲滚动位置为0
      this.setSongPosition(0)
    },
    //当前播放时间
    audioInfo_currentTime(){
      this.setTextPosition()
    },

  },
  filters:{
    format(val){
      const mm=Math.floor(val/60)
      const m =Math.floor(val/60)<10? "0" + mm : mm
      return  parseInt(val % 60)<10 ? m+':' + '0' + parseInt(val % 60) :
          m+':' + parseInt(val % 60)
    }
  },

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
.red{
  color: white;
  font-size: 14px;
}
.context{
  padding-bottom: 200px;
  padding-top: 200px;
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
.lrc li{
  height: 50px;
}
.musicLrc img{
  width: 200px;
  height: 200px;
  border-radius: 100px;
  position: absolute;
  top: 35%;
  left: 25%;
  transform: translate(-50%,-50%)

}
.img{
  animation: change infinite 60s;
}
@keyframes change {
  0%{transform: rotate(0deg)}
  100%{transform: rotate(360deg)}
}
.lrc{
  width:100%;
  height: 400px;
  position: absolute;
  font-size: 10px;
  top: 15%;
  left: 50%;
  transform: translate(-50%);
  overflow: hidden;
  color: #A8A8A8;
  text-align: center;
}
.volume{
  position: relative;
  padding: 0 18px;
  top: 44px;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.volume-icon{
  margin-right: 10px;
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
.center p{line-height: 0;color: #A9A9A9;font-size: 8px }
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
