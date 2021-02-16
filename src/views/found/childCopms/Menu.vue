<template>
  <div id="menu">
      <scroll ref="scroll" :scrollX="true"  class="wipper" :eventPassthrough="'vertical'">
        <ul class="content">
          <li v-for="(item,i) in menuItem" :key="i" @click="goItem(i)">
            <div class="menu-icon"><img :src="item.src" alt=""></div>
            <p>{{item.title}}</p>
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

      menuItem:[
        {
          title:'每日推荐',
          src:require('assets/img/found/rili.svg')
        },{
          title:'私人FM',
          src:require('assets/img/found/FM.svg')
        },{
          title:'歌单',
          src:require('assets/img/found/gedan.svg')
        },{
          title:'排行榜',
          src:require('assets/img/found/paihang.svg')
        },{
          title:'直播',
          src:require('assets/img/found/zhibo.svg')
        },{
          title:'数字专辑',
          src:require('assets/img/found/zhuanji.svg')
        },{
          title:'歌房',
          src:require('assets/img/found/liaotian.svg')
        },{
          title:'游戏专区',
          src:require('assets/img/found/youxi.svg')
        },
      ]}
  },
  methods:{
    goItem(i){
      if (i==0){
        this.$router.replace('day')
      }else if(i==2){
        this.$router.replace('/allsonglist')
      }else if(i==3){
        this.$router.replace('/ranking')
      }
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
  margin-right: 10px;
  height: 80px;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-icon{
  width: 30px;
  height: 30px;
  background:#FC4032;
border-radius: 15px;
  display: flex;
  padding: 3px;
  justify-content: center;
  align-items: center;
}
img{
  width: 20px;
  height: 20px;
}
.wipper{
  overflow: hidden;
}
p{line-height: 0px;font-size: 12px}
</style>
