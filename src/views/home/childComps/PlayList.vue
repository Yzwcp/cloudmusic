<template>
  <div id="playlist">
    <div class="top" >
      <div @click="spanBtn(i)"   v-for="(item,i) in dataName" :key="i"><span :class="{active:currentIndex == i}">{{item}}</span></div>
    </div>
    <div class="create">
      <div class="bg-card">
        <div class="bg-card-top">
          <span class="addplaylist">创建歌单</span>
          <van-icon class="add" name="plus" />
          <van-icon class="more" name="ellipsis" />
        </div>
        <div class="bg-card-bottom">
          <div class="square">
            <van-icon name="revoke" />
          </div>
          <span>导入外部歌单</span>

        </div>
      </div>
    </div>
    <div class="cvg">
      <div class="bg-card">
        <div class="bg-card-top">
          <span class="addplaylist" @click="aaa">收藏的歌单 <span v-if="playList.length">({{ playList.length }}个)</span> </span>
          <van-icon class="more" name="ellipsis" />
        </div>
        <div class="bg-card-bottom2">
          <p v-if="!playList.length>0" >暂无收藏的歌单</p>
          <ul v-else>
            <li @click="playListBtn(item)" v-for="(item,index) in playList" :key="index">
              <div class="coverimg">
                <img :src="item.coverImgUrl" alt="">
              </div>
              <div >
                <p class="title">{{item.name}}</p>
                <p class="small-title">{{item.trackCount}}首,by {{item.creator.nickname}}</p>
              </div>
            </li>
          </ul>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
name: "PlayList",
  data(){
    return{
      dataName:['创建歌单','收藏歌单'],
      currentIndex:0,
      playListItem:{}
    }
  },
  props:{
    playList:{}
  },
  methods:{
    spanBtn(i){
      this.currentIndex=i
    },
    playListBtn(item){
      this.playListItem= item
      window.localStorage.setItem('item',JSON.stringify(item))
      this.$router.replace(`singlist/${item.id}`)
      // this.$bus.$emit('setItem',this.playListItem)
    },
    aaa(){
    }
  },
  deactivated() {
    this.$bus.$emit('setItem',this.playListItem)
  }
}
</script>

<style scoped>
.top{
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.top div {flex: 1 ;text-align: center;color: #A9A9A9;}
.top span {padding-bottom:5px }
.active{border-bottom: #FC4032 2px solid;color: black;font-weight: 700}
.bg-card-top{
  color: #A9A9A9; padding: 0 18px; margin: 0px 0; line-height: 50px; height: 50px;display: flex;justify-content: center;align-items: center}
.add,.more{margin: 0 5px 0 10px ;}
.addplaylist{flex: 1 ;font-size: 10px}
.square{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  line-height: 45px;
  height: 45px;
  border-radius: 6px;
  background: #FCE7E6;
  margin: 0 10px 0 18px;

}
.bg-card-bottom{
  height: 70px;
  display: flex;
  align-items: center;  font-size: 14px;
}
.bg-card-bottom2{
  text-align: center;
  font-size: 14px;
  padding-bottom: 10px;
  color: #A9A9A9;
}
.coverimg, img{
  width: 45px;
  height: 45px;  border-radius: 6px;
  margin-right: 10px;
}
li{
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0 18px;
  text-align: left;
  height: 60px;
}
.title{
  line-height: 18px;
  width: 245px;
  font-size: 14px;
  color: black;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.small-title{
  line-height: 0;
  font-size: 10px;
}
</style>
