import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/',name: 'Home',component: Home},
    {path: '/login', component:() => import('components/content/login/LoginProfile')},
    {path: '/found', component:() => import('views/found/Found')},
    {path: '/cloudVillage', component:() => import('views/cloudVillage/cloudVillage')},
    {path: '/boke', component:() => import('views/video/boke')},
    {path: '/singlist/:id', component:() => import('components/content/singList/singDetail')},
    {path: '/musiclrc',meta:{index:0}, component:() => import('components/content/audio/musicLrc')},
    {
        path: '/search',
        redirect:'/hot',
        children:[
            {path:'/hot', component:() => import('components/content/search/Searchot')},
            {path:'/result', component:() => import('components/content/search/SearchResult'),}
        ],
        component:() => import('components/content/search/SearchIpt'),

    },
    {path: '/day', component:() => import('views/found/childCopms/menuComps/DayRecommend')},
    {path: '/songlistcomment/:id', component:() => import('components/content/singList/ChildComps/SongListComment')},
    {path: '/ranking', component:() => import('views/found/childCopms/menuComps/RankingList')},
    {path: '/allsonglist', component:() => import('views/found/childCopms/menuComps/AllsongList')},
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
