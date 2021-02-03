<template>
  <div>

    <div class="bottom">
      <van-list>
        <van-cell @click="detailBtn(index)" id="vancell" v-for="(item,index) in playlistTracks" :key="index" @load="onload" >
          <div  class="detailist" >
            <div  class="detailist-left"> <span >{{index+1}}</span><van-icon color="red" name="fire" /></div>
            <div class="detailist-center">
              <p>{{item.name}}</p>
              <p>{{item.author}}-----{{item.authorCDs}}</p>
            </div>
            <div class="detailist-right"><van-icon name="ellipsis" /></div>
          </div>
        </van-cell>
        <div v-if="nologin" class="noLogin" @click="goLogin">更多音乐请登录...</div>
      </van-list>
    </div>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import {deepClone} from "@/common/deepClone";
import {getMusicUrlAPI,getLyricAPI } from "@/network/home";
// import {deepClone} from "@/common/deepClone";

export default {
name: "SongList",
  components:{},
    props:['playlistTracks'],
  data(){
  return{
    nologin:true,
    songUrl:'',
    nowtime:null,
    arr:[],
    count:0
  }
  },
  created() {
  if (window.localStorage.getItem('token')) this.nologin=false
  },
  methods:{
  ...mapMutations(['setsongTimeArr','setSongLrclist','nowMuiscList','setNowSong','setSongPosition']),//映射mapMutations
    goLogin(){
      this.$router.replace('/login')
    },
    onload(){
      console.log(12)
    },
    format(val){
      const mm=Math.floor(val/60)
      const m =Math.floor(val/60)<10? "0" + mm : mm
      return  parseInt(val % 60)<10 ? m+':' + '0' + parseInt(val % 60) :
          m+':' + parseInt(val % 60)
    },
    async detailBtn(i){
      //修改播放状态为true
      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsShow',true)


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

      //歌词数组
      var str3 =  obj.lrc.replace(/\[(.+?)\]/g,'')
      var arr =  str3.split('\n')
      this.setSongLrclist(arr)
      this.setSongPosition(0)


      console.log(arr )
      //歌词时间数组
      arr =[]
      let dd  =obj.lrc.replace(/[:]/g,'')
      let str8 = dd.match(/(?<=\[)\S+(?=\])/g)
      str8.some((item)=>{
        arr.push(parseInt(item))
      })
      this.setsongTimeArr(arr)
    },
    sortArray(m,n) {
      if (m > n) {
        return 1
      } else if (m < n) {
        return -1
      } else {
        return 0
    }
  },
    isInterger(value){
      return Math.round(value) ===value
    },
    //歌词时间素组
    lrcTime(){

    }
  },
  computed:{
     ...mapState(['audioInfo_currentTime','songPosition']),
  },
  watch:{
    playlistTracks(){
      //发送当前显示列表所有歌曲
      this.nowMuiscList(this.playlistTracks)
    },
    audioInfo_currentTime(){}
  }
}
</script>

<style scoped>

.bottom{
  padding: 30px 0 0 0 ;
  background: white;
  box-sizing: border-box;
}
.van-cell{
  padding: 0;
}
.detailist{
  display: flex;
  justify-content: center;
  align-items: center;

}
#vancell{
  background: white !important;
}
.detailist-left{
  width: 50px;
  flex: 1;
  text-align: center;
}
.detailist-center{
  flex: 4;

}
.detailist-center p:nth-child(1){
  width: 250px;
  line-height: 14px;
  white-space:nowrap;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  overflow: hidden;
}
.detailist-center p{

  width: 250px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient: vertical;
}
.detailist-center p:nth-child(2){
  font-size: 10px;
  color: #A9A9A9;
}
.detailist-right{
  width: 50px;
  text-align: center;
  flex: 1;
}
.singdetail .van-cell::after{
  border-bottom: 0;
}
.noLogin{
  color: #A9A9A9;
  font-size: 12px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottom p{
  line-height: 15px;
}
</style>
