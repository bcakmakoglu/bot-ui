<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="4" align-self="center">
      <v-card elevation="10" :loading="loading" outlined shaped>
        <v-card-title> Welcome</v-card-title>
        <v-card-subtitle> This page is being reworked. Please be patient until it's finished.</v-card-subtitle>
        <v-card-text class="justify-center">
          <v-form ref="form" v-model="valid" :disabled="loading" @submit.prevent="submit">
            <v-text-field v-model="username" :rules="rules" label="Username" required @input="error = false"></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              :rules="rules"
              label="Password"
              required
              @input="error = false"
            ></v-text-field>
            <v-btn style="display: none" type="submit"></v-btn>
          </v-form>
          <transition name="fade" mode="out-in">
            <p v-show="error" class="red--text font-weight-bold">There was an issue while logging you in. Please try again.</p>
          </transition>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn :disabled="!valid" :loading="loading" outlined color="primary" @click="submit">
            <transition name="fade" mode="out-in">
              <template v-if="!success && !loading && !error"><span>Login</span></template>
              <template v-else-if="success">
                <v-icon color="green" dark>{{ check }}</v-icon>
              </template>
              <template v-else>
                <v-icon color="red" dark>{{ cancel }}</v-icon>
              </template>
            </transition>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { mdiCancel, mdiCheckOutline } from '@mdi/js';
import { Component, Vue } from 'nuxt-property-decorator';
import { timer } from 'rxjs';
import consolaGlobalInstance from 'consola';

@Component({
  name: 'LoginForm',
  layout: 'login',
  transition: 'default',
  auth: false
})
export default class LoginForm extends Vue {
  cancel = mdiCancel;
  check = mdiCheckOutline;
  username = '';
  password = '';
  rules = [(v) => !!v || 'This field is required'];
  valid = false;
  error = false;
  loading = false;
  success = false;

  get disabled() {
    return this.error || this.password === '' || this.username === '';
  }

  async submit() {
    this.loading = true;
    try {
      const login = await this.$auth.loginWith('hasura', {
        data: {
          username: this.username,
          password: this.password
        }
      });

      if (login && login?.status === 200) {
        this.loading = false;
        this.success = true;
        return timer(1000).subscribe(async () => await this.$router.replace('/'));
      }
    } catch (e) {
      consolaGlobalInstance.debug(e);
    }
    this.error = true;
    this.loading = false;
  }
}
</script>
