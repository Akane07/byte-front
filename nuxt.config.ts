// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: 'Freelance Byte',
      htmlAttrs: {
        lang: 'ru'
      },
      link: [{
        rel: 'icon',
        href: '/logo.svg',
        type: 'image/svg+xml'
      }],
    }
  }
})
