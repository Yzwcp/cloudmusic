<template>
  <div id="recommend">
    <BlockItem>
      <div slot="block-top">
        <div slot="left" >推荐歌单</div>
      </div>
      <div slot="block-bottom">
        <scroll class="swipper" :scrollX='true'>
          <ul class="content">
            <singBlock :recommend="recommend"></singBlock>
          </ul>
        </scroll>
      </div>
    </BlockItem>

  </div>
</template>

<script>
import scroll from '@/components/common/scroll/Scroll'
import singBlock from "@/components/content/singBlock/singBlock";
import BlockItem from "@/components/content/foundBlockItem/BlockItem";
export default {
name: "RecommendPlaylist",
  components:{scroll,singBlock,BlockItem},
  props:['recommend']
}
</script>

<style scoped>

.content{
  width:  660px;
  padding: 0 12px;
}
.swipper{
  overflow: hidden;
  background: white;

}


</style>
