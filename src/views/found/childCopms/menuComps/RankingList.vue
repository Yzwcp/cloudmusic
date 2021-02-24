<template>
    <div class="rankinglist">
      <van-sticky>
        <div class="top"><van-icon @click="goback" class="icon" size="24px" name="arrow-left" />
          排行榜</div>
        <scroll
            :bounce="false"
            :scrollX="true"
            class="scrollX">
          <ul>
            <li @click="menuClick(index)" v-for="(item ,index) in menuInfo" :key="index" >

              <span :class="{bordr:cindex == index}">{{item}}</span>
            </li>
          </ul>
        </scroll>
      </van-sticky>

      <scroll class="scrollY"
              :data="quanqiu"
              :probeType="3"
              @scroll="_scroll"
      ref="scrollx">
        <div class="c">


          <div  class="context">
            <div class="title">官方榜</div>
            <ul >
              <li @click="godetail(item.id)"
                  class="three" :style="{backgroundColor:color[index]}"
                  v-for="(item,index) in lsitFive" :key="index">

                <div class="one">
                  <p :style="{color: textcolor[index],fontWeight:700}">{{item.name}}</p>
                  <div style="width: 50px;height: 50px;position: relative">
                    <img :src="item.coverImgUrl + '?param=50y50'" alt="">
                    <van-icon   @click.stop="getDetail(item,index)"  class="play" size="25px" color="white" name="play-circle-o" />
                  </div>

                </div>
                <ul class="two">
                  <div class="change">{{item.updateFrequency}}</div>
                  <li v-for="(result,i) in item.tracks" :key="i">
                    <div class="s">
                      {{i+1}}.
                      {{result.first}}-
                      <span class="autho">{{result.second}}</span>
                    </div>
                  </li>
                </ul>
              </li>

            </ul>
          </div>
           <lazy-component ref="jingxuanRef"><bangdan ref="jingxuanRef"  class="bangdan" :isthree="true" :name="'精选榜'" :list="jingxuan"></bangdan></lazy-component>
           <lazy-component ref="qufengRef"  ><bangdan ref="qufengRef"  class="bangdan" :isthree="true" :name="'曲风榜'" :list="qufeng"></bangdan></lazy-component>
           <lazy-component ref="quanqiuRef" ><bangdan ref="quanqiuRef" class="bangdan" :isthree="true" :name="'全球榜'" :list="quanqiu"></bangdan></lazy-component>
           <lazy-component ref="teseRef" ><bangdan ref="teseRef" class="bangdan" :isthree="true" :name="'特色榜'" :list="tese"></bangdan></lazy-component>
        </div>
      </scroll>
    </div>
</template>

