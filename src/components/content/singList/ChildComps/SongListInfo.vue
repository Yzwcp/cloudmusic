<template>
  <div>

    <div class="top"  :style="{backgroundColor:bgStyle}">
      <div class="bg"></div>
      <div class="content"  >
        <div  class="top-left">
          <img class="img"  :src="detailItem.coverImgUrl" alt="">
        </div>
        <div class="top-right ">
          <div class="one">{{detailItem.name}}</div>
          <p class="two"><img :src="singerInfo.avatarUrl" alt=""> {{singerInfo.nickname}}</p>
          <p class="three"><span v-if="!detailItem.description">介绍:无</span>{{detailItem.description}}<van-icon @click="goback" name="arrow" size="12px" /></p>
        </div>
      </div>
      <div class="mark">
        <span ><van-icon class="mark-content" name="passed" size="22px"/>{{singMark.bookedCount   }}</span>
        <span ><van-icon class="mark-content" name="chat-o" size="22px"/>{{ singMark.commentCount }}</span>
        <span ><van-icon class="mark-content" name="share-o" size="22px"/>{{singMark.shareCount   }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import NavBar from "@/components/common/navbar/NavBar";
// import scroll from '@/components/common/scroll/Scroll';

import 'common/rgbaster'
export default {
  name: "SongListInfo",
  components:{},
  props:{
    playListId:null,
    singMark:{}, //评论收藏转发,
    detailItem:{}, //歌单信息
    singerInfo:{},//歌手信息
  },
  data(){
    return{
      bgStyle: null,//背景颜色
      clearTiemr:null,//查找到主题色 清除掉interval

    }
  },
  created() {
   this.clearTiemr= this.colorfn()
  },
  methods:{
    //返回
    goback() {
      this.$router.push('/')
      window.sessionStorage.clear('color')
    },
    //获取背景颜色，因为拾取颜色的插件为异步较慢 用定时器每隔20毫秒获取颜色
    colorfn(){
         const timer = setInterval(() => {
           console.log("正在允许 ")
           this.bgStyle = window.sessionStorage.getItem('color')
         }, 20)
          return function (){
             clearInterval(timer)
            console.log('找到了')
          }
    }
  },
  watch:{
    bgStyle(){
      if(this.bgStyle !==null){this.clearTiemr()}
    }
  }
}
</script>

<style scoped>
.navbar div{
  position: relative;
  z-index: 103;
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
  position: relative;
  z-index: 2;
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
  z-index: 2;
  font-size: 14px;
}
.one{
  position: relative;
  z-index: 9;
  font-size: 18px;
  color: white;
  line-height: 24px;
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
</style>
