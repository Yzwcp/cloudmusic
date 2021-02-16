<template>
  <div class="dayrecommend">
    <div class="top" >
      <div class="bar">
        <van-icon name="arrow-left" @click="goback"/>
        <span>更多</span>
      </div>
      <div class="date">
        <span>{{getdateD}}</span>  / {{getdateM}}
      </div>
    </div>

    <scroll  :data="data"
            :class="{scrollnoplay:!this.$store.state.isShow,scrollplay:this.$store.state.isShow}">
      <SongList :playlistTracks="list"></SongList>
    </scroll>
  </div>
</template>

<script>
import scroll from '@/components/common/scroll/Scroll'
import SongList from "@/components/content/singList/ChildComps/SongList";
import {getDayRecommendAPI} from "@/network/find";
import {SingInfo} from "@/network/home";
import {mapState} from 'vuex'
export default {
name: "DayRecommend",
  components:{scroll,SongList},
  data(){
   return{
     list:[],
     data:[]
   }
  },
  created() {
  if (!window.localStorage.getItem('token')) return this.$router.push('/login')
    this._getDayRecommendAPI()
  },
  methods:{
    async _getDayRecommendAPI(){
      const {data:res} =await getDayRecommendAPI()
      res.data.dailySongs.some((item,index)=>{
        this.list.push(new SingInfo(item,index))
        this.data.push(0)
      })
    },
    goback(){
      this.$router.push('/found')
    }
  },
  computed:{
    ...mapState(['isShow']),
    getdateM(){
      var date = new Date()
      var m = date.getMonth()*1
      return m+1>9 ? m+1 : '0'+(m+1)
    },
    getdateD(){
      var date = new Date()
      var d = date.getDate()*1
      return d>9 ? d : '0'+d
    }
  },
  updated() {

  },
  watch:{
    isShow(){
      this.data.push(0)
    }
  }
}
</script>

<style scoped>

.bar{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;

}
.date span:nth-child(1){
  font-size: 30px;
  font-weight: 700;
}
.top{
  height: 200px;
  padding: 0 18px;
}
.scrollnoplay{
  height: calc(100vh - 200px);
  overflow: hidden;
}
.scrollplay{
  height: calc(100vh - 200px - 59px);
  overflow: hidden;
}
</style>
