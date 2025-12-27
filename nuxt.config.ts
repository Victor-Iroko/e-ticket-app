// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/test-utils/module",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "nuxt-security",
  ],
  security: {
    csrf: true,
  },
  runtimeConfig: {
    gmailUser: "",
    gmailPass: "",
    paystackApiKey: "",
  },
  nitro: {
    vercel: {
      functions: {
        runtime: "bun1.x",
      },
    },
  },
});
