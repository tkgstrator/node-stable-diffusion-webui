<script setup lang="ts">
import PromptTags from "@/components/PromptTags.vue";
import CategorySlider from "@/components/CategorySlider.vue";
import { CategoryGroup, Parameters, SDWebUIParameters } from "@/parameters";
import { watch } from "vue";
import { ref } from "vue";
import { Ref } from "vue";
import { CategoryTagGroup } from "@/parameters";
import PromptsView from "@/components/Prompts.vue";
import ParametersView from "@/components/Parameters.vue";
import { plainToInstance } from "class-transformer";
import { Txt2ImgParameters } from "@/api/webuiapi";

const parameters: Ref<SDWebUIParameters> = ref(new SDWebUIParameters());
const category_tag_group: Ref<CategoryTagGroup> = ref(new CategoryTagGroup(CategoryGroup.DEFAULT));

watch(parameters.value, (new_value, old_value) => {
  category_tag_group.value = new CategoryTagGroup(new_value.category, new_value.prompts.positive);
});

function restore(): void {
  if (localStorage.getItem("parameters") !== null) {
    const txt2img: Txt2ImgParameters = plainToInstance(Txt2ImgParameters, JSON.parse(localStorage.getItem("parameters") as string));
    parameters.value.prompts.positive = txt2img.prompt.split(",").map((value) => value.trim());
    parameters.value.prompts.negative = txt2img.negative_prompt.split(",").map((value) => value.trim());
  }
}
</script>

<template>
  <CategorySlider v-model="parameters.category" />
  <PromptTags v-model="parameters.prompts" :category="category_tag_group" @restore="restore"/>
  <PromptsView :prompts="parameters.prompts" />
  <v-divider></v-divider>
  <ParametersView :prompts="parameters.prompts" />
</template>
