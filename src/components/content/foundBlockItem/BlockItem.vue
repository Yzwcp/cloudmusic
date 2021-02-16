<template>
<div id="blockitem">
  <div class="block-top">


    <slot name="block-top">
        <slot name="left"></slot>
    </slot>



    <div class="right">更多<van-icon name="arrow" /></div>






  </div>




  <div class="block-bottom"><slot name="block-bottom"></slot></div>
  </div>
</template>

<script>
export default {
name: "BlockItem"
}
</script>

<style scoped>
#blockitem{
  background: white ;
}
.block-top{
  margin-top:1px  ;
  height: 50px;
  padding: 0 18px;
  display: flex;
  line-height: 50px;
  justify-content: space-between;
  justify-items: center;
  font-weight:700;
  font-size: 18px;
}
.right{
  display: flex;
  justify-content: center;
  font-size: 14px;
  align-items: center;
}
.left{
  font-weight:700;
  font-size: 18px;
}
.block-bottom{
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
