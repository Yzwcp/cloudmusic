<template>
  <div id="profile">
    <Navbar></Navbar>
    <Swiper :swiperList="swiperList"></Swiper>
    <Menu></Menu>
    <RecommendPlaylist :recommend="recommend"></RecommendPlaylist>
    <RankingList :rankingList="rankingList" :rankingThree="rankingThree"></RankingList>
  </div>
</template>

<script>
import Navbar from './childCopms/Navbar'
import Swiper from './childCopms/Swiper'
import Menu from "@/views/found/childCopms/Menu";
import RecommendPlaylist from "@/views/found/childCopms/RecommendPlaylist";
import RankingList from "@/views/found/childCopms/RankingList";
import {getFoundSwiperAPI, getRecommendAPI,getAllListAPI} from "@/network/find";
import {getDetailAPI,SingInfo} from "@/network/home";
import {addChineseUnit} from "@/common/filter";
export default {
  name: "Found",
  components:{Navbar,Swiper,Menu,RecommendPlaylist,RankingList},
  data(){
    return{
      swiperList:[],//轮播图
      recommend:[],//发现页6个推荐歌单
      rankingList:[],//发现页5个排行榜
      rankingThree:[], //5个歌单的前三首
    }
  },
  created() {
    this.getSwiper()    //轮播图数据
    this.getRecommend()    //推荐歌单
    this.getFiveList()//获取发现页的5个歌单
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
    getFiveList(){


      getAllListAPI().then(res=>{
        this.$forceUpdate();

        if(res.data.code!==200) return this.$toast('获取失败')
        res.data.list.some(item=>{
          if(item.id==19723756 || item.id==2884035 || item.id==3778678 || item.id==3779629 || item.id ==3112516681){
            let obj = {}
            obj.updateFrequency = item.updateFrequency
            obj.coverImgUrl  = item.coverImgUrl
            obj.name =item.name
            obj.id =item.id
            this.rankingList.push(obj)
          }
        })
      }).finally(()=>{
        //查询5个歌单前3个
          //循环查找5个歌单的id
        this.rankingList.some((item,i)=>{
          var arr= []
          getDetailAPI(item.id).then(res=>{
            //通过id查找5个歌单的前三首
            res.data.playlist.tracks.some((results,index)=>{
              if (index<3){
                arr.push(new SingInfo(results,item.id))
              }
            })
          })
          this.$set(this.rankingList[i],'arr', arr)

        })
      })


    }


  },
  watch:{

  }
}
</script>
<style scoped>

</style>
