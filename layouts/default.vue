<template>
  <v-app id="app" dark>
    <v-app-bar class="header" app color="black" collapse-on-scroll elevation="20">
      <v-avatar :color="$vuetify.breakpoint.smAndDown ? 'grey darken-1' : 'transparent'" size="32"></v-avatar>

      <v-tabs centered class="ml-n9" color="white lighten-1">
        <v-tab v-for="link in links" :key="link">
          {{ link }}
        </v-tab>
      </v-tabs>

      <v-avatar class="hidden-sm-and-down" color="grey darken-1 shrink" size="32"></v-avatar>
    </v-app-bar>

    <v-main>
      <v-container fill-height fluid>
        <!--
        <transition name="fade" mode="out-in">
          <span v-if="$route.name !== 'index'" title="Back" class="nav-item nav-back grow" @click="$router.go(-1)">
            <i class="fas fa-chevron-left pr-1"></i>
          </span>
        </transition>
        <div title="Logoff" class="nav-item top-4 right-4 grow text-red-900 hover:text-red-500" @click="logout">
          <i class="fas fa-power-off"></i>
        </div>
        -->
        <Nuxt keep-alive :keep-alive-props="{ max: 10 }" :class="visibleSidebar" />
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import '@/assets/scss/app.scss';
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'V2Layout',
  data: () => ({
    stars: false
  }),
  auth: true
})
export default class V2Layout extends Vue {
  visibleSidebar: boolean = false;
  links = ['Foo', 'Bar'];

  mounted() {
    this.$auth.refreshTokens();
  }

  async logout() {
    await this.$auth.logout();
  }
}
</script>

<style lang="scss">
.header {
  .v-toolbar__content {
    border-bottom: 0.5px solid white;
  }
}
</style>
