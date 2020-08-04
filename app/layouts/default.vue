<template>
<div class="body">
  <!--  导航栏-->
  <div>
    <nav-bar/>
  </div>
  <div class="content">
    <nuxt/>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '~/app/components/Navbar.vue'

export default Vue.extend({
  name: 'default',
  middleware: 'auth',

  components: {
    NavBar
  },

  data () {
    return {}
  }

})
</script>


<style lang="scss">
@import "app/assets/style/index";


.content {
  padding-top: 64px;
  min-width: 1280px;

  .__nuxt-error-page {
    padding-top: 360px;
    background-color: #fff;
  }

}


</style>

