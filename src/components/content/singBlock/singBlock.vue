<template>
  <div :class="{singblock:true,isthreecolum:isthree}">
    <li v-for="(item,i) in recommend" :key="i">
      <div  @click="recommendBtn(item)" class="content-img">
        <img v-if="item.picUrl" :src="item.picUrl" alt="">
        <img v-if="item.coverImgUrl" :src="item.coverImgUrl" alt="">

        <span>
          <van-icon size="10px" name="play" />{{item.playCount | wan}}{{item.updateFrequency}}
        </span>
      </div>
      <div class="name">{{item.name}}</div>
    </li>
  </div>
</template>

<script>
import {addChineseUnit} from "@/common/filter";

export default {
name: "singBlock",
  props:['recommend','isthree'],
  created() {

  },
  methods:{
    recommendBtn(item){
      this.$router.replace(`singlist/${item.id}`)
    }
  },
  filters:{
      wan(value){
        return addChineseUnit(value ,0)
      }
  }
}
</script>

<style scoped>
.singblock{
  display: flex;
  width: 100%;
}
.isthreecolum{

  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}
li{
  width: 32.5%;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-wrap: wrap;
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
  font-size: 8px;
  color: white;
  background: rgba(0,0,0,0.3);
  border-radius: 12.5px;
  padding: 0px 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px ;
}
.phb{
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
