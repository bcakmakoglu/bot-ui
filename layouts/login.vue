<template>
  <v-app id="app" dark>
    <v-main>
      <v-container fill-height fluid>
        <Nuxt keep-alive :keep-alive-props="{ max: 10 }" />
      </v-container>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import '@/assets/scss/app.scss';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'LoginLayout'
})
export default class LoginLayout extends Vue {}
</script>
