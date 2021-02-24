/*eslint-disable*/
import axios from 'axios'
import config from "@/network/config";
const  { api_base_url} =config
axios.defaults.withCredentials =true
export function request (config){
 return new Promise((resolve, reject)=>{
     const instance = axios.create({
         baseURL:api_base_url,
         timeout:10000*3,
     })
     instance(config)
         .then(res => {
             resolve(res)
         })
         .catch(err => {
             reject(err)
         })
 })
}
