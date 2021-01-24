import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/',name: 'Home',component: Home},
    {path: '/login', component:() => import('components/content/LoginProfile')},
    {path: '/found', component:() => import('views/found/Found')},
    {path: '/cloudVillage', component:() => import('views/cloudVillage/cloudVillage')},
    {path: '/video', component:() => import('views/video/video')},
    {path: '/singlist/:id', component:() => import('components/content/singList/singDetail')},
]

const router = new VueRouter({
    routes
})
// router.beforeEach((to, form, next) => {
//     // to 将要访问的路径
//     // from 从哪个路径来
//     // next 放行函数
//     if (to.path === '/login') return next()
//     // 获取token
//     const tokenStr = window.sessionStorage.getItem('token')
//     if (!tokenStr) return next('/login')
//     next()
// })
export default router
