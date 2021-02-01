import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        isPlay:false,//播放状态 默认false
        nowMusicList:[],//当前歌单歌曲列表,
        nowSong:{},//当前播放歌曲
        nowClickId:null, //当前点击的歌曲id
        isShow:false,// 显示音乐播放器
        //播放器信息
        audioInfo_duration:{},
        audioInfo_currentTime:{},
        //滑动播放条
        audioInfo_NowTime:{},
   },
    mutations:{
        //获取歌单列表
        nowMuiscList(state,playload){
            state.nowMusicList = playload
        },
        //修改播放状态
        setIsplay(state,playload){
           state.isPlay = playload
        },
        //获取歌曲
        setNowSong(state,obj){
           state.nowSong = obj
        },
        //播放器的显示
        setIsShow(state,playload){
           state.isShow=playload
        },
        //获取audio数据
        setAudioDuration(state,playload){
           state.audioInfo_duration =playload
        },
        setAudioCurrentTime(state,playload){
            state.audioInfo_currentTime =playload
        },
        setAudioInfo_NowTime(state,playload){
            state.audioInfo_NowTime = playload
        }
   },
    getters:{
        //计算进度百分比
       setPrecent(state){
           return (state.audioInfo_currentTime / state.audioInfo_duration)*100
       },
       setlengh(state){
          return  state.nowMusicList.length
       }
    }

})
export default store
