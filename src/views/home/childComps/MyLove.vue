<template>
  <div id="my-love">
    <div class="bg-card">
      <div class="my-love">
        <div class="cvg"><van-icon color="#FC4032" size="22px" name="like" /></div>
        <div class="center"><span>我喜欢的音乐</span><p>0首</p></div>
        <div class="lived">
          <div><van-icon class="lived-heart"  size="16px" name="like-o" />心动模式 </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "MyLove"
}
</script>

<style scoped>
.my-love{
  display: flex;
  justify-content:center;
  height: 70px;
  align-items: center;
  margin: 0 18px;
}
.cvg{
  display: flex;
  margin-right:  10px;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 6px;
  background: #FCE7E6;
}
.center{flex: 1;line-height: 20px}
.center p {font-size: 10px;line-height: 0;color: #A9A9A9}
.center span{font-size: 14px;}
.lived{
  width: 100px;
}
.lived div {
  font-size: 12px;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;border: 1px solid #F0F0F0;  border-radius:20px ;
}
.lived-heart{margin: 0 5px 0 0}
</style>
