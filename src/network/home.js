import {request} from './request'
export function  getLoginListAPI(phone,password){
    var timestamp = new Date().getTime();

    return request({
        url:'/login/cellphone',
        params:{phone,password,timestamp}
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
export function userObjAPI(cookie){
    return request({
        url:'/user/account',
        cookie:cookie
    })
}
//获取用户收藏的歌单
export  function getPlayListAPI(userId,){
    var timestamp = new Date().getTime();
    return request({
        url:'/user/playlist',
        params:{uid:userId,timestamp}
    })
}
//获取用户歌单详情音乐20首
export  function getDetailAPI(id){
    var timestamp = new Date().getTime();

    return request({
        url:'/playlist/detail',
        params:{id:id,timestamp}
    })
}
//获取歌单收藏评论分享的数据
export  function getDetailDynamicAPI(id){
    var timestamp = new Date().getTime();

    return request({
        url:'/playlist/detail/dynamic',
        params:{id:id,timestamp}
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
    var timestamp = new Date().getTime();

    return request({
        url:'/song/detail',
        params:{ids:ids,timestamp}
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
//获取用户喜欢的音乐
export  function getLikeListAPI(id,c){
    var timestamp = new Date().getTime();

    return request({
        url:'/likelist',
        params:{uid:id,timestamp,cookie: c}
    })
}
//用户等级
export  function getLevelAPI(cookie){
    var timestamp = new Date().getTime();

    return request({
        url:'/user/level',
        params:{timestamp,cookie}
    })
}
//收藏/取消收藏歌单
export  function getSubscribeAPI(t,id,cookie){
    var timestamp = new Date().getTime();
    return request({
        url:'/playlist/subscribe',
        method:'post',
        params:{id,t,timestamp,cookie}
    })
}
//评论显示
export  function getCommentAPI(id,type,sortType=1,pageNo=1,pageSize=20,cursor){
    var timestamp = new Date().getTime();

    return request({
        url:'/comment/new',
        method:'post',
        params:{
            id,type, pageNo,pageSize,sortType,cursor,timestamp
        }
    })
}
//评论
export  function getCommentUserAPI(t,type,id,content,c){
    var timestamp = new Date().getTime();
    return request({
        url:'/comment',
        method:'post',
        params:{
            t,type,id,content,timestamp,cookie:c
        }
    })
}
//历史播放
export  function getHistory(uid){
    return request({
        url:'/user/record',
        params:{
            uid,type:0
        }
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
        this.show = false
    }
}
export class SingCommentInfo{
    constructor(info,user) {
        this.commentId =info.commentId
        this.avatarUrl=user.avatarUrl
        this.isHug=user.isHug
        this.nickname = user.nickname
        this.userId =user.userId
        this.vipRights=user.vipRights
        this.time = info.time
        this.replyCount =info.showFloorComment.replyCount
        this.likedCount = info.likedCount
        this.content = info.content
        this.liked = info.liked
    }
}
export class  RankingListInfo{
    constructor(info,listThree) {
        this.coverImgUrl=info.coverImgUrl
        this.description =info.description
        this.id =info.id
        this.name = info.name
        this.updateFrequency = info.updateFrequency
        this.tracks = listThree
    }

}

