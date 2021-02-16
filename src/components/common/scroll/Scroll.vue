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
    eventPassthrough:{
      type:String,
      default: ''
    }
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
        //probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
        // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
        // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        bounce:this.bounce,
        pullUpLoad:this.pullUpLoad,
        eventPassthrough: this.eventPassthrough  //有时候我们使用 better-scroll 在某个方向模拟滚动的时候，希望在另一个方向保留原生的滚动（比如轮播图，我们希望横向模拟横向滚动，而纵向的滚动还是保留原生滚动，我们可以设置 eventPassthrough 为 vertical；相应的，如果我们希望保留横向的原生滚动，可以设置eventPassthrough为 horizontal）。备注：eventPassthrough 的设置会导致其它一些选项配置无效，需要小心使用它。

      })

      //监听上拉加载更多
      if(this.pullUpLoad){
        this.scroll.on("pullingUp", () => {
          this.scroll && this.$emit("pullingUp");
          this.scroll && this.scroll.finishPullUp()
        })
      }
      // 监听滚动
      this.scroll.on('scroll', (position) => {
        this.scroll && this.$emit("scroll",position);
      });

    },
    //所使用到的函数作用自行查看文档
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
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
