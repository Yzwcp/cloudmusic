<template>
  <div class="comment">
    <div class="meun">
      <div class="comment-text">评论区 </div>
      <div>
        <span @click="sortbtn(index)" :class="{spantree:true,active:index == crrentindex}" v-for="(item,index) in sortTypeList" :key="index">
          {{item.sortTypeName | text}}
        </span>
      </div>
    </div>
    <loading v-if="isShow" ></loading>

    <scroll class="swipper" :data="recommentList">
      <ul>
        <li v-for="(item,index) in recommentList" :key="index">
          <div class="head">

            <div :class="{hug:true,border:item.isHug}"><img :src="item.avatarUrl+'?param=40y40'" alt=""></div>
            <div class="hug-text" v-if="item.isHug">收到了抱抱</div>
          </div>
          <div class="context">
            <div class="item-top">
              <div>
                <p class="nickname">{{item.nickname}}</p>
                <p class="time">{{item.time | format}}</p>
              </div>
              <div>
                <div class="zan">
                  <span class="likedCount">{{item.likedCount | wan}}</span>
                  <van-icon  v-if="!item.liked" name="thumb-circle-o" size="20px"  @click="thumb(item)"/>
                  <van-icon v-if="item.liked" color="red" name="thumb-circle-o" size="20px"  @click="thumb(item)"/>

                </div>
              </div>
            </div>
            <div class="content">{{ item.content }}</div>
            <p class="reply">{{item.replyCount }}条回复></p>
          </div>
        </li>
      </ul>
    </scroll>
    <div class="commentIpt">
      <van-field
          v-model="value"
          clearable
          placeholder="说点什么"
      >
        <template #button>
          <van-button size="small" @click="comBtn" color="white" type="primary"><span style="color: #A8A8A8">评论</span></van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import scroll from '@/components/common/scroll/Scroll'
import {getCommentAPI, SingCommentInfo} from "@/network/home";
import {addChineseUnit} from "@/common/filter";
import {getliked} from "@/network/find";
import {getCommentUserAPI} from "@/network/home";
import loading from "@/components/common/loading/loading";
export default {
name: "Comment",
  components:{scroll,loading},
  data(){
  return{
    id:null,//歌单id
    recommentList:[], //评论列表
    sortTypeList:[],  //
    crrentindex:0,
    value:'',
    isShow:false
  }
  },
  created() {
    this.isShow=true

    this.id = this.$route.params.id
    this._getCommentAPI(this.id,2,99)
  },
  methods:{

    async _getCommentAPI(id,type,sortType){
      const {data:res} = await getCommentAPI(id,type,sortType)
      console.log(res)
      if(res.code!==200)return this.$toast('获取失败')

      res.data.comments.some(item=>{

        this.recommentList.push(new SingCommentInfo(item,item.user))
        this.isShow=false

      })
      this.sortTypeList= res.data.sortTypeList
      this.$emit('totalCountFn',res.data.totalCount)
    },
    //点赞
    async thumb(item){
      if (!window.localStorage.getItem('token')) return this.$router.push('/login')

      this.recommentList.some(async (re)=>{
        if(item.id == re.id) {
          item.liked =  !item.liked
          var liked,toast
         if(item.liked){
          liked =  1
           toast ='点赞成功'
         }else{
           liked = 0
           toast ='取消点赞'
         }

         await getliked(this.id,item.commentId,liked,2,window.localStorage.getItem('c'))

          this.$toast(toast)

          return
        }
      })
      this.$forceUpdate();
    },
    // 排序
    sortbtn(i){
      this.isShow=true
      this.recommentList=[]
      this.crrentindex =i
      this._getCommentAPI(this.id,2,this.sortTypeList[i].sortType)
    },
    //评论
    async comBtn(){
      if (!window.localStorage.getItem('token')) return this.$router.push('/login')

      const res =await getCommentUserAPI(1,2,this.id,this.value,window.localStorage.getItem('c'))
      if(res.data.code!==200) return this.$toast('评论失败')
      this.$toast('评论成功')
      this.value=''
    }
  },
  filters:{
    wan(value){
      return addChineseUnit(value,1)
    },
    text(value){
      var str = value.slice(1,3)
      return str
    }
  }
}
</script>

<style scoped>
.comment{
}
.swipper{
  height: calc(100vh - 160px - 44px - 59px);
  overflow: hidden;
}
li{
  display: flex;

  border-bottom: 1px #F8F8F8 solid;
}
img {
  border-radius: 20px;
  width: 40px;
  height: 40px;
}
.head{
  margin-right: 10px;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}
p{
  line-height: 10px;
}
.time{
  line-height: 0;
  font-size: 10px;
  color: #A8A8A8;
}
.nickname{
  font-size: 14px;
  color: #868686;
}
.content{
  margin: 18px 0;
  line-height: 1.5rem;
  font-size: 14px;
}
.context{
  flex: 2;


}
.commentIpt{
  box-shadow: 0px -0.5px 1.3px #A9A9A9;
}
.hug{
  width: 48px;
  height: 48px;
  border-radius: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 7px;
}
.border{  border: 1px red solid;
}
.hug-text{
  font-size: 2px;
  width: 50px;
  margin-top: 10px;
  line-height: 15px;
  height: 15px;
  text-align: center;
  color: red;
  border-radius: 10px;
  background: #FFECED;
}
.item-top{
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.zan{
  display: flex;
  align-items: center;
}
.likedCount{
  font-size: 12px;
  margin-right:4px ;
}
.reply{
  font-size: 12px;
  color: #5252a1;
}
.meun{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
.spantree{
  margin-left: 15px;
  font-size: 14px;
  color: #A8A8A8;
}
.comment-text{
  font-size: 18px;
  font-weight: 700;

}
.active{
  color: black;
  font-weight: 700;
}
</style>
