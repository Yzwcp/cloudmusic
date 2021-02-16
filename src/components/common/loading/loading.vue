<template>
  <div id="loading">
    <div class="loading">
      <span ></span>
      <span></span>
      <span></span>
      <span></span>
      <div v-if="istext" class="text">努力加载中···</div>
    </div>
  </div>
</template>
<script>
export default {
  props:['istext'],
  name: "NavBar",
};
</script>
<style scoped>
.loading span{background: red;display: inline-block;width: 2px;height: 8px;border-radius: 10px}
.loading span:nth-child(1){
  animation: move 1s infinite;

}
.loading span:nth-child(2){
  margin-left: 2px;
  animation: move 2.3s infinite ;
}
.loading span:nth-child(3){
  margin-left: 2px;
  animation: move 2s infinite ;
}
.loading span:nth-child(4){
  margin-left: 2px;
  animation: move 3s infinite ;
}
.text{display: inline-block;color: #A8A8A8;font-size: 12px;margin-left: 5px}
.loading{text-align: center;background: none}
@keyframes move{
  0%{
    height: 0px;
  }
  50%{
    height:8px;
  }
  100%{
    height: 0px;

  }
}

</style>
