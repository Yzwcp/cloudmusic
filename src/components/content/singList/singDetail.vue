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
import scroll from '@/components/common/scroll/Scroll'
import NavBar from "@/components/common/navbar/NavBar";

import SongListInfo from "@/components/content/singList/ChildComps/SongListInfo";
import SongList from "@/components/content/singList/ChildComps/SongList";
import {getDetailDynamicAPI,getDetailAPI,getAllDetailAPI,SingInfo} from "@/network/home";
import {addChineseUnit} from "@/common/filter";
import {mapState} from 'vuex'
//识图主颜色

export default {
  name:'singDetail',
  components:{SongListInfo,SongList,scroll,NavBar},
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
    }
  },
  created() {
    // 获取歌单评论分享收藏等数据
    this.getDetailDynamic()
    //歌单上部分文字信息图片信息
    //下面歌曲列表
    this.getDetail()
    this.$toast.loading('正在加载...')
  },
  mounted() {

  },
  methods:{
    // 获取歌单评论分享收藏等数据
    getDetailDynamic() {
      this.playListId = this.$route.params.id
      getDetailDynamicAPI(this.playListId).then(res => {
        if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
        //格式化数据 添加万单位
        res.data.bookedCount = addChineseUnit(res.data.bookedCount, 1)
        res.data.commentCount = addChineseUnit(res.data.commentCount, 1)
        res.data.shareCount = addChineseUnit(res.data.shareCount, 1)
        this.singMark = res.data
      })
    },
    //获取音乐列表20首
    getDetail() {
      this.playListId = this.$route.params.id
      getDetailAPI(this.playListId).then(res => {
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
      }).finally(()=>{
        this.scrollrefishdata.push(0) //修改数据 刷新scroll

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
          }
        });

      })

    },
    getOption(option){
      console.log(option.y)
    },
    //返回
    goback() {
      this.$router.push('/')
      window.sessionStorage.clear('color')
    },

},
  deactivated() {
    this.$bus.$off('setItem')
  },
  updated() {
    this.bgStyle = window.sessionStorage.getItem('color')
  },
  computed:{
    ...mapState(['isShow']),
  },
  watch:{
    allLsit(){
      //获取歌单全部的歌曲
      if(!window.localStorage.getItem('token')) return
      const detailArry = []
      this.allLsit.some(i=>{
        detailArry.push(i.id)
      })
      const ids = detailArry.join(',')
      getAllDetailAPI(ids).then(res=>{
        res.data.songs.some((item,index)=>{
          if (index>19){
            this.scrollrefishdata.push(index)  //修改数据 刷新scroll
            this.playlistTracks.push(new SingInfo(item,index,this.playListId))
          }
        })
      })
    },
    isShow(){
      this.scrollrefishdata.push(this.isShow)////修改数据 刷新scroll
    }

  }
}
// import {getDetailAPI,getDetailDynamicAPI} from "@/network/home";
// import {addChineseUnit} from "@/common/filter";
// export default {
//   name: "singDetail",
//   components: {NavBar,},
//   data() {
//     return {
//       //歌单id
//       playListId: null,
//       //歌单列表信息
//       singDetail: {
//         type: Object,
//         default: {}
//       },
//       //歌单描述信息
//       detailItem: {},
//       // 歌单作者
//       singerInfo: {},
//       //背景颜色
//       bgStyle: null,
//       //音乐列表
//       playlistTracks: [],
//       loading: false,
//       finished: true,
//       //音乐uRl
//       musicUrl: ''
//     }
//   },
//   created() {
//     this.getDetail();
//     this.getDetailDynamic()
//   },
//   mounted() {
//     this.detailItem = JSON.parse(window.localStorage.getItem('item'))
//     this.singerInfo = this.detailItem.creator
//     this.$bus.$on('getItem', (item) => {
//       console.log(item)
//     })
//
//   },
//   methods: {
//     // ...mapMutations(['showControl','setIsPlay']),

//
//     onload() {
//     },
//     //获取当前点击音乐id
//     getList(item) {
//       console.log(item )
//       // this.showControl(true)
//       // this.setIsPlay(true)
//       // this.$store.commit('NowMusic',item)
//       // console.log(item.id)
//       // console.log(item.al.picUrl)
//       // var playload ={}
//       // //获取当前点击音乐的url
//       // getMusicUrlAPI(item.id).then(res=>{
//       //   playload.musicUrl = res.data.data[0].url
//       //   // playload.size = res.data.data[0].size
//       // }).finally(()=>{
//       //   playload.picUrl = item.al.picUrl
//       //   playload.musicTitle = item.name
//       //   playload.author = item.ar[0].name
//       //   playload.isPlay = true
//       //   playload.index = index + 1
//       //   this.$store.commit("getPlayMusicInfo", playload)
//       // })
//
//       // console.log(index)
//       // this.getPlayMusicInfo(playload).then(res=>{
//       //   console.log(res)
//       // })
//       // console.log(this.getPlayMusicInfo)
//     },
//
//   },
//
//   beforeDestroy() {
//     this.$bus.$off('getItem')
//   }
// }
</script>

<style scoped>

.right{
  display: flex;
  justify-content: center;
  align-items: center;
}
.left{
  display: flex;
  align-items: center;
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
.navbar div{ position: relative ;z-index: 2}
.bg  {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>
