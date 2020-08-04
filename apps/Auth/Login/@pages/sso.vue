<script lang="ts">

import Vue from 'vue'
import uPassport from '~/app/@biz/uPassport'

export default Vue.extend({
  layout: 'login',

  async asyncData ({ redirect, query }) {
    const token = query.passport as string

    uPassport.removePassportInfo()

    uPassport.setPassport(token)

    redirect('/')
  },

})
</script>
