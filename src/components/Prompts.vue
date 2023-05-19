<script setup lang="ts">
import { Txt2ImgParameters } from '@/api/webuiapi';
import { Prompt } from '@/parameters';
import { PropType } from 'vue';

defineProps({
  prompts: {
    type: Object as PropType<Prompt>,
    required: true
  }
})
</script>

<template>
  <v-col cols="12" lg="12">
    <div>Positive</div>
    <v-textarea :rows="2" counter clearable auto-grow density="compact" v-model="prompts.positive"
      :disabled="true"></v-textarea>
  </v-col>
  <v-divider></v-divider>
  <v-col cols="12" lg="12">
    <div>Negative</div>
    <v-textarea :rows="2" counter clearable auto-grow density="compact" v-model="prompts.negative"
      :disabled="true"></v-textarea>
  </v-col>
</template>

<style lang="scss" scoped>
</style>
