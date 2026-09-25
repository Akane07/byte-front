// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // Авторизация целиком на клиенте (токен в localStorage), поэтому сервер
  // не может отрисовать страницу пользователя. В режиме SSR это давало
  // расхождение серверной и клиентской разметки и предупреждения гидратации.
  ssr: false,

  modules: ["@pinia/nuxt"],
  css: ["~/assets/styles/main.css"],

  runtimeConfig: {
    public: {
      // Переопределяются переменными окружения NUXT_PUBLIC_API_ORIGIN
      // и NUXT_PUBLIC_SITE_URL (см. .env.example).
      apiOrigin: "http://localhost:3001",
      siteUrl: "http://localhost:3000",
    },
  },

  app: {
    head: {
      title: "Freelance Byte",
      htmlAttrs: { lang: "ru" },
      link: [{ rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "~/assets/styles/vars.scss" as *;`,
        },
      },
    },
  },

  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
});
