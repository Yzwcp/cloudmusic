<template>
  <div class="songlist">
    <van-sticky>
      <div class="top"><van-icon @click="goback" class="icon" size="24px" name="arrow-left" />
        排行榜</div>
      <scroll
          :bounce="false"
          :scrollX="true"
          :data="menuInfo"
          class="scrollX">
        <ul>
          <li @click="menuClick(item,index)" v-for="(item ,index) in menuInfo" :key="index" >

            <span :class="{bordr:cindex == index}">{{item}}</span>
          </li>
        </ul>
      </scroll>
    </van-sticky>
    <scroll class="scrollY"
            :probeType="2"
            :pullUpLoad="true"
            @pullingUp="_pullingUp"
            :data="playlists"
            :bounce="true"
    >
      <div class="y">
        <singBlock :recommend="playlists" :isthree="true"></singBlock>

        <loading v-if="isShow"></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from 'components/common/scroll/Scroll'
import {getHotplayListAPI,getplayLsit} from "@/network/find";
import loading from "@/components/common/loading/loading";
import singBlock from "@/components/content/singBlock/singBlock";
// import {addChineseUnit, } from "@/common/filter";
export default {
name: "AllsongList",
  components:{scroll,singBlock,loading},
  data(){
  return{
    menuInfo:[],
    cindex:0,
    playlists:[],
    isShow:false,
    offset:1,
    name:'华语'
  }
  },
  mounted() {
      this._getHotplayListAPI()
      this._getplayLsit(this.name)
  },
  methods:{
  //获取cats
    async _getHotplayListAPI(){
    const {data:res} =await getHotplayListAPI()
    if(res.code!==200) return this.$toast('获取失败')
    res.tags.some(item=>{
      this.menuInfo.push(item.name)
    })
  },
    menuClick(item,i){
      if(this.cindex ==i) return
      this.cindex =i
      this.playlists=[]
      this.name =item
      this._getplayLsit(this.name,this.offset)

    },
    goback(){
      this.$router.push('found')
    },
    async _getplayLsit(cat){
      const {data:res} =await getplayLsit(cat,this.offset)
      if ( res.code!==200) return this.$toast('没有找到')
      if(res.more){
        this.playlists.push(...res.playlists)
      }else{
        this.$toast('最后一页')
      }
    },
    _pullingUp(){

      this.isShow=true
      this.offset = this.offset+1
      this._getplayLsit(this.name,this.offset)
    }
  }
}
</script>

<style scoped>
.icon{ margin-right: 10px}
.top{
  height: 44px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  background: #F8F8F8;
}
.bordr{
  border-bottom: #FC4032 4px solid;
}
.scrollX{
  overflow: hidden;
}
.scrollX ul li{
  width: 70px;
  text-align: left;
}
.scrollX ul{
  padding-left: 18px;
  font-size: 14px;
  line-height: 30px;
  display: flex;
  height: 30px;
  background: #F8F8F8;  width: 700px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  box-shadow: 0px 0.3px 0.2px ;
}
.y{
  margin-top: 10px;
  padding: 0 18px;
}
.scrollY{
  height: calc(100vh - 40px - 44px);
  overflow: hidden;
}
</style>
