<template>
  <div id="menu">
      <scroll ref="scroll" :scrollX="true"  class="wipper">
        <ul class="content">
          <li v-for="(item,i) in menuItem" :key="i">
            <van-icon name="service-o" size="40px"/>
            <p>{{item}}</p>
          </li>
        </ul>

      </scroll>
  </div>
</template>

<script>
import scroll from '@/components/common/scroll/Scroll'
export default {
name: "Menu",
  components:{scroll},
  data(){
    return{
      menuItem:['每日推荐','私人FM','歌单','排行榜','直播','数字专辑','歌房','游戏专区']
    }
  },
  created() {
  }
}
</script>

<style scoped>
#menu{background: white}
#menu .content{
  height:80px;
  width:540px;
  display: flex;
  padding: 0 10px;
}
#menu li{
  width: 80px;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wipper{
  overflow: hidden;
}
p{line-height: 0px;font-size: 14px}
</style>
