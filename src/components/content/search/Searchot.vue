<template>
    <div class="search">
      <BlockItem>
        <div slot="block-top"> 热搜榜 </div>
      </BlockItem>
      <ul>
        <li v-for="(item,index) in hotLsit" :key="index">
          <span :class="{isThree:index<3,index:index>=3}" >{{index+1}}</span>
          <div  :class="{isWeigh:index<3,name:true}">{{item.searchWord}}</div>
          <img v-if="item.iconUrl" :src="item.iconUrl" alt="" class="right">
        </li>
      </ul>
    </div>

</template>

<script>
import BlockItem from "@/components/content/foundBlockItem/BlockItem";
import {getSearchHotAPI} from "@/network/find";

export default {
name: "Search",
  components:{BlockItem},
  data(){
  return{
    hotLsit:[]
  }
  },
  created() {
    this._getSearchHotAPI()
  },
  mounted() {

  },
  methods:{
    //获取热门搜索列表
    _getSearchHotAPI(){
      getSearchHotAPI().then(res=>{
        if(res.data.code!==200)return  this.$toast('获取失败')
        this.hotLsit = res.data.data
      })
    },


  }
}
</script>

<style scoped>
.search{
  height: calc(100vh - 50px - 54px);
}
ul{
  background: white;
  padding: 10px;
  box-sizing: border-box;
  margin-top:10px ;
  height: 400px ;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
li{
  width: 150px;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  position: relative;
}
.right{
  position: absolute;
  right: 0;
}
img{width: 15px;height: 15px}
.name{
  width: 100px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
  margin: 0 10px;
}
.isThree{
  color: red;
}
.isWeigh{
  font-weight: 800;
}
.index{color: #A9A9A9}

.search-suggest .one span{margin:  0 10px}
</style>
