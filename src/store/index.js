import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        // //当前播放音乐的url
        // nowMusicUrl:'',
        // //播放，暂停逻辑,
        // isPlay:false,
        // //当前播放音乐CD图片
        // nowCDimgUrl:'',
        // //当前音乐title
        // nowMusicName:''
        musciItemInfo:{}
    },
    mutations:{
        getPlayMusicInfo(state,playload){
          // state.nowMusicUrl = playload.musicUrl
          // state.nowCDimgUrl =playload.picUrl
            state.musciItemInfo = playload
        },
        //播放暂停
        setShow(state,isShow){
            state.musciItemInfo.isPlay=isShow
        }
    },
    // actions:{
    //     getPlayMusicInfo(context,playload){
    //         return new Promise((resolve, reject)=>{
    //             if(playload){
    //                 resolve(playload)
    //             }else{
    //                 reject('没获取到')
    //             }
    //         })
    //     }
    // }
    getters:{
        getStoreMusicInfo(state){
            return state.musciItemInfo
        }
    }

})
export default store
