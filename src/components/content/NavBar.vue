<template>
  <div class="navbar">
    <nav-bar>
      <div class="left" slot="left"><van-icon color="black" size="24px" name="wap-nav" /></div>
      <div class="center" slot="center">
        <ul>
          <li @click="NavBtn(i)" :class="{default:true,active: currentIndex==i}" v-for="(item,i) in navBarTitle" :key="i">{{item}}</li>
        </ul>
      </div>
      <div class="right" slot="right"><van-icon size="24px" name="search" /></div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
export default {
  name: 'Home',
  components: {
    NavBar
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
