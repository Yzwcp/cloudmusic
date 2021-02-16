<template>
  <div>

    <div class="bottom">
      <van-list>


        <van-cell  id="vancell" v-for="(item,index) in playlistTracks" :key="index" @load="onload" >
          <div  class="detailist" >
            <div  class="detailist-left">
              <span :class="{grey:item.isChecked == 0}" v-if="item.id  !== nowSong.id" >{{index+1}}</span>

              <van-icon v-if="item.id  == nowSong.id" color="red" name="fire" /></div>

            <div class="detailist-center" @click.stop="detailBtn(index)">
              <p :class="{grey:item.isChecked == 0}">{{item.name}}</p>
              <p>{{item.author}}{{item.singers}}-----{{item.authorCDs}}{{item.albumName}}</p>
            </div>
            <div class="detailist-right" @click.stop >
              <van-popover
                  v-if="!close"
                  placement="left-start"
                  v-model="item.show"
                  trigger="click"
                  :actions="actions"
                  @select="onSelect(item)"
              >
                <template #reference >

                  <!--                  <van-button type="primary">浅色风格</van-button>-->
                      <van-icon   name="ellipsis" />

                </template>
              </van-popover>
              <van-icon name="cross" v-if="close" size="12px" @click="remove(item.id)"  color="grey"/>
            </div>
          </div>
        </van-cell>

        <div v-if="nologin" class="noLogin"   @click="goLogin">更多音乐请登录...</div>
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
    props:['playlistTracks','ishistory','weekday','close'],
  data(){
  return{
    nologin:true,
    showPopover: false,
    playlist:[],
    // 通过 actions 属性来定义菜单选项
    actions: [{ text: '下一首播放' }],
  }
  },
  created() {
  if (window.localStorage.getItem('token')) this.nologin=false



  },
  mounted() {
  },
  methods:{
  ...mapMutations(['setsongTimeArr','setSongLrclist','nowMuiscList','setNowSong','setSongPosition']),//映射mapMutations
    //下一首播放
    onSelect(items){
      var arr =[]
      if(window.localStorage.getItem('historySong')){
        arr= JSON.parse(window.localStorage.getItem('historySong'))
        var is =  arr.some(item=>{
          return item.id == items.id
        })
        if(!is){
          arr.push(items)
          window.localStorage.setItem('historySong',JSON.stringify(arr))
          this.$toast('添加成功')
        }else{
          this.$toast('已在列表中')
        }
      }else{
        arr.push(this.nowSong)
        window.localStorage.setItem('historySong',JSON.stringify(arr))
      }
    },
    remove(id){
     this.$emit('removehis',id)

    },
    goLogin(){
      this.$router.replace('/login')
    },
    onload(){
    },
    format(val){
      const mm=Math.floor(val/60)
      const m =Math.floor(val/60)<10? "0" + mm : mm
      return  parseInt(val % 60)<10 ? m+':' + '0' + parseInt(val % 60) :
          m+':' + parseInt(val % 60)
    },
    async detailBtn(i){
    this.$store.state.loading=true
      //修改播放状态为true
      var nowSong=Object.keys(this.nowSong).length
      if(this.ishistory && nowSong.length !==0 ){
        this.nowMuiscList(JSON.parse(window.localStorage.getItem('historySong')))
      }else {

        //发送当前显示列表所有歌曲
        this.nowMuiscList(this.playlistTracks)
      }
      if(this.weekday){
        this.nowMuiscList(this.playlistTracks)
      }


      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsShow',true)


     //在vux查找当前点击音乐
     var obj ={}
     this.$store.state.nowMusicList.some((item,index)=>{
       if (index  == i)  {
         obj =deepClone( item)
       }
      })
      if (obj.isChecked == 0 ) return this.$toast('没有版权')

      const {data:songurl} = await getMusicUrlAPI(obj.id)
      if(songurl.code!=200) return  this.$toast('没有找到歌曲')
      obj.url = songurl.data[0].url
      const {data:lrcurl} = await getLyricAPI(obj.id)
      if(lrcurl.code!=200) return  this.$toast('没有找到歌词')

      this.$store.state.loading=false



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
        //发送歌词时间素组
        this.setsongTimeArr(arr2)
        // this.$router.push('/musiclrc')
      })


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

  },
  computed:{
     ...mapState(['audioInfo_currentTime','songPosition','nowSong']),
  },
  watch:{
    playlistTracks(){
      //强制刷新组件  因为playlistTracks的isCkecked没有算出来
      this.$forceUpdate()

    },
    nowSong(){

    }
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}
.bottom{
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
  color:  #b8b8b8;
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
.grey{
  color: #b8b8b8;
}
</style>
