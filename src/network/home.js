import {request} from './request'
export function  getLoginListAPI(phone,password){
    return request({
        url:'/login/cellphone',
        params:{phone,password}
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
//获取用户歌单详情音乐
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