<script>
import scroll from 'components/common/scroll/Scroll'
import {getRankingListAPI} from "@/network/find";
import { getDetailAPI, getLyricAPI, getMusicUrlAPI, RankingListInfo, SingInfo} from "@/network/home";
import {mapMutations} from 'vuex'
import {deepClone} from "@/common/deepClone";
import bangdan from "@/views/found/childCopms/menuComps/bangdan";
export default {
name: "RankingList",
  components:{scroll,bangdan},
  data(){
  return{
    menuInfo:[ '官方','精选','曲风', '全球','特色'],
    list:[],
    lsitFive:[],//官方榜
    color:['#F4E1E7','#E1EBEA','#F3E1E1','#E2E6EF'] ,
    textcolor:['#E34C86','#27988B','#E83737','#3971BF'],
    playlistTracks:[],
    crrentIndex:null,
    jingxuan:[],//
    qufeng:[],
    quanqiu:[],
    tese:[],
    cindex:0,
    place:[]
  }
  },
  created() {
    this._getdetail()
  },
  mounted() {

  },
  updated() {
  },
  methods:{
  ...mapMutations(['nowMuiscList','setIsplay','setIsShow','setsongTimeArr','setSongLrclist','setNowSong']),
    async _getdetail(){
      const {data :res} = await getRankingListAPI()
      if(res.code!==200) return this.$toast('加载失败')
      res.list.some((item,index)=>{
        if(index<4){
          this.lsitFive.push(new RankingListInfo(item,item.tracks))
        }
        //精选榜单
        if(item.id ==2884035 ||
           item.id== 5453912201 ||
           item.id==5338990334
        ){
          this.jingxuan.push(new RankingListInfo(item,item.tracks))
        }
        //曲风榜单
        if(item.id ==1978921795 ||
            item.id== 71385702 ||
            item.id==991319590 ||
            item.id ==5059633707 ||
            item.id== 5059661515 ||
            item.id==10520166 ||
            item.id==71384707 ||
            item.id==5059642708
        ){
          this.qufeng.push(new RankingListInfo(item,item.tracks))
        }
        //全球榜单
        if(item.id ==60198 ||
            item.id== 11641012 ||
            item.id==60131 ||
            item.id ==27135204 ||
            item.id== 2809513713 ||
            item.id==2809577409 ||
            item.id==5059644681 ||
            item.id==745956260
        ){
          this.quanqiu.push(new RankingListInfo(item,item.tracks))
        }

        //特色榜单
        if(item.id ==3112516681 ||
            item.id== 21845217 ||
           item.id== 3812895
        ){
          this.tese.push(new RankingListInfo(item,item.tracks))
        }


        this.list.push(new RankingListInfo(item,item.tracks))
      })
    },
    goback(){
      this.$router.push('/found')
    },
    async getDetail(item,ii) {
      this.crrentIndex =ii
      var obj ={}
      var Item =item

      this.playlistTracks = []

      const res =await getDetailAPI(item.id)
      if (res.data.code !== 200) return this.$toast('获取歌单列表失败')


      // this.detailItem =res.data.playlist
      // 歌单作者
      let O = {}
      O.avatarUrl = res.data.playlist.creator.avatarUrl
      O.nickname = res.data.playlist.creator.nickname
      this.singerInfo = O
      //获取20首并格式化
      res.data.playlist.tracks.map((item,index)=>{
        this.playlistTracks.push(new SingInfo(item,index,Item.id))
      })

      this.$store.commit('nowMuiscList', this.playlistTracks)



      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsShow',true)


      //在vux查找当前点击音乐

      obj =deepClone(this.$store.state.nowMusicList[0])
      console.log(obj)
      //根据当前音乐 的id查找音乐url
      const {data:songurl} = await getMusicUrlAPI(obj.id)
      if(songurl.code!=200) return  this.$toast('没有找到歌曲')
      obj.url = songurl.data[0].url
      const {data:lrcurl} = await getLyricAPI(obj.id)
      if(lrcurl.code!=200) return  this.$toast('没有找到歌词')


      //歌词text素组
      let lrctext =  lrcurl.lrc.lyric.replace(/\[(.+?)\]/g,'')
      let lrctextarr =  lrctext.split('\n')


      //歌词时间数组
      var arr2 =[]
      let dd  =lrcurl.lrc.lyric.replace(/[:]/g,'')
      let str8 = dd.match(/(?<=\[)\S+(?=\])/g)
      str8.some((item)=>{
        arr2.push(parseInt(item))
      })


      Promise.all([songurl,lrcurl]).then(()=>{
        //发送当前点击音乐信息到vux
        this.$store.commit('setNowSong',obj)
        //发送歌词素组
        this.$store.commit('setSongLrclist',lrctextarr)
        //发送歌词时间素组
        this.$store.commit('setsongTimeArr',arr2)
      })

    },
    godetail(id){
      this.$router.replace(`/singlist/${id}`)
    },
    _scroll(op){
      for (var i=0;i<this.place.length;i++){
        if(op.y<=this.place[i] && op.y>=this.place[i+1]){
          this.cindex = i
        }
      }
    },
    menuClick(i){
     this.cindex = i
     switch (i){
          case i=0 :
            this.$refs.scrollx.scrollTo(0,0,200)
             break
          case i=1 :
            this.$refs.scrollx.scrollTo(0,-526-18-38,200)
            break
          case i=2 :
            this.$refs.scrollx.scrollTo(0,-this.$refs.qufengRef.$el.offsetTop-10-10,200)
             break
          case i=3 :
            this.$refs.scrollx.scrollTo(0,-this.$refs.quanqiuRef.$el.offsetTop,200)
            break
          case i=4 :
         this.$refs.scrollx.scrollTo(0,-this.$refs.quanqiuRef.$el.offsetTop-100,200)
         break
     }
    }
  },
  watch:{
  list(){
    this.$nextTick(()=>{
      this.place = [
        0,-526-18-38,
        -this.$refs.jingxuanRef.$el.offsetTop-10-10,
        -this.$refs.qufengRef.$el.offsetTop,
        -this.$refs.quanqiuRef.$el.offsetTop,
        -this.$refs.teseRef.$el.offsetTop-100,
        -Number.MAX_VALUE
      ]
    })

  }
  }
}
</script>

<style scoped>
.rankinglist{
  background: #F8F8F8;
}
.scrollX{
  overflow: hidden;
}
.title{
  margin: 10px 0;
}
.scrollY{
  overflow: hidden;

  height: calc(100vh  - 44px - 30px);
}
.bordr{
  border-bottom: #FC4032 4px solid;
}
.c{padding-bottom:60px; }
.scrollX ul{
  padding-left: 18px;
  font-size: 14px;
  line-height: 30px;
  display: flex;
  height: 30px;
  background: #F8F8F8;
}
.scrollX ul li{
  width: 80px;
}
.s{
  width:200px
;

  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.top{
  height: 44px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  background: #F8F8F8;
}
.bangdan{
  margin: 10px 0;
  background: white;
  border-radius: 10px;
}
.three{
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  border-radius: 20px;
  padding: 0 18px 18px 18px;
}
.one{
  flex: 0.6;
}
.two{
  flex: 2;
  position: relative;
  width: 90%;
}
.context{padding: 0px 18px;  border-radius: 10px;
}
.two li{
  width: 90%;
  margin-top: 15px;
  font-size: 14px;
}
.play{
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.icon{ margin-right: 10px}
.autho{font-size: 10px; color: #A9A9A9;}
.change{color: #c6c4c4;font-size: 10px;position: absolute;right: 2px;top:5px;}

</style>
