import Vue from 'vue'
import {Button,NavBar,Icon,Grid, GridItem,Field,Form,Toast,Sticky,List,Cell,Circle,Slider,Tabbar,TabbarItem,
CellGroup,Swipe,SwipeItem,Search,Loading,Overlay,Popover ,Lazyload } from "vant";
Vue.prototype.$toast = Toast
Vue.use(Lazyload, {
    lazyComponent: true,
});
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Field)
Vue.use(Form)
Vue.use(Toast)
Vue.use(Sticky)
Vue.use(List)
Vue.use(Cell)
Vue.use(Circle)
Vue.use(Slider)
Vue.use(TabbarItem)
Vue.use(Tabbar)
Vue.use(CellGroup)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Search)
Vue.use(Loading)
Vue.use(Overlay)
Vue.use(Popover)
