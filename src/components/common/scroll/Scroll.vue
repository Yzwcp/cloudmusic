<template>
<!--  //better-scroll作用于子元素，所以要有一层wrapper封装-->
  <div ref="wrapper">
    <slot>
    </slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
//props中所涉及属性的作用自行查看better-scroll文档
  props: {
    data: {
      type: Array,
      default: null
    }, //传入数据用于及时刷新高度
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    scrollX:{
      type:Boolean,
      default:false
    },//是否启用横向滚动 default:false
    bounce: {
      type:Boolean,
      default: true
    }, //是否启用回弹动画效果 default:true
    pullUpLoad: {
      type:Boolean,
      default: false
    }, //下拉刷新 default:false
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    //初始化滚动组件
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.robeType,
        click: this.click,
        scrollX: this.scrollX,
        bounce:this.bounce,
        pullUpLoad:this.pullUpLoad,
      })

      //监听上拉加载更多
      if(this.pullUpLoad){
        this.scroll.on("pullingUp", () => {
          this.scroll && this.$emit("pullingUp");
          this.scroll && this.scroll.finishPullUp()
        })
      }


    },
    //所使用到的函数作用自行查看文档
    refresh() {
      this.scroll && this.scroll.refresh()
    },



  },
  watch: {
    //观察传入的数据，一旦数据发生变化，重新渲染滚动组件
    data() {
      setTimeout(() => {
        // this.scroll.refresh()
        this.refresh()
      }, 20);
    }
  }
}
</script>
