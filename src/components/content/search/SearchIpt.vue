<template>
  <div>
    <van-search
        v-model="value"
        show-action
        :placeholder="placeholder"
        @cancel="onCancel"
        :autofocus="true"
        clearable
        @input="onInput"
        @search="onSearch"
        @blur="onblur"
        @focus="onFocus"
    />
    <ul class="search-suggest" v-if="isSuggestBlock">
      <li class="one">搜索 <span> “{{value}}”</span></li>
      <li @click="sugguestbtn(item)" v-for="(item,index) in suggestList" :key="index">
        <van-icon class="search-icon" name="search" size="14px"/>
        {{item.keyword}}
      </li>
    </ul>

    <router-view></router-view>

  </div>
</template>

<script>
// import Searchot from "@/components/content/search/Searchot";
// import SearchResult from "@/components/content/search/SearchResult";
import {getSearchDefaultAPI,getSearchAPI, getSearchSuggestAPI,} from "@/network/find";
// import {isCheckAPI} from "@/network/home";
import {mapState} from 'vuex'
export default {
name: "SearchIpt",
  components:{},
  data(){
    return{
      value:null,
      placeholder:null,
      suggestList:[],//建议搜索数据
      isSuggestBlock:false,//建议搜索框
      offset:0,
    }
  },
  created() {
  this.value = this.searchResultObjs.value
  this._getSearchDefaultAPI()


  },
  methods:{
    //搜索
    onSearch(value){
      let values =value
      console.log(values)
      if (values=='' || values==undefined){
        this.value = this.placeholder
        console.log(1)
        values = this.placeholder
      }
      this.searchResultObjs.value = this.value
      this._search(values);
      if(this.$route.path !=='/result'){
        this.$router.replace('/result')
      }
    },
    //获取搜索结果
    _search(values,offset,ispullup=false){
      getSearchAPI(values,offset,20,1 ).then(res=>{
        console.log(res)
        if(res.data.code!==200)return  this.$toast('获取失败222')
        // 格式化数据
        let obj ={}
        obj.songCount  =res.data.result.songCount
        //判断是否有下一页
        res.data.result.songCount>20? obj.more = true : obj.more =false

        obj.value = this.value
        var songs  = []
        res.data.result.songs.some((item,index)=>{
          var o ={}
          o.id= item.id
          o.name = item.name
          o.albumName = item.al.name
          o.picUrl =item.al.picUrl
          o.index = index
          let singers=[]
          item.ar.some(rs=>{
            singers.push(rs.name)
          })
          o.singers = singers.join('/')
          songs.push(o)
        })
        this.$store.state.searchResultObjs  = obj
        this.PropsisLoading=false

        //判断是不是上拉加载
        if (ispullup) return this.$store.commit('ispullupnowMuiscList',songs)
        this.$store.commit('nowMuiscList',songs)
      })
    },
    //获取默认搜索歌曲
    _getSearchDefaultAPI(){
    getSearchDefaultAPI().then(res=>{
      if(res.data.code!==200)return  this.$toast('获取失败11')
      this.placeholder =res.data.data.showKeyword
    })
  },
    //搜索建议
    onInput(value){
      if (value !=='') {
        getSearchSuggestAPI(value).then(res=>{
          if(res.data.code!==200)return  this.$toast('搜索失败')
          this.suggestList = res.data.result.allMatch
        })
        this.isSuggestBlock=true
      }else{
        this.isSuggestBlock=false
        this.$store.state.searchResultObjs.value =''

        if (this.$route.path !=='/hot') return  this.$router.replace('/hot')
      }
    },
    onblur(){
      setTimeout(()=>{
        this.isSuggestBlock=false

      },0)
    },
    onCancel(){
      this.$router.push('/found')
      this.$store.state.searchResultObjs ={}
    },
    onFocus() {

    },

    sugguestbtn(item){
      this.isSuggestBlock=false
      this.value =  item.keyword
      this.$store.state.searchResultObjs.value  = item.keyword
      this._search(item.keyword)
      if(this.$route.path !=='/result'){
        this.$router.replace('/result')
      }
    }

  },
  activated() {

  },
  computed:{...mapState(['search_cats','Vuxoffset','searchResultObjs','hot_search'])},
  watch:{

    //监听下拉事件
    Vuxoffset(){
        //判断是否最后一页
        if (this.$store.getters.setlengh > this.$store.state.searchResultObjs.songCount-1) return this.$toast('最后一页了')
        this.offset = this.Vuxoffset
        this._search(this.searchResultObjs.value,this.Vuxoffset,true)
      },
    searchResultObjs(){
      this.value = this.searchResultObjs.value
    },
    hot_search(){
      this.value =this.hot_search
      this.$store.state.searchResultObjs.value  = this.hot_search
      this._search(this.hot_search)
      if(this.$route.path !=='/result'){
        this.$router.replace('/result')
      }
    },

    search_cats(){
    }
    },
}
</script>

<style scoped>
.search-suggest{
  z-index: 5;
  width:290px ;
  position: absolute;
  left: 40px;
  background: white;
  box-shadow: 0px 2px 10px #A8A8A8;
}
.search-suggest li{
  width: 100%;
  color: #A9A9A9;
  font-size: 14px;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 10px;
  height: 25px;
}
.search-icon{
  margin:0 5px;
}
.search-suggest .one{
  color: cornflowerblue;
  padding: 10px 18px;
}
.search-suggest .one span{margin:  0 10px}

</style>
