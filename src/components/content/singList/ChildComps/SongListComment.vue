<template>
  <div class="songcomment">
    <NavBar>
        <div  @click="goback" slot="left"><van-icon size="18px" name="arrow-left"/></div>
      <div slot="center" style="width: 100%;text-align: center">评论({{ totalCount }})</div>
      <img slot="right" class="share" src="https://s3.jpg.cm/2021/02/09/fX4Pw.jpg" alt="">
    </NavBar>
    <div class="top">
      <div class="one"><img :src="recommentinfos.coverImgUrl+ '?param=100y100'" alt=""></div>
      <div class="two">
        <p>{{recommentinfos.name}}</p>
        <p>by <span class="nickname">{{recommentinfos.nickname}}</span></p>
      </div>
      <van-icon name="arrow"  size="25px" @click="goback" />
    </div>
    <Comment ref="comment" @totalCountFn="totalCountFn"></Comment>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Comment from "@/components/content/comment/Comment";
export default {
name: "SongListComment",
  components:{Comment,NavBar},
  data(){
    return{
      recommentinfos:{},
      totalCount:0, //评论总数,
      path:''
    }
  },
  created() {
    this.$bus.$on('recommentinfo',res=>{
      this.recommentinfos =res
    })
  },
  methods:{
    goback(){
      this.$router.replace(`/singlist/${this.$refs.comment.id}`)
    },
    totalCountFn(v){
      this.totalCount = v
    }
  },
  deactivated() {
    this.$off('recommentinfo')

  },
}
</script>

<style scoped>
.songcomment{
  padding: 0 18px;
  background: white;
}
.one{
  padding-right: 10px;
}
.one img{border-radius: 10px}
.top{
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.two{
  font-size: 14px;
  line-height: 1.8em;
}
.share{
  padding-left: 35px;
  width: 25px;height: 25px}
.nickname{margin-right:2px ;color: #477594}
</style>
