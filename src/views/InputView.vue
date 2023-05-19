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

const parameters: Ref<SDWebUIParameters> = ref(new SDWebUIParameters());
const category_tag_group: Ref<CategoryTagGroup> = ref(new CategoryTagGroup(CategoryGroup.DEFAULT));

watch(parameters.value, (new_value, old_value) => {
  category_tag_group.value = new CategoryTagGroup(new_value.category);
});
</script>

<template>
  <CategorySlider v-model="parameters.category" />
  <PromptTags v-model="parameters.prompts" :category="category_tag_group" />
  <PromptsView :prompts="parameters.prompts" />
  <v-divider></v-divider>
  <ParametersView :prompts="parameters.prompts" />
</template>
