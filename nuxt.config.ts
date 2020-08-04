import nuxt from 'coa-nuxt/nuxt-config'

// const devBaseURL = 'https://t1.iworld.vip/'
const devBaseURL = 'http://d1.iworld.vip/'
// const devBaseURL = 'http://will.vaiwan.com/'

export default nuxt({

  mode: 'spa',
  globalName: 'maker',

  router: {
    base: '/maker/'
  },

  head: {
    title: '铭码集团排版打印系统',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '铭码集团排版打印系统' },
      { httpEquiv: 'Cache-Control', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' },
    ],
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/keymaster@1.6.2/keymaster.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  loading: {
    color: '#1890FF'
  },

  loadingIndicator: {
    color: '#1890FF',
    background: 'white'
  },

  plugins: [
    '@/app/plugins/csw',
    '@/app/plugins/core',
    '@/app/plugins/element-ui'
  ],

  buildModules: [
    '@nuxt/typescript-build'
  ],

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    baseURL: devBaseURL,
    browserBaseURL: '/',
    proxy: process.env.NODE_ENV !== 'production'
  },

  proxy: [devBaseURL + 'cgi', devBaseURL + 'ws'],

})

