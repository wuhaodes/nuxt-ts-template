<template>
<div class="body">
  <!--  导航栏-->
  <div>
    <nav-bar-cp/>
  </div>
  <div class="content">
    <nuxt/>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBarCp from '~/app/components/NavBarCp.vue'

export default Vue.extend({
  name: 'default_cp',
  middleware: 'auth',

  components: {
    NavBarCp
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

