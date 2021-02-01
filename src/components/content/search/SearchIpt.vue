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
      <li v-for="(item,index) in suggestList" :key="index">
        <van-icon class="search-icon" name="search" size="14px"/>
        {{item.keyword}}
      </li>
    </ul>
    <Searchot v-if="!searchResultObj.songs"></Searchot>

    <SearchResult @pullingUps="pullingUps" v-if="songs.length>0 && value !== ''" :songs="songs"></SearchResult>


  </div>
</template>

<script>
import Searchot from "@/components/content/search/Searchot";
import SearchResult from "@/components/content/search/SearchResult";
import {getSearchDefaultAPI,getSearchAPI, getSearchSuggestAPI} from "@/network/find";

export default {
name: "SearchIpt",
  components:{Searchot,SearchResult},
  data(){
    return{
      value:null,
      placeholder:null,
      suggestList:[],//建议搜索数据
      isSuggestBlock:false,//建议搜索框
      searchResultObj:{},//搜索结果
      offset:0,
      songs:[]
    }
  },
  created() {
  this._getSearchDefaultAPI()
  },
  methods:{
    //搜索
    onSearch(value){
      this.songs=[]
      let values =value
      if (values==''){
        this.value =this.placeholder
        values = this.placeholder
      }
      this._search(values);
    },
    //获取搜索结果
    _search(values,offset){

      getSearchAPI(values,offset,20 ).then(res=>{
        if(res.data.code!==200)return  this.$toast('获取失败')
        // 格式化数据
        let obj ={}
        obj.songCount  =res.data.result.songCount
        //判断是否有下一页
        res.data.result.songCount>20? obj.more = true : obj.more =false

        obj.value = this.value
        obj.songs =[]
        res.data.result.songs.some((item)=>{
          var o ={}
          o.id= item.id
          o.name = item.name
          o.albumName = item.al.name
          o.picUrl =item.al.picUrl
          let singers=[]
          item.ar.some(rs=>{
            singers.push(rs.name)
          })
          o.singers = singers.join('/')
          obj.songs.push(o)
        })
        this.searchResultObj  = obj
        this.songs.push(...obj.songs)
      })
    },
    //获取默认搜索歌曲
    _getSearchDefaultAPI(){
    getSearchDefaultAPI().then(res=>{
      if(res.data.code!==200)return  this.$toast('获取失败')
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
      }


    },
    onblur(){
      this.isSuggestBlock=false
    },
    onCancel(){
      this.$router.push('/found')
    },
    onFocus() {
      if (this.value !== '') return this.isSuggestBlock = true
    },
    //监听下拉事件
    pullingUps(offset){
      //判断是否最后一页
      if (!this.searchResultObj.more || this.songs.length > this.searchResultObj.songCount-1) return this.$toast('最后一页了')
      console.log(offset)
      this.offset = offset
      this._search(this.value,offset)
    }

  },
  deactivated() {
  },
  watch:{
    value(){
      if (this.value=='')return this.searchResultObj = {}
    }
  }
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
