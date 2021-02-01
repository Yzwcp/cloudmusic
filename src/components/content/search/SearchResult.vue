<template>
  <div class="result">
    <scroll
        :bounce="false"
        :scrollX="true"
        class="scrollX">
      <ul>
        <li v-for="(item ,index) in menuInfo" :key="index" > <span :class="{bordr:index ==1}">{{item}}</span> </li>
      </ul>
    </scroll>
    <scroll :class="{scroll:!this.$store.state.isShow,scrollplay:this.$store.state.isShow}"
            :data="songs"
            :pullUpLoad="true"
            @pullingUp="pullingUp"
            >
      <ul>
        <li class="result-li" v-for="(item,index) in songs" :key="index">
          <div class="font">{{index+1}}</div>
          <div class="center">
            <span  class="title">{{item.name}}</span>
            <div class="author">{{item.singers}} <span class="space">-</span>  {{item.albumName}}</div>
          </div>
          <van-icon class="right" name="ellipsis" />
        </li>
      </ul>
    </scroll>

  </div>
</template>

<script>
import scroll from 'components/common/scroll/Scroll'
export default {
name: "SearchResult",
  props:['songs'],
  components:{scroll},
  data(){
  return{
    menuInfo:[ '综合','单曲','专辑', '歌手',  '歌单', '用户',  'MV',  '歌词',  '电台',  '视频'],
    offset:1
  }
  },
  methods: {
    onCancel() {
      this.$router.back()
    },
    //上拉加载
    pullingUp(){
      this.$emit('pullingUps',this.offset)
      this.offset++
    }
  }
}
</script>

<style scoped>
.result{
}
.scroll ul{
}
.result-li{
  padding: 0 18px;
  background: white;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1px;
}
.author{
  font-size: 10px;
  color: #A9A9A9;
  width: 260px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  margin-top: 5px;
}
.title{
  margin-bottom: 5px;
  font-size: 14px;
}
.font{
  font-size: 12px;
  color: #A9A9A9;flex: 0.2;

}
.center{
  flex: 2;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  padding-right: 10px;
}
.space{margin: 0 1px}
.right{float: right}
.scroll{height: calc(100vh - 54px - 30px);overflow: scroll}
.scrollplay{height: calc(100vh - 54px - 30px - 59px);overflow: scroll}
.scrollX{
  overflow: hidden;

}
.scrollX ul{
  padding-left: 18px;
  font-size: 14px;
  line-height: 30px;
  display: flex;
  height: 30px;
  background: white;
  width: 500px;
  background: white;
}
.scrollX ul li{
  width: 50px;

}
.bordr{
  border-bottom: #FC4032 3px solid;
}

</style>
