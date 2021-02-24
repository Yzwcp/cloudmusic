<template>
  <div id="profile">
      <Navbar></Navbar>
      <loading v-if="isLoading"></loading>
      <Swiper :swiperList="swiperList"></Swiper>
      <Menu></Menu>
      <RecommendPlaylist :recommend="recommend"></RecommendPlaylist>
    <lazy-component>
      <RankingList :rankingList="rankingList" :rankingThree="rankingThree"></RankingList>
    </lazy-component>

  </div>
</template>

<script>
import loading from "@/components/common/loading/loading";

import Navbar from './childCopms/Navbar'
import Swiper from './childCopms/Swiper'
import Menu from "@/views/found/childCopms/Menu";
import RecommendPlaylist from "@/views/found/childCopms/RecommendPlaylist";
import RankingList from "@/views/found/childCopms/RankingList";
import {getFoundSwiperAPI, getRecommendAPI} from "@/network/find";
import {getDetailAPI,SingInfo} from "@/network/home";
import {addChineseUnit} from "@/common/filter";
export default {
  name: "Found",
  components:{Navbar,Swiper,Menu,RecommendPlaylist,RankingList,loading,},
  data(){
    return{
      swiperList:[],//轮播图
      recommend:[],//发现页6个推荐歌单
      rankingList:[],//发现页5个排行榜
      rankingThree:[], //5个歌单的前三首
      isLoading:false,
      scrolldata:[],
    }
  },
  created() {

  },
  mounted() {
    this.isLoading=true
    this.getSwiper()    //轮播图数据
    this.getRecommend()    //推荐歌单
    this.getFiveList()//获取发现页的5个歌单
  },
  beforeUpdate() {
    this.isLoading=false

  },
  methods:{
    //轮播图数据
    getSwiper(){
      getFoundSwiperAPI().then(res=>{
        if(res.data.code!==200)return  this.$toast('获取推荐表单失败')
       this.swiperList = res.data.banners
      })
    },
    //推荐歌单
    getRecommend(){
      getRecommendAPI().then(res=>{
        res.data.result.some((item,index)=>{
          if (index>5) return
          let obj = {}
          obj.name = item.name
          obj.picUrl=item.picUrl
          obj.id= item.id
          obj.playCount = addChineseUnit(item.playCount,0)
          this.recommend.push(obj)
        })
      })
    },
    //获取发现页的5个歌单
   async getFiveList(){


     //查询5个歌单前3个
          //循环查找5个歌单的id

          getDetailAPI(19723756).then(res=>{
            var arr= []
            //通过id查找5个歌单的前三首
            res.data.playlist.tracks.some((results,index)=>{
              if (index<3){
                arr.push(new SingInfo(results,19723756))
              }
            })
          this.rankingList.push(arr)
          })
         getDetailAPI(2884035).then(res=>{
           var arr= []
           //通过id查找5个歌单的前三首
           res.data.playlist.tracks.some((results,index)=>{
             if (index<3){
               arr.push(new SingInfo(results,2884035))
             }
           })
           this.rankingList.push(arr)

         })
         getDetailAPI(3778678).then(res=>{
           var arr= []
           //通过id查找5个歌单的前三首
           res.data.playlist.tracks.some((results,index)=>{
             if (index<3){
               arr.push(new SingInfo(results,3778678))
             }
           })
           this.rankingList.push(arr)

         })


    }


  },
  watch:{

  }
}
</script>
<style scoped>
.swipper{
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>
