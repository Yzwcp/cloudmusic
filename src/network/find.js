import {request} from "./request";
export function getFoundAPI(){
    return request({
        url:'/homepage/block/page'
    })
}

