<script setup lang="ts">
import { watch, ref, Ref } from "vue";
import { CategoryGroup, CategoryTag, CategoryTagGroup, Prompt, PromptTag } from "@/parameters"
import { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<Prompt>,
    required: true,
    default: []
  },
  category: {
    type: Object as PropType<CategoryTagGroup>,
    required: true
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', modelValue: Prompt): void
}>()

function positive(prompt: PromptTag) {
  if (props.modelValue.positive.includes(prompt.prompt)) {
    props.modelValue.positive = props.modelValue.positive.filter((item) => item !== prompt.prompt)
    return
  }
  props.modelValue.positive.push(prompt.prompt)
}

function negative(prompt: PromptTag) {
  if (props.modelValue.negative.includes(prompt.prompt)) {
    props.modelValue.negative = props.modelValue.negative.filter((item) => item !== prompt.prompt)
    return
  }
  props.modelValue.negative.push(prompt.prompt)
}

function color(prompt: PromptTag) {
  if (props.modelValue.negative.includes(prompt.prompt)) {
    return "text-error error"
  }
  return undefined
}
</script>

<template>
  <v-row class="mt-2">
    <v-col cols="12" v-for="group in category.groups" :key="group.subcategory">
      <div>{{ group.subcategory }}</div>
      <v-chip-group multiple selected-class="text-primary" column filter variant="outlined">
        <v-chip label outlined v-for="prompt in group.prompts" :key="prompt.prompt" @click="positive(prompt)" v-on:contextmenu.prevent :class="color(prompt)">
          <div @contextmenu.native="negative(prompt)">{{ prompt.tag }}</div>
        </v-chip>
      </v-chip-group>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.v-row {
  margin: 0px;
}
.v-card-title {
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1.1rem;
}

.v-chip-group {
  padding: 0;
}

.v-chip.error.primary {
  color: white;
  background-color: #f44336;
}

.v-col {
  padding: 8px 8px 8px 12px;
}
</style>
