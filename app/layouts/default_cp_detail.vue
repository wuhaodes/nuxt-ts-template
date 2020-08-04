<template>
<div class="body">
    <nuxt/>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBarCp from '~/app/components/NavBarCp.vue'

export default Vue.extend({
  name: 'default_cp_detail',
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




</style>

