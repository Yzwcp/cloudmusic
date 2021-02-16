<template>
  <div class="navbar">
    <van-tabbar route placeholder active-color="#FC4032" >
      <van-tabbar-item replace to="/found" icon="music-o">发现</van-tabbar-item>
<!--      <van-tabbar-item replace  to="/boke" icon="bulb-o">播客</van-tabbar-item>-->
      <van-tabbar-item replace  to="/" icon="audio">我的</van-tabbar-item>
<!--      <van-tabbar-item replace  to='/cloudVillage' icon="friends-o">云村</van-tabbar-item>-->
    </van-tabbar>
  </div>
</template>

<script>
// import NavBar from "@/components/common/navbar/NavBar";
export default {
  name: 'Home',
  components: {
  },
  data(){
    return{
      navBarTitle:['我的','发现','云村','视屏'],
      currentIndex:0,
    }
  },
  created() {

  },
  methods:{
    NavBtn(i){
      this.currentIndex = i
      if (i==0){
        this.$router.replace('/')
      }else if(i==1){
        this.$router.replace('/found')
      }else if(i==2){
        this.$router.replace('/cloudVillage')
      }else if(i==3){
        this.$router.replace('/video')
      }
    }
  }
}
</script>
<style scoped>
.navbar{
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 100;
}
.navbar ul {
  display: flex;
  justify-content: center;
}
.left,.right{
  display: flex;
  justify-content: center;
  align-items: center;
}
.navbar li{
  width: 50px;
}
.default{
  color: #A9A9A9;
}
.active{
  font-size: 18px;
  color: black;
}
</style>
