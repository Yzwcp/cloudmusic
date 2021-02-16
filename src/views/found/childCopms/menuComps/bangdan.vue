<template>
  <div class="context">
    <div class="title" slot="title">{{name}}</div>
      <div class="sons"><sing-block :recommend="list" :isthree='isthree'></sing-block></div>
  </div>
</template>

<script>
import singBlock from "@/components/content/singBlock/singBlock";

export default {
name: "bangdan",
  props:['name','list','isthree'],
  components:{singBlock},

}
</script>

<style scoped>
li{
  height: 300px ;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
}
.son{
  width: 150px;
  background: #feff08;
}
.title{margin-bottom: 10px; padding-top: 18px}
</style>
