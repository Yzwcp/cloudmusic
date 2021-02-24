import {request} from "./request";
export function getFoundSwiperAPI(){
    return request({
        url:'/banner',
        params:{type:1}
    })
}
//推荐歌单
export function getRecommendAPI(){
    return request({
        url:'/personalized',
        params:{type:1}
    })
}
//所有歌单
export function getAllListAPI(){
    return request({
        url:'/toplist/detail'
    })
}
//获取默认搜索关键词
export function getSearchDefaultAPI(){
    return request({
        url:'/search/default'
    })
}
//获取热门搜索列表
export function getSearchHotAPI(){
    return request({
        url:'/search/hot/detail'
    })
}
// //搜索建议
export function getSearchSuggestAPI(keywords){
    return request({
        url:'/search/suggest',
        params:{
            keywords:keywords,
            type:'mobile'
        }
    })
}
//搜索
export function getSearchAPI(keywords,offset,limit,type=1 ){
    return request({
        url:'/cloudsearch',
        params:{
            keywords:keywords,
            limit:limit,
            type:type,
            offset:offset
        }
    })
}
//获取每日推荐歌曲
export function getDayRecommendAPI(){
    return request({
        url:'/recommend/songs'
    })
}
//获取排行榜数据
export function getRankingListAPI(){
    return request({
        url:'/toplist/detail'
    })
}
//热门歌单分类
export function getHotplayListAPI(){
    return request({
        url:'/playlist/hot'
    })
}
//获取菜单歌单
export function getplayLsit(cat,offset,limit=30){
    return request({
        url:'/top/playlist',
        params:{cat,limit,offset}
    })
}
//给评论点赞
export function getliked(id,cid,t,type,c){
    var timestamp = new Date().getTime();
    return request({
        url:'/comment/like',
        method:'post',
        params:{id,cid,t,type,cookie:c,timestamp}
    })
}
