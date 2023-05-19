<script setup lang="ts">
import { Ref, ref } from "vue";
import { CategoryGroup } from "@/parameters";
import { __internal__deprecationWarning } from "@babel/types";
import { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: String as PropType<CategoryGroup>,
    required: true,
    default: CategoryGroup.DEFAULT,
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", category: CategoryGroup): void;
}>();

function selected(category: CategoryGroup, callback: () => void) {
  callback();
  emit("update:modelValue", category);
}
</script>

<template>
  <v-row :dense="true">
    <v-slide-group show-arrows center-active mandatory>
      <v-slide-group-item v-for="[key, category] in Object.entries(CategoryGroup)" :key="key"
        v-slot="{ isSelected, toggle }">
        <v-btn class="ma-1" :variant="isSelected ? undefined : 'outlined'" :color="isSelected ? 'primary' : undefined"
          rounded @click="selected(category, toggle)">
          {{ category }}
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
  </v-row>
</template>

<style lang="scss" scoped>
</style>
