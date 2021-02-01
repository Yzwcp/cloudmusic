<template>
<div id="ranklist">
  <BlockItem>
    <div slot="block-top">
      <div slot="left">排行榜</div>
    </div>

  </BlockItem>
  <scroll class="wipper" :scrollX="true">
    <div class="bottom">
      <div class="cards" v-for="item in rankingList" :key="item.id">
        <div class="cards-top" @click="godetail(item)">{{item.name}}></div>
        <ul class="cards-bottom">
          <li v-for="(result,index) in item.arr" :key="result.id">
            <div><img :src="result.picUrl" alt=""></div>
            <div>{{index+1}}</div>
            <div class="name">{{result.name}}- <span class="author">{{result.author}}</span>   </div>
          </li>
        </ul>
      </div>
    </div>
  </scroll>

</div>
</template>

<script>
import BlockItem from "@/components/content/foundBlockItem/BlockItem";
import scroll from '@/components/common/scroll/Scroll'

export default {
name: "RankingList",
  components:{BlockItem,scroll},
  props:['rankingList','rankingThree'],
  data(){
  return{
  }
  },
  created() {
  },
  methods:{
    godetail(item){
      this.$router.replace(`singlist/${item.id}`)
    },

  },
  watch:{

  }
}
</script>

<style scoped>
#ranklist{margin-top: 10px  }
#ranklist .bottom{
  margin-bottom: 20px;
  align-items: center;
  padding: 5px 0px 10px 18px ;
  background: white;
  display: flex;
  width: 1600px;
}
.cards{
  width: 320px;
  height: 250px;
  margin-right: 20px;  overflow: hidden;
  border-radius: 10px;
  box-shadow:0 1px 5px #d9d9d9;
  background: white;
}
li{
  display: flex;
  align-items: center;
  padding: 0 18px;
  margin: 10px 0;
}
li div{
  margin:0 5px;
}
.author{font-size: 10px;color: #A9A9A9}
.cards-top{
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.name{
  width: 160px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient: vertical;

}
.cards-bottom{
}
.wipper{
  overflow: hidden;
  width: 100%;
}
img {
  width: 45px;
  height: 45px;
  border-radius: 10px;
}
</style>
