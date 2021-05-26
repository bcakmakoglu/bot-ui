import type { NuxtConfig } from '@nuxt/types';

export const NuxtHeaderConfig: NuxtConfig['head'] = {
  title: '@braks/bot-ui',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'Create fun chatbots!' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'dns-prefetch',
      href: 'https://fonts.googleapis.com/',
      crossorigin: true
    }
  ]
};
