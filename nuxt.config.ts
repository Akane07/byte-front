// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // Авторизация целиком на клиенте (токен в localStorage), поэтому сервер
  // не может отрисовать страницу пользователя. В режиме SSR это давало
  // расхождение серверной и клиентской разметки и предупреждения гидратации.
  ssr: false,

  // По умолчанию dev-сервер слушает только IPv6 (::1). На этой машине
  // подключения к ::1 блокируются (сеть/фильтр), и localhost:3000 не открывается.
  devServer: { host: "127.0.0.1" },

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

  // Сборка для `npm run share` (scripts/share.mjs) — в свои папки, чтобы не
  // мешать запущенному `npm run dev`: оба пишут в .nuxt, если их не развести.
  // Сами эти папки dev-сервер не отслеживает, иначе сборка его перезапускает.
  ignore: [".nuxt-share/**", ".output-share/**", ".share/**"],
  $env: {
    share: {
      buildDir: ".nuxt-share",
      nitro: { output: { dir: ".output-share" } },
    },
  },
});
