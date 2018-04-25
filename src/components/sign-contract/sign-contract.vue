<template>
  <transition name="fade">
    <div class="m-container">
      <div class="box">
        <iframe id="mainIframe" name="mainIframe" :src="signUrl" frameborder="0" scrolling="auto" ></iframe>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'signUrl'
      ])
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: #fff;
  }
  .box{
    position: absolute;
    top: 50px;
    bottom: 0;
    width: 100%;
  }
  #mainIframe{
    width: 100%;
    height: 100%;
  }
</style>
