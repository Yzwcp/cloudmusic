<template>
    <div id="grid">
      <div class="bg-card">
        <van-grid class="vangrid" :border="false">
          <van-grid-item icon="down" text="本地音乐" />
          <van-grid-item icon="send-gift" text="云盘" />
          <van-grid-item icon="checked" text="已购" />
          <van-grid-item icon="play-circle" text="最近播放" />
          <van-grid-item icon="friends" text="我的好友" />
          <van-grid-item icon="star" text="收藏和赞" />
          <van-grid-item icon="music" text="电台" />
          <van-grid-item icon="add" text="音乐应用" />
        </van-grid>
      </div>
    </div>
</template>

<script>
export default {
  name: "Grid",

}
</script>

<style scoped>
.van-grid-item{color:#FC4032}
.van-grid-item:nth-child(8){color:#F5F5F5}

</style>
