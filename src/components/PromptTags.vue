<script setup lang="ts">
import { CategoryTagGroup, Prompt, PromptTag } from "@/parameters";
import { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Object as PropType<Prompt>,
    required: true,
    default: [],
  },
  category: {
    type: Object as PropType<CategoryTagGroup>,
    required: true,
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", modelValue: Prompt): void;
  (event: "restore"): void;
}>();

function positive(prompt: PromptTag) {
  if (props.modelValue.positive.includes(prompt.prompt)) {
    props.modelValue.positive = props.modelValue.positive.filter((item) => item !== prompt.prompt);
    return;
  }
  props.modelValue.positive.push(prompt.prompt);
}

function reset() {
  props.modelValue.positive = [];
}

function negative(prompt: PromptTag) {
  if (props.modelValue.negative.includes(prompt.prompt)) {
    props.modelValue.negative = props.modelValue.negative.filter((item) => item !== prompt.prompt);
    return;
  }
  props.modelValue.negative.push(prompt.prompt);
}

function restore() {
  console.log("Restore Emit")
  emit("restore");
}
</script>

<template>
  <v-row :dense="true">
    <v-col cols="12" v-for="group in category.groups" :key="group.subcategory">
      <div>{{ group.subcategory }}</div>
      <v-chip-group variant="outlined">
        <template v-for="prompt in group.prompts" :key="prompt.prompt">
          <v-chip v-on:contextmenu.prevent @click="positive(prompt)" :class="prompt.selected ? 'primary text-primary' : undefined" :max="0">
            {{ prompt.tag }}
          </v-chip>
        </template>
      </v-chip-group>
    </v-col>
    <v-col cols="12">
      <v-btn-group outline variant="outlined" divided>
      <v-btn @click="reset">Reset</v-btn>
      <v-btn @click="restore">Restore</v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.v-btn {
  height: 40px !important;
}

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

.v-chip {
  ::selection {
    background-color: transparent;
  }
}
</style>
