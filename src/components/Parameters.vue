<script setup lang="ts">
import {
  SDWebUIAPI,
  Txt2ImgParameters,
  Txt2ImgProgress,
  Txt2ImgResponse,
  SDModelCheckpoint,
  SDWebUIAPIOptions,
} from "@/api/webuiapi";
import { onMounted } from "vue";
import { Ref, ref } from "vue";
import Options from "./Options.vue";
import Sampling from "./Sampling.vue";
import { PropType } from "vue";
import { Prompt, PromptTag } from "@/parameters";
import { watch } from "vue";

const images: Ref<string[]> = ref([]);
const selected_index: Ref<number> = ref(-1);
const is_generating: Ref<boolean> = ref(false);
const progress: Ref<Txt2ImgProgress> = ref(new Txt2ImgProgress());
const client: SDWebUIAPI = new SDWebUIAPI();
const parameters: Ref<Txt2ImgParameters> = ref(new Txt2ImgParameters());
const options: Ref<SDWebUIAPIOptions> = ref(new SDWebUIAPIOptions());
const sd_models: Ref<SDModelCheckpoint[]> = ref([]);
const is_presented: Ref<boolean> = ref(false);

const props = defineProps({
  prompts: {
    type: Object as PropType<Prompt>,
    required: true,
  },
});

async function txt2img(): Promise<void> {
  progress.value = new Txt2ImgProgress();
  images.value = [];
  is_generating.value = true;
  parameters.value.prompt = props.prompts.positive.join(",");
  parameters.value.negative_prompt = props.prompts.negative.join(",");
  const response: Txt2ImgResponse = await client.txt2img(parameters.value, get_progress);
  images.value = response.images.length > 2 ? response.images.slice(1) : response.images;
  localStorage.setItem("parameters", JSON.stringify(response.parameters));
  is_generating.value = false;
}

async function get_progress(callback: Txt2ImgProgress): Promise<void> {
  progress.value = callback;
}

watch(images, (new_value, old_value) => {
  if (new_value.length > 0) {
    selected_index.value = 0;
  }
});

onMounted(async () => {
  options.value = await client.get_options();
  sd_models.value = await client.get_sd_models();
});

function toggle(): void {
  is_presented.value = !is_presented.value;
}
</script>

<template>
  <v-row :dense="true">
    <Options />
    <v-divider></v-divider>
    <Sampling :parameters="parameters" />
    <v-col cols="12" lg="4">
      <v-row :dense="true">
        <v-col cols="12" sm="6" md="6" lg="12" xl="12" class="images-preview mb-2">
          <v-img :src="images[selected_index]" class="mb-3" @click="toggle">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-linear color="amber" max="1" min="0" :model-value="progress.progress" height="25">
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </div>
            </template>
            <v-overlay v-model="is_presented" class="align-center justify-center" eager scrim="#222222">
              <img :src="images[selected_index]" class="preview" @click="toggle" />
            </v-overlay>
          </v-img>
          <v-btn v-if="!is_generating" color="primary" dark style="width: 100%" @click="txt2img">Generate</v-btn>
          <v-btn v-else color="primary" dark style="width: 100%" @click="is_generating">Interrupt</v-btn>
        </v-col>
        <v-col cols="3" class="justify-center" v-for="(image, index) in images" :key="index">
          <v-img :src="image" @click="selected_index = index" :class="selected_index === index ? 'selected' : ''"
            :cover="true"></v-img>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.v-btn {
  height: 40px !important;
}

.images-preview {
  .v-img {
    border: 1px solid #ccc;
    aspect-ratio: 1;
    padding: 12px;
  }
}

.v-img {
  object-fit: contain;
}

.v-img.selected {
  border: 3px solid #f97316;
}

.v-progress-circular {
  display: block;
  margin: 0 auto;
}

img.preview {
  object-fit: contain;
  max-width: 100vw;
  max-height: 100vh
}
</style>
