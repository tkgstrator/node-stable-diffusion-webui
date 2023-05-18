<script setup lang="ts">
import { SDWebUIAPI } from '@/api/webuiapi';
import { SamplingMethod, Upscaler } from '@/parameters'
import axios from 'axios';
import { Ref, ref } from 'vue';

// axios.defaults.baseURL = 'http://localhost:7861';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const images: Ref<String[]> = ref([])
const selected_index: Ref<number> = ref(0)
const is_generating: Ref<boolean> = ref(false)
const progress_value: Ref<number> = ref(0)
const client: SDWebUIAPI = new SDWebUIAPI()

async function options() {
  const base_url: string = "https://dev.tkgstrator.work/sdapi/v1/options"
  const parameters = {
    "sd_model_checkpoint": "CounterfeitV30_v30.safetensors [cbfba64e66]",
    "CLIP_stop_at_last_layers": 2
  }
  try {
    const response = await axios.post(base_url, parameters)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

async function samplers() {
  const base_url: string = "https://dev.tkgstrator.work/sdapi/v1/samplers"
  try {
    const response = await axios.get(base_url)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

async function progress() {
  const base_url: string = "https://dev.tkgstrator.work/sdapi/v1/progress"
  try {
    progress_value.value = (await axios.get(base_url)).data.progress
  } catch (error) {
    console.log(error)
  }
}

async function generate() {
  images.value = []
  progress_value.value = 0
  is_generating.value = true
  const base_url: string = "https://dev.tkgstrator.work/sdapi/v1/txt2img"
  const parameters = {
    sampler_name: "DPM++ 2M Karras",
    prompt: "masterpiece, (best quality), (ultra-detailed:1.4), high resolution, original characters, depth of field, solo focus, wearing black glasses, a middle school student girl, small breasts, semi long straight hair, little smiling, wearing a school uniform with blue tie, short sleeve, head tilt, in the nostalgic library, best composition, loose strokes, rough painting, cheerful",
    negative_prompt: "EasyNegative, EasyNegativev2, badhandv4, bad-hands-5, bad_prompt_version2",
    denoising_strength: 0.55,
    enable_hr: true,
    hr_upscaler: "Latent",
    hr_scale: 1.5,
    cfg_scale: 7.0,
    seed: -1,
    width: 512,
    height: 768,
    steps: 30,
    batch_count: 4,
    batch_size: 1,
    save_images: true,
  }

  const timer = setInterval(progress, 1000);
  try {
    images.value = (await axios.post(base_url, parameters)).data.images.map((image: string) => {
      return 'data:image/png;base64,' + image
    })
    is_generating.value = false
    clearInterval(timer)
  } catch (error) {
    console.log(error)
    is_generating.value = false
    clearInterval(timer)
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" lg="8">
      <v-row :dense="true">
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <div>Sampling method</div>
          <v-select :items="Object.values(SamplingMethod)" :value="SamplingMethod.DPM_2M_KARRAS" density="compact">
          </v-select>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <div>Sampling steps</div>
          <v-slider value="30" min="25" max="50" step="5">
            <template v-slot:append>
              <v-text-field type="number" style="width: 80px" density="compact" hide-details
                variant="outlined"></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row :dense="true">
        <v-col cols="12">
          <v-checkbox label="Hires. fix" density="compact"></v-checkbox>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="3" xl="3">
          <div>Upscaler</div>
          <v-select :items="Object.values(Upscaler)" :value="Upscaler.LATENT" density="compact">
          </v-select>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="3" xl="3">
          <div>Hires steps</div>
          <v-slider>
            <template v-slot:append>
              <v-text-field type="number" style="width: 60px" density="compact" hide-details
                variant="outlined"></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="3" xl="3">
          <div>Denoising strength</div>
          <v-slider>
            <template v-slot:append>
              <v-text-field type="number" style="width: 60px" density="compact" hide-details
                variant="outlined"></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="3" xl="3">
          <div>Upscale by</div>
          <v-slider>
            <template v-slot:append>
              <v-text-field type="number" style="width: 60px" density="compact" hide-details
                variant="outlined"></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row :dense="true">
        <v-col cols="4">
          <div>Width</div>
          <v-radio-group inline>
            <v-radio label="512" value="1"></v-radio>
            <v-radio label="768" value="2"></v-radio>
            <v-radio label="1024" value="3"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="4">
          <div>Height</div>
          <v-radio-group inline>
            <v-radio label="512" value="1"></v-radio>
            <v-radio label="768" value="2"></v-radio>
            <v-radio label="1024" value="3"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="3">
          <div>Seed</div>
          <v-text-field type="number" density="compact" hide-details variant="outlined">
          </v-text-field>
        </v-col>
        <v-col cols="1">
          <div>Random</div>
          <v-btn></v-btn>
        </v-col>
      </v-row>
      <v-row :dense="true">
        <v-col cols="3">
          <v-checkbox label="Save images" density="compact"></v-checkbox>
        </v-col>
        <v-col cols="3">
          <v-checkbox label="Send images" density="compact"></v-checkbox>
        </v-col>
        <v-col cols="3">
          <v-btn color="primary" dark style="width: 100%;" @click="progress">Option</v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn v-if="!is_generating" color="primary" dark style="width: 100%;" @click="client.txt2img()">Generate</v-btn>
          <v-btn v-else color="primary" dark style="width: 100%;" @click="is_generating">Interrupt</v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols=12 lg="4">
      <v-row>
        <v-col cols="12" class="images-preview mb-2">
          <v-img :src="images[selected_index]" class="mx-auto" lazy-src="">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height" v-if="is_generating">
                <v-progress-linear color="amber" max="1" min="0" :model-value="progress_value" height="25">
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="2" class="justify-center" v-for="(image, index) in images" :key="index">
          <v-img :src="image" width="64" class="mx-2" @click="selected_index = index"
            :class="selected_index === index ? 'selected' : ''" :cover="true"></v-img>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.v-col {
  padding: 0 0.5rem;
}

.v-row {
  margin: 0px;
}

.v-btn {
  height: 40px !important;
}

.images-preview {
  border: 1px solid #ccc;
  aspect-ratio: 1;
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
</style>
