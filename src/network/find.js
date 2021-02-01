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
export function getSearchAPI(keywords,offset,limit,type ){
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
