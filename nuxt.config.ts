import { fileURLToPath, URL } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", ],
  css: ["~/assets/styles/main.css"],
  app: {
    head: {
      title: "Freelance Byte",
      htmlAttrs: {
        lang: "ru",
      },
      link: [
        {
          rel: "icon",
          href: "/logo.svg",
          type: "image/svg+xml",
        },
      ],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",

          additionalData: `
        @use '~/assets/styles/vars.scss' as *;
        `,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: "~",
          replacement: fileURLToPath(new URL("./", import.meta.url)),
        },
      ],
    },
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
});
