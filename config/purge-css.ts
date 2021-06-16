export const PurgeCssConfig = {
  mode: 'webpack',
  enabled: process.env.TARGET_STAGE !== 'dev',
  whitelistPatterns: () => [/^v-((?!application).)*$/, /^\.theme--dark*/, /.*-transition/, /.*-fade/, /.*-slide/, /col*/, /row*/],
  paths: [
    'node_modules/@nuxtjs/vuetify/**/*.ts',
    'node_modules/@nuxt/vue-app/template/**/*.html',
    'node_modules/@nuxt/vue-app/template/**/*.vue'
  ],
  whitelistPatternsChildren: [/^v-((?!application).)*$/, /^theme--dark*/],
  styleExtensions: ['.css'],
  whitelist: ['body', 'html', 'nuxt-progress', 'v-card', 'v-application', 'v-application--wrap'],
  extractors: [
    {
      extractor: (content) => content.match(/[A-z0-9-:\\/]+/g) || [],
      extensions: ['html', 'vue', 'js']
    }
  ]
};
