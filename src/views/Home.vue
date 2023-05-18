<script lang="ts" setup>
import ParametersView from "@/components/Parameters.vue";
</script>

<script lang="ts"></script>

<template>
  <v-app-bar :elevation="0" rounded>
    <v-toolbar-title>Stable Diffusion WebUI</v-toolbar-title>
  </v-app-bar>
  <v-container>
    <ParametersView />
  </v-container>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 1280px) {
  .v-container {
    max-width: 1760px;
  }
}
</style>
