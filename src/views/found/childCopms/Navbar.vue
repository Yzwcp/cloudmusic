<template>
  <div class="Navbar">
    <NavBar>
      <van-icon slot="left" name="bars" size="25px" class="m"/>
      <div slot="center" class="center" @click="goSearch" center>
            <div class="center-content">
              <van-icon class="search" name="search" size="13px"></van-icon>
              <span class="search-text">搜索</span>
            </div>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
export default {
name: "Navbar",
  components:{NavBar},
  data(){
  return{
    value:0
  }
  },
  methods:{
    goSearch(){
      this.$router.push('/search')
    }
  }
}
</script>

<style scoped>
.van-cell-group{
  width: 100%;
}
.center{  background: #F7F7F7;height: 30px;line-height: 30px;  border-radius: 50px;text-align:left;

}
.Navbar{
  background: white;

}
.m{margin-left: 18px}
.center-content{
  text-align: left;
  display: flex;
  align-items: center;
}
.search{margin: 0 5px 0 10px}
.search-text{font-size: 12px;color:#A8A8A8; }

</style>
