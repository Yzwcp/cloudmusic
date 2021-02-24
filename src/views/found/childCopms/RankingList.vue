<template>
<div id="ranklist">
  <BlockItem>
    <div slot="block-top">
      <div slot="left">排行榜</div>
    </div>

  </BlockItem>
  <scroll class="wipper" :scrollX="true" :eventPassthrough="'vertical'">
    <div class="bottom">
      <div class="cards" v-for="(item,index) in rankingList" :key="item.id">
        <div class="cards-top" @click="godetail(index)">{{name[index].name}}></div>
        <ul class="cards-bottom">
          <li @click="getDetail(result,index)" v-for="(result,index) in item" :key="result.id">
            <div><img :src="result.picUrl + '?param=45y45'" alt=""></div>
            <div>{{index+1}}</div>
            <div class="name">{{result.name}}- <span class="author">{{result.author}}</span>   </div>
          </li>
        </ul>
      </div>
    </div>
  </scroll>

</div>
</template>

<script>
import BlockItem from "@/components/content/foundBlockItem/BlockItem";
import scroll from '@/components/common/scroll/Scroll'
import { getDetailAPI, getLyricAPI, getMusicUrlAPI, SingInfo} from "@/network/home";
import {deepClone} from "@/common/deepClone";

export default {
name: "RankingList",
  components:{BlockItem,scroll},
  props:['rankingList','rankingThree'],
  data(){
    return{
      playlistTracks:[],
      name:[{name:'飙升榜',type:19723756},{name:'原创榜',type:2884035},{name:'热歌榜',type:3778678}],
    }
  },
  created() {
  },
  methods:{
    godetail(index){
      this.$router.replace(`singlist/${this.name[index].type}`)
    },

    async getDetail(items,i) {
      this.playlistTracks = []
      const res = await getDetailAPI(items.index)
        if (res.data.code !== 200) return this.$toast('获取歌单列表失败')
        // this.detailItem =res.data.playlist
        // 歌单作者
        let O = {}
        O.avatarUrl = res.data.playlist.creator.avatarUrl
        O.nickname = res.data.playlist.creator.nickname
        this.singerInfo = O
        //获取20首并格式化
        res.data.playlist.tracks.map((item,index)=>{
          this.playlistTracks.push(new SingInfo(item,index,this.playListId))
        })
        this.$store.commit('nowMuiscList', this.playlistTracks)



      this.$store.commit('setIsplay',true)
      this.$store.commit('setIsShow',true)


      //在vux查找当前点击音乐
      var obj ={}
      this.$store.state.nowMusicList.some((item,index)=>{
        if (index  == i)  {
          obj =deepClone( item)
        }
      })
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
  },
  watch:{

  }
}
</script>

<style scoped>
#ranklist{margin-top: 10px  }
#ranklist .bottom{
  margin-bottom: 20px;
  align-items: center;
  padding: 5px 0px 10px 18px ;
  background: white;
  display: flex;
  width: 960px;
}
.cards{
  width: 320px;
  height: 250px;
  margin-right: 20px;  overflow: hidden;
  border-radius: 10px;
  box-shadow:0 1px 5px #d9d9d9;
  background: white;
}
li{
  display: flex;
  align-items: center;
  padding: 0 18px;
  margin: 10px 0;
}
li div{
  margin:0 5px;
}
.author{font-size: 10px;color: #A9A9A9}
.cards-top{
  height: 50px;
  text-align: center;
  line-height: 50px;
}
.name{
  width: 160px;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient: vertical;

}
.cards-bottom{
}
.wipper{
  overflow: hidden;
  width: 100%;
}
img {
  width: 45px;
  height: 45px;
  border-radius: 10px;
}
</style>
