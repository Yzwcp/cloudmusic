<template>
  <div class="singblock">
    <li v-for="(item,i) in recommend" :key="i">
      <div  @click="recommendBtn(item)" class="content-img"><img :src="item.picUrl" alt=""><span><van-icon size="10px" name="play" />{{item.playCount}}</span></div>
      <div class="name">{{item.name}}</div>
    </li>
  </div>
</template>

<script>
export default {
name: "singBlock",
  props:['recommend'],
  created() {

  },
  methods:{
    recommendBtn(item){
      this.$router.replace(`singlist/${item.id}`)
    }
  }
}
</script>

<style scoped>
.singblock{
  display: flex;


}
li{
  width: 110px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
img {width: 100px; height: 100px;border-radius:10px }
.name{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
  font-size: 12px;
  padding: 0 6px;
  line-height: 16px;
  margin-top: 5px;
  height: 32px;
}
.content-img{
  width: 100px; height: 100px;
  position: relative;
}

.content-img span{
  position: absolute;
  top: 3px;
  right: 10px;
  font-size: 12px;
  color: white;
  background: rgba(0,0,0,0.3);
  border-radius: 12.5px;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px ;
}
</style>
