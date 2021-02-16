<template>
  <div class="Swiper">
    <van-swipe class="my-swipe" :autoplay="3000" height="131.83px">
      <van-swipe-item v-for="(item,i) in swiperList" :key="i">
        <img :src="item.pic +'?322y125.22'" alt=""> <div class="custom-indicator" :style="{backgroundColor:item.titleColor}">{{item.typeTitle}}</div>
      </van-swipe-item>
    </van-swipe>

  </div>
</template>

<script>
export default {
name: "Banner",
  props:['swiperList']
}
</script>

<style scoped>

.Swiper{
  background: white;
  padding: 14px 0;
}
.van-swipe-item{
  border-radius: 20px;
  padding: 0 18px;
box-sizing: border-box;
}
.Swiper img{
  border-radius: 10px;
  width: 100%;
}
.custom-indicator {
  position: absolute;
  right: 18px;
  bottom: 4px;
  padding: 5px 8px;
  color: white;
  font-size: 12px;
  overflow: hidden;
  border-top-left-radius:10px ;
}
</style>
