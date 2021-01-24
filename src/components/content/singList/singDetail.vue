<template>
  <div class="singdetail">
    <nav-bar class="navbar">
      <div class="left" slot="left"><van-icon @click="goback" name="arrow-left" size="24px" /></div>
      <div class="center" slot="center">
        <span>歌单</span>
        <van-icon name="search" size="24px"/>
      </div>
      <div  slot="right"  class="right"><van-icon name="ellipsis" size="24px" /></div>
    </nav-bar>
    <div class="top"  :style="{backgroundColor:bgStyle}">
        <div class="content"  >
          <div  class="top-left">
            <img class="img"  :src="detailItem.coverImgUrl" alt="">
          </div>
          <div class="top-right ">
            <p class="one">{{detailItem.name}}</p>
            <p class="two"><img :src="singerInfo.avatarUrl" alt=""> {{singerInfo.nickname}}</p>
              <p class="three">{{detailItem.description}}<van-icon @click="goback" name="arrow" size="14px" /></p>
          </div>
        </div>
        <div class="mark">
          <span ><van-icon class="mark-content" name="passed" size="22px"/>{{singDetail.bookedCount   }}</span>
          <span ><van-icon class="mark-content" name="chat-o" size="22px"/>{{ singDetail.commentCount }}</span>
          <span ><van-icon class="mark-content" name="share-o" size="22px"/>{{singDetail.shareCount   }}</span>
        </div>
    </div>

    <div class="bottom">
      <van-list
          v-model="loading"
          :finished="finished"
      >
        <van-cell @click="getList(item,index)" id="vancell" v-for="(item,index) in playlistTracks" :key="index" >
          <div  class="detailist" >
            <div  class="detailist-left">{{index+1}}</div>
            <div class="detailist-center">
              <p>{{item.name}}</p>
              <p>{{item.ar[0].name}}-----{{item.al.name}}</p>
            </div>
            <div class="detailist-right"><van-icon name="ellipsis" /></div>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import 'common/rgbaster'

import {getDetailAPI,getDetailDynamicAPI,getMusicUrlAPI} from "@/network/home";
import {addChineseUnit} from "@/common/filter";
export default {
  name: "singDetail",
  components: {NavBar,},
  data() {
    return {
      //歌单id
      playListId: null,
      //歌单列表信息
      singDetail: {
        type: Object,
        default: {}
      },
      //歌单描述信息
      detailItem: {},
      // 歌单作者
      singerInfo: {},
      //背景颜色
      bgStyle: null,
      //音乐列表
      playlistTracks: [],
      loading: false,
      finished: true,
      //音乐uRl
      musicUrl: ''
    }
  },
  created() {
    this.getDetail();
    this.getDetailDynamic()
    //获取item歌单数据
    this.$bus.$on('getItem', (item) => {
      window.localStorage.setItem('item', JSON.stringify(item))
    })

  },
  mounted() {
    this.detailItem = JSON.parse(window.localStorage.getItem('item'))
    this.singerInfo = this.detailItem.creator

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
        const Color = `rgba(${c[0]},${c[1]},${c[2]},0.6)`;
        console.log(Color)
        // console.log(Color)
        window.sessionStorage.setItem('color', Color)
      }
    });
    setInterval(() => {
      this.bgStyle = window.sessionStorage.getItem('color')
    }, 0)

    window.addEventListener("storage", function (e) {
      alert(e.color);
      console.log(1111)
    });
  },
  methods: {
    //获取用户收藏歌单详情
    getDetail() {
      this.playListId = this.$route.params.id
      getDetailAPI(this.playListId).then(res => {
        if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
        this.singDetail = res.data
        this.playlistTracks = res.data.playlist.tracks
      })
    },
    // 获取歌单评论分享收藏等数据
    getDetailDynamic() {
      getDetailDynamicAPI(this.playListId).then(res => {
        if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
        //格式化数据 添加万单位
        res.data.bookedCount = addChineseUnit(res.data.bookedCount, 1)
        res.data.commentCount = addChineseUnit(res.data.commentCount, 1)
        res.data.shareCount = addChineseUnit(res.data.shareCount, 1)
        this.singDetail = res.data
      })
    },
    //返回
    goback() {
      this.$router.push('/')
    },
    onload() {
    },
    //获取当前点击音乐id
    getList(item,index) {
      // console.log(item.id)
      // console.log(item.al.picUrl)
      var playload ={}
      //获取当前点击音乐的url
      getMusicUrlAPI(item.id).then(res=>{
        playload.musicUrl = res.data.data[0].url
        // playload.size = res.data.data[0].size
      }).finally(()=>{
        playload.picUrl = item.al.picUrl
        playload.musicTitle = item.name
        playload.author = item.ar[0].name
        playload.isPlay = true
        playload.index = index + 1
        this.$store.commit("getPlayMusicInfo", playload)
      })

      console.log(index)
      // this.getPlayMusicInfo(playload).then(res=>{
      //   console.log(res)
      // })
      // console.log(this.getPlayMusicInfo)
      this.$bus.$emit('musicisplay')
    },

  },

  beforeDestroy() {
    this.$bus.$off('getItem')
  }
}
</script>

<style scoped>
.navbar{
  position: fixed;
  z-index: 100;
  background: white;
  width: 100%;
  top:0;
  height: 44px ;
}

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

.top{
  background: white;
  padding: 0 18px;
  height:200px;
}
.top:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 244px;
  background-color: rgba(0, 0, 0, .2);
  z-index: 1;
}
.top-right p{width: 200px;

}
.top-left img{
  position: relative;
  z-index: 9;
  width: 130px;
  border-radius:18px ;
  height: 130px;
  margin-right: 10px;

}
.top .content{

  display: flex;
  align-items: center;
  height: 200px;
}

.three {
  line-height: 20px;
  color: white;
  white-space:nowrap;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  overflow: hidden;
  font-size: 14px;
}
.singdetail .three{
}
p img{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right:10px ;
}
.two{
  display: flex;
  align-items: center;
  color: white;
  font-size: 14px;
}
.one{
  position: relative;
  z-index: 9;
  font-size: 18px;
  color: white;
}
.top-right{
}
.mark{
  padding: 0 20px;
  background: white;
  box-shadow: 0.1px 0.5px 0.58px;
  width: 60%;
  position: absolute;
  left: 50%;
  display: flex;
  justify-content: center;
  transform: translate(-50%,-50%);
  height: 40px;
  width: 240px;
  align-items: center;
  border-radius: 25px;
  z-index: 9;
}
.mark span{
  flex:1;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mark-content{margin: 0 5px 0  0}
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
  line-height: 10px;
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
</style>
