<script setup lang="ts">
import { Txt2ImgParameters } from "@/api/webuiapi";
import { Prompt } from "@/parameters";
import { onMounted } from "vue";
import { watch, PropType, Ref, ref } from "vue";

const prompt: Ref<string> = ref("")
const negative_prompt: Ref<string> = ref("")

const props = defineProps({
  prompts: {
    type: Object as PropType<Prompt>,
    required: true,
  },
});

onMounted(() => {
  prompt.value = props.prompts.positive.join(", ");
  negative_prompt.value = props.prompts.negative.join(", ");
})

// Propsが更新されたらプロンプトを更新する
watch(props.prompts, (new_value, old_value) => {
  prompt.value = new_value.positive.join(", ");
  negative_prompt.value = new_value.negative.join(", ");
});
</script>

<template>
  <v-row :dense="true">
    <v-col cols="12" lg="12">
      <div>Positive</div>
      <v-textarea :rows="2" counter clearable auto-grow density="compact" v-model="prompt" flat no-resize readonly variant="outlined"></v-textarea>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12" lg="12">
      <div>Negative</div>
      <v-textarea :rows="2" counter auto-grow density="compact" single-line v-model="negative_prompt" flat no-resize variant="outlined"></v-textarea>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
