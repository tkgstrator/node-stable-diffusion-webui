<script lang="ts" setup>
import InputView from "./InputView.vue";
</script>

<script lang="ts"></script>

<template>
  <v-app-bar :elevation="0" density="compact" theme="dark">
    <v-toolbar>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Stable Diffusion WebUI</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
  </v-app-bar>
  <v-container>
    <InputView />
  </v-container>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 1280px) {
  .v-container {
    max-width: 1760px;
  }
}
</style>
