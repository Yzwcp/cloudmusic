<template>
  <div id="app">
    <nav-bar ></nav-bar>
      <router-view/>
    <music-audio v-show="$store.state.musciItemInfo.isPlay"></music-audio>

  </div>
</template>

<script>
import NavBar from "@/components/content/NavBar";
import musicAudio from "@/components/content/audio/musicAudio";
export default {
  components:{NavBar,musicAudio}
}
</script>

<style>

</style>
