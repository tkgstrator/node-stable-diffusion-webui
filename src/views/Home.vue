<script lang="ts" setup>
import { ref } from 'vue';
import { Ref } from 'vue';
import ParametersView from '@/components/Parameters.vue'
import PromptTagsView from '@/components/PromptTags.vue'
// const red: Ref<number> = ref(0);
// const parameters: Ref<Parameters> = ref(new Parameters())
// const parameters: Parameters = new Parameters() 
</script>

<script lang="ts">
  // export default {
  //   data () {
  //     return {
  //       red: 64,
  //       green: 128,
  //       blue: 10,
  //     }
  //   },
  // }
</script>

<template>
  <v-app-bar :elevation="0" rounded>
    <v-toolbar-title>Stable Diffusion WebUI</v-toolbar-title>
  </v-app-bar>
  <v-container>
    <PromptTagsView />
    <ParametersView :parameters="parameters" />
  </v-container>
</template>
