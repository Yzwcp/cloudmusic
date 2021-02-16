<template>
  <div class="result">
    <scroll
        :bounce="false"
        :scrollX="true"
        class="scrollX">
      <ul>
        <li v-for="(item ,index) in menuInfo" :key="index" @click="libtn(item,index)" > <span :class="{bordr:index ==crrentIndex}">{{item.name}}</span> </li>
      </ul>
    </scroll>
      <loading v-if="isLoading"></loading>
    <scroll :class="{scroll:!this.$store.state.isShow,scrollplay:this.$store.state.isShow}"
            :data="$store.state.nowMusicList"
            :pullUpLoad="true"
            @pullingUp="pullingUp"
            >
      <ul>
        <li @click="detailBtn(index)" class="result-li" v-for="(item,index) in $store.state.nowMusicList" :key="index">
          <div class="left">
           <span v-if="item.id  !== $store.state.nowSong.id" class="font">{{index+1}}</span>
            <van-icon size="12px" v-if="item.id  == $store.state.nowSong.id" class="index-icon" color="red" name="fire" />

          </div>
          <div class="center">
            <span  class="title">{{item.name}}</span>
            <div class="author">{{item.singers}} <span class="space">-</span>  {{item.albumName}}</div>
          </div>
          <van-icon class="right" name="ellipsis" />
        </li>
        <loading v-if="isLoadingBottom"></loading>

      </ul>

    </scroll>

  </div>
</template>

<script>
import scroll from 'components/common/scroll/Scroll'
import loading from "@/components/common/loading/loading";
import {deepClone} from "@/common/deepClone";
import {getLyricAPI, getMusicUrlAPI} from "@/network/home";
import {mapState} from 'vuex'
export default {
name: "SearchResult",
  components:{scroll,loading},
  data(){
  return{
    menuInfo:[ {name:'综合',type:1018},{name:'单曲',type:1},{name:'专辑',type:10}, {name:'歌手',type:100},  {name:'歌单',type:1000},
      {name:'用户',type:1002},  {name:'MV',type:1004},  {name:'歌词',type:1006},  {name: '电台',type: 1009}, {name: '视频',type:1018}],
    offset:1,
    isLoading:false,
    isLoadingBottom:false,
    crrentIndex:1,
  }
  },
  created() {
    this.isLoading=true
    // 判断有没有值
    if (Object.keys(this.searchResultObjs).length !==0){
      this.isLoading=false
    }``
  },

  methods: {
    libtn(item,index){
      this.crrentIndex = index
      this.$store.commit('setsearch_cats',item.type)

    },
    onCancel() {
      this.$router.back()
    },

    //上拉加载
    pullingUp(){
      this.$emit('pullingUps',this.offset)
      this.offset++
      this.$store.commit('setoffset',this.offset)
      this.isLoadingBottom =true
      this.isLoading=false
    },
    //播放
    async detailBtn(i){
      //修改播放状态为true
      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsShow',true)


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
      //判断有没有歌词
      console.log(lrcurl)
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
        this.$store.commit('setNowSong',obj)
        //发送歌词素组
        this.$store.commit('setSongLrclist',lrctextarr)
        //发送歌词时间素组
        this.$store.commit('setsongTimeArr',arr2)


      })


    },
  },

  computed:{
    ...mapState(['searchResultObjs'])
  },
watch:{

}
}
</script>

<style scoped>
.result{
}
.scroll ul{
}
.result-li{
  padding: 0 18px;
  background: white;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1px;
}
.left{flex: 0.2}
.author{
  font-size: 10px;
  color: #A9A9A9;
  width: 260px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  margin-top: 5px;
}
.title{
  margin-bottom: 5px;
  font-size: 14px;
}
.font{
  font-size: 12px;
  color: #A9A9A9;flex: 0.2;

}
.center{
  flex: 2;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  padding-right: 10px;
}
.space{margin: 0 1px}
.right{float: right}
.scroll{height: calc(100vh - 54px - 30px);overflow: scroll}
.scrollplay{height: calc(100vh - 54px - 30px - 59px);overflow: scroll}
.scrollX{
  overflow: hidden;

}
.scrollX ul{
  padding-left: 18px;
  font-size: 14px;
  line-height: 30px;
  display: flex;
  height: 30px;
  background: white;
  width: 500px;
  background: white;
}
.scrollX ul li{
  width: 50px;
}
.bordr{
  border-bottom: #FC4032 3px solid;
}
</style>
