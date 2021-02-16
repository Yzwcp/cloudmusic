/*eslint-disable*/
import axios from 'axios'
export function request (config){
 return new Promise((resolve, reject)=>{
     const instance = axios.create({
         baseURL:'/api',
         timeout:10000
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
