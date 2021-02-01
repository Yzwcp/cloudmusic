import {request} from './request'
export function  getLoginListAPI(phone,password){
    return request({
        url:'/login/cellphone',
        params:{phone,password}
    })
}
export function  isLoginApi(){
    return request({
        url:'/login/status',
    })
}
export function  logoutAPI(){
    return request({
        url:'/logout',
    })
}
//用户账号信息 头像等
export function userObjAPI(){
    return request({
        url:'/user/account'
    })
}
//获取用户收藏的歌单
export  function getPlayListAPI(userId){
    return request({
        url:'/user/playlist',
        params:{uid:userId}
    })
}
//获取用户歌单详情音乐20首
export  function getDetailAPI(id){
    return request({
        url:'/playlist/detail',
        params:{id:id}
    })
}
//获取歌单收藏评论分享的数据
export  function getDetailDynamicAPI(id){
    return request({
        url:'/playlist/detail/dynamic',
        params:{id:id}
    })
}
//获取音乐URl
export  function getMusicUrlAPI(id){
    return request({
        url:'/song/url',
        params:{id:id}
    })
}
//获取用户歌单详情音乐全部
export  function getAllDetailAPI(ids){
    return request({
        url:'/song/detail',
        params:{ids:ids}
    })
}
//判断音乐是否可用
export  function isCheckAPI(id){
    return request({
        url:'/check/music',
        params:{id:id}
    })
}
//获取歌词
export  function getLyricAPI(id){
    return request({
        url:'/lyric',
        params:{id:id}
    })
}
export class SingInfo{
    constructor(singInfo,index,listid) {
        this.index = index
        this.listId = listid
        this.id = singInfo.id
        this.name = singInfo.name
        this.author = singInfo.ar[0].name
        this.authorCDs=singInfo.al.name
        this.url=''
        this.picUrl=singInfo.al.picUrl
    }
}


