<template>
  <div class="singdetail">
    <van-sticky ><div class="bg"></div>
      <nav-bar ref="nav" class="navbar"  :style="{backgroundColor:bgStyle}">
        <div class="left" slot="left"><van-icon color="white" @click="goback" name="arrow-left" size="24px" /></div>
        <div class="center" slot="center">
          <span style="color: white">歌单</span>
          <van-icon color="white" name="search" size="24px"/>
        </div>
        <div  slot="right"  class="right"><van-icon color="white" name="ellipsis" size="24px" /></div>
      </nav-bar>
    </van-sticky>

    <loading v-if="isLoading" class="loading"></loading>

    <scroll  :class="{scrollnoplay:!this.$store.state.isShow,scrollplay:this.$store.state.isShow}"
             :data="scrollrefishdata"
             @scroll="getOption">
      <div>
        <SongListInfo
            :playListId="playListId"
            :singMark="singMark"
            :detailItem="detailItem"
            :singerInfo="singerInfo"
            ref="SongListInfo"
        ></SongListInfo>
        <SongList
            :playlistTracks="playlistTracks"
        >
        </SongList>
      </div>


    </scroll>

  </div>
</template>

<script>
import loading from "@/components/common/loading/loading";
import scroll from '@/components/common/scroll/Scroll'
import NavBar from "@/components/common/navbar/NavBar";

import SongListInfo from "@/components/content/singList/ChildComps/SongListInfo";
import SongList from "@/components/content/singList/ChildComps/SongList";
import {getDetailDynamicAPI, getDetailAPI, getAllDetailAPI, SingInfo, isCheckAPI} from "@/network/home";
import {addChineseUnit} from "@/common/filter";
import {mapState} from 'vuex'
// import {deepClone} from "@/common/deepClone";
//识图主颜色

export default {
  name:'singDetail',
  components:{SongListInfo,SongList,scroll,NavBar,loading},
  data(){
    return{
      playListId:null, //歌单id
      singMark:{},//评论信息
      detailItem:{},//歌单文字描述信息
      singerInfo:{},//歌单作者
      backgroundColors:null,//背景颜色
      playlistTracks:[],//歌曲列表20首
      allLsit:[],//全部歌曲id
      bgStyle:null,
      scrollrefishdata:[],
      isLoading:false,
      path:'/found',
      clearTiemr:null
    }
  },
  created() {
  },
  mounted() {

    // 获取歌单评论分享收藏等数据
    this.getDetailDynamic()
    //歌单上部分文字信息图片信息
    //下面歌曲列表
    this.getDetail()
    this.isLoading = true
    this.clearTiemr= this.colorfn()
  },
  beforeUpdate() {
    },
  methods:{
    // 获取歌单评论分享收藏等数据
   async getDetailDynamic() {
        this.playListId = this.$route.params.id
        const res=await getDetailDynamicAPI(this.$route.params.id)
        if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
        //格式化数据 添加万单位
        let obj ={}
         obj.bookedCount = addChineseUnit(res.data.bookedCount, 1)
         obj.commentCount = addChineseUnit(res.data.commentCount, 1)
         obj.shareCount = addChineseUnit(res.data.shareCount, 1)
        this.$store.state.singmark = obj

   },
    //获取音乐列表20首
   async getDetail() {
     this.playListId = this.$route.params.id
     const  res = await getDetailAPI(this.playListId)
     if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
     //所有歌曲id
     this.allLsit = res.data.playlist.trackIds

     this.detailItem =res.data.playlist
     // 歌单作者
     let O = {}
     O.avatarUrl = res.data.playlist.creator.avatarUrl
     O.nickname = res.data.playlist.creator.nickname
     this.singerInfo = O
     //获取20首并格式化
     res.data.playlist.tracks.map((item,index)=>{
       this.playlistTracks.push(new SingInfo(item,index,this.playListId))
     })
     this.scrollrefishdata.push(0) //修改数据 刷新scroll
      var that =this
     // 识别歌单头像的主色块
     window.RGBaster.colors(this.detailItem.coverImgUrl, {
       paletteSize: 5,
       exclude: ['rgb(255,255,255)'],
       success(payload) {
         // payload.dominant是主色，RGB形式表示
         // payload.secondary是次色，RGB形式表示
         // payload.palette是调色板，含多个主要颜色，数组
         // console.log(payload.dominant);
         // console.log(payload.secondary);
         // console.log(payload.palette);
         //rgba
         const c = payload.palette[4].match(/\d+/g);
         const Color = `rgba(${c[0]},${c[1]},${c[2]},0.5)`;
         // console.log(Color)
         window.sessionStorage.setItem('color', Color)
         if(Color) that.isLoading =false
       }

     });



     // 判断是否有版权
     var arr = []
     this.playlistTracks.some(item=> {
       var obj = item
       isCheckAPI(item.id).catch(() => {
         obj.isChecked = 0
       })
       arr.push(obj)
     })
     this.playlistTracks = arr




    },
    //查找颜色
    colorfn(){
      const timer = setInterval(() => {
        this.bgStyle = window.sessionStorage.getItem('color')
      }, 20)
      return function (){
        clearInterval(timer)
      }
    },
    getOption(){
      // console.log(option.y)
    },
    //返回
    goback() {
      this.$router.push( this.path)
      window.sessionStorage.clear('color')
    },

},
  deactivated() {
    this.$bus.$off('setItem')
  },
  beforeDestroy() {

    var obj  ={}
    obj.name =this.detailItem.name
    obj.coverImgUrl =this.detailItem.coverImgUrl
    obj.nickname=this.singerInfo.nickname
    this.$bus.$emit('recommentinfo',obj)
  },
  updated() {

  },
  computed:{
    ...mapState(['isShow']),
  },
beforeRouteEnter (to,from,next){
    if(from.path == '/ranking'){
      next((vm)=>{vm.path='/ranking'})
    }else{
      next((vm)=>{vm.path='/found'})
    }
    if(from.path == '/allsonglist'){
      next((vm)=>{vm.path='/allsonglist'})
    }else{
      next((vm)=>{vm.path='/found'})
    }

  },
  watch: {
    async allLsit() {
      //获取歌单全部的歌曲
      if (!window.localStorage.getItem('token')) return
      const detailArry = []
      this.allLsit.some(i => {
        detailArry.push(i.id)
      })
      const ids = detailArry.join(',')
      getAllDetailAPI(ids).then(res => {
        res.data.songs.some((item, index) => {
          if (index > 19) {
            this.scrollrefishdata.push(index)  //修改数据 刷新scroll
            this.playlistTracks.push(new SingInfo(item, index, this.playListId))
          }
        })
      })
    },
    isShow() {
      this.scrollrefishdata.push(this.isShow)////修改数据 刷新scroll
    },
    bgStyle(){
      if(this.bgStyle !==null){
        this.clearTiemr()
      }
    },
  }
}

</script>
<style scoped>
.loading{
  position: absolute;
  top: 50%;
  z-index: 99;
  left: 50%;
  transform: translate(-50%);
}

.right{
  display: flex;
  justify-content: center;
  align-items: center;
}
.left{
  display: flex;
  align-items: center;
  padding-left: 18px;
}
.center{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scrollnoplay{
  height: calc(100vh - 44px);
  overflow: hidden;
  }
.scrollplay{
  height: calc(100vh - 44px - 59px);
  overflow: hidden;
}
.navbar div{ position: relative ;}
.bg  {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
