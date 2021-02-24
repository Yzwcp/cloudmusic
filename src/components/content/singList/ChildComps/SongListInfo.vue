<template>
  <div class="info">

    <div class="top"  :style="{backgroundColor:bgStyle}">
      <div class="bg"></div>
      <div class="content"  >
        <div  class="top-left">
          <img class="img"  :src="detailItem.coverImgUrl +'?param=130y130'" alt="">
        </div>
        <div class="top-right ">
          <div class="one">{{detailItem.name}}</div>
          <p class="two"><img :src="singerInfo.avatarUrl" alt=""> {{singerInfo.nickname}}</p>
          <p class="three"><span v-if="!detailItem.description">介绍:无</span>{{detailItem.description}}<van-icon @click="goback" name="arrow" size="12px" /></p>
        </div>
      </div>
      <div class="mark">
        <span >
          <van-icon  @click="subscribe" v-if="detailItem.subscribed" class="mark-content" name="passed" size="22px"/>
          <van-icon @click="subscribe"  class="mark-content" name="add-o" v-if="!detailItem.subscribed" size="22px"/>
          {{detailItem.subscribedCount}}
        </span>


        <span @click="goComment"> <van-icon   class="mark-content" name="chat-o" size="22px"/>{{ detailItem.commentCount}}</span>
        <span ><van-icon class="mark-content" name="share-o" size="22px"/>{{detailItem.shareCount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import NavBar from "@/components/common/navbar/NavBar";
// import scroll from '@/components/common/scroll/Scroll';
import { getSubscribeAPI} from "@/network/home";
import 'common/rgbaster'
// import {addChineseUit} from "@/common/filter";
export default {
  name: "SongListInfo",
  components:{},
  props:{
    playListId:null,
    singMark:{}, //评论收藏转发,
    detailItem:{}, //歌单信息
    singerInfo:{},//歌手信息,
  },
  data(){
    return{
      bgStyle: null,//背景颜色
      clearTiemr:null,//查找到主题色 清除掉interval
      subscribed:{},//收藏
      isSubscribed:false,
      mark:{}
    }
  },
  created() {
   this.clearTiemr= this.colorfn()
  },
  mounted() {

  },
  methods:{
    //返回
    goback() {
      this.$router.push('/')
      window.sessionStorage.clear('color')
    },
    // // 获取歌单评论分享收藏等数据
    // async getDetailDynamic() {
    //   const res=await getDetailDynamicAPI(this.$route.params.id)
    //   if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
    //   //格式化数据 添加万单位
    //   let obj ={}
    //   obj.bookedCount = addChineseUnit(res.data.bookedCount, 1)
    //   obj.commentCount = addChineseUnit(res.data.commentCount, 1)
    //   obj.shareCount = addChineseUnit(res.data.shareCount, 1)
    //   this.mark = obj
    //
    // },
    //获取背景颜色，因为拾取颜色的插件为异步较慢 用定时器每隔20毫秒获取颜色
    colorfn(){
         const timer = setInterval(() => {
           this.bgStyle = window.sessionStorage.getItem('color')
         }, 20)
          return function (){
             clearInterval(timer)
          }
    },
    async subscribe(){
      if(!window.localStorage.getItem('token')) return this.$router.replace('/login')
      let str = ''
      if(this.detailItem.subscribed){
        this.subscribed = 2
        str ='取消收藏'
      }else{
        this.subscribed = 1
        str='收藏成功'
      }
      const {data:res}=await getSubscribeAPI(this.subscribed,this.$route.params.id,window.localStorage.getItem('c'))
      if (res.code!==200) return  this.$toast('操作失败')
      this.$toast(str)

      this.detailItem.subscribed =!this.detailItem.subscribed
    },
    goComment(){
      this.$router.replace(`/songlistcomment/${this.playListId}`)
    }
  },
  deactivated() {
    this.clearTiemr()
  },
  updated() {
    this.isSubscribed = this.detailItem.subscribed

  },
  watch:{
    bgStyle(){
      if(this.bgStyle !==null){
        this.clearTiemr()
      }
    },

  }
}
</script>

<style scoped>
.info{
  padding-bottom: 30px;

}
.navbar div{
  /*position: relative;*/
  /*z-index:10;*/
}
.top{
  position: relative;
  background: white;
  padding: 0 18px;
  height:200px;
}
.bg  {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
}
.top-right p{width: 200px;

}
.top-left img{
  position: relative;
  /*z-index: 9;*/
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
  position: relative;
  /*z-index: 2;*/
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
  position: relative;
  /*z-index: 2;*/
  font-size: 14px;
}
.one{
  position: relative;
  /*z-index: 9;*/
  font-size: 18px;
  color: white;
  line-height: 24px;
}
.top-right{
}
.mark{
  padding: 0 20px;
  background: white;
  box-shadow: 0.1px 0.5px 5px #A9A9A9;
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
  /*z-index: 9;*/
}
.mark span{
  flex:1;
  font-size: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mark-content{margin: 0 5px 0  0}
</style>
