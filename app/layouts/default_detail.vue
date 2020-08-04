<template>
<div class="body">
  <!--  导航栏-->
  <div>
    <nav-bar-detail/>
  </div>

  <div class="content">
    <nuxt/>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBarDetail from '~/app/components/NavbarDetail.vue'

export default Vue.extend({
  name: 'default_detail',
  middleware: 'auth',

  components: {
    NavBarDetail
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

  .__nuxt-error-page {
    padding-top: 360px;
    background-color: #fff;
  }
}


</style>

