<script setup lang="ts">
import { SDWebUIAPI, Txt2ImgParameters, Txt2ImgProgress, Txt2ImgResponse, SDModelCheckpoint, SDWebUIAPIOptions, SDVAECheckpoint } from "@/api/webuiapi";
import { SamplingMethod, Upscaler } from "@/parameters";
import axios from "axios";
import { onMounted } from "vue";
import { Ref, ref } from "vue";

// axios.defaults.baseURL = 'http://localhost:7861';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const images: Ref<string[]> = ref([]);
const selected_index: Ref<number> = ref(0);
const is_generating: Ref<boolean> = ref(false);
const progress: Ref<Txt2ImgProgress> = ref(new Txt2ImgProgress());
const client: SDWebUIAPI = new SDWebUIAPI();
const parameters: Ref<Txt2ImgParameters> = ref(new Txt2ImgParameters());
const previous_parameters: Ref<Txt2ImgParameters> = ref(new Txt2ImgParameters());
const options: Ref<SDWebUIAPIOptions> = ref(new SDWebUIAPIOptions());
const sd_models: Ref<SDModelCheckpoint[] > = ref([]);
const sd_vae_checkpoints: Ref<SDVAECheckpoint[]> = ref(Object.values(SDVAECheckpoint));

async function txt2img(): Promise<void> {
  progress.value = new Txt2ImgProgress();
  images.value = [];
  is_generating.value = true;
  const response: Txt2ImgResponse = (await client.txt2img(parameters.value, get_progress));
  console.log(response.images.length)
  images.value = response.images
  previous_parameters.value = response.parameters
  is_generating.value = false;
}

async function get_progress(callback: Txt2ImgProgress): Promise<void> {
  progress.value = callback;
}

onMounted(async () => {
  options.value = await client.get_options();
  sd_models.value = await client.get_sd_models();
})
</script>

<template>
  <v-row>
    <v-col cols="12" lg="12">
      <div>Positive</div>
      <v-textarea :rows="2" counter clearable auto-grow density="compact" v-model="parameters.prompt" :disabled="true"></v-textarea>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12" lg="12">
      <div>Negative</div>
      <v-textarea
        :rows="2"
        counter
        clearable
        auto-grow
        density="compact"
        v-model="parameters.negative_prompt"
        :disabled="true"
      ></v-textarea>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12" sm="6" md="4" lg="3" xl="3">
      <div>Checkpoint</div>
      <v-select :items="sd_models" density="compact" v-model="options.sd_model_checkpoint" hide-details item-title="model_name" item-value="title" single-line></v-select>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="4" xl="4">
      <div>VAE</div>
      <v-select :items="sd_vae_checkpoints" density="compact" v-model="options.sd_vae" hide-details item-title="model_name" item-value="title" single-line></v-select>
    </v-col>
    <v-col cols="6" sm="3" md="2" lg="2" xl="2">
      <div>Clip skip</div>
      <v-select :items="[1, 2]" density="compact" v-model="options.CLIP_stop_at_last_layers" hide-details single-line></v-select>
    </v-col>
    <v-col cols="6" sm="3" md="2" lg="2" xl="2">
      <div>ENSD</div>
      <v-select :items="[0, 31337]" density="compact" v-model="options.eta_noise_seed_delta" hide-details single-line></v-select>
    </v-col>
    <v-col cols="6" sm="3" md="6" lg="3" xl="3">
      <div>Options</div>
      <v-btn color="primary" dark style="width: 100%" @click="client.set_options(options)">Set</v-btn>
    </v-col>
    <v-col cols="6" sm="3" md="6" lg="3" xl="3">
      <div>Generate</div>
      <v-btn v-if="!is_generating" color="primary" dark style="width: 100%" @click="txt2img">Generate</v-btn>
      <v-btn v-else color="primary" dark style="width: 100%" @click="is_generating">Interrupt</v-btn>
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12" lg="8">
      <v-row :dense="true">
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <div>Sampling method</div>
          <v-select :items="Object.values(SamplingMethod)" density="compact" v-model="parameters.sampler_name" single-line> </v-select>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <div>Sampling steps</div>
          <v-slider min="25" max="50" step="5" v-model="parameters.steps">
            <template v-slot:append>
              <v-text-field
                type="number"
                style="width: 70px"
                density="compact"
                hide-details
                variant="outlined"
                v-model="parameters.steps"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row :dense="true">
        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
          <v-checkbox label="Hires. fix" density="compact" v-model="parameters.enable_hr"></v-checkbox>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
          <v-checkbox label="Not safe for work" density="compact" v-model="parameters.nsfw"></v-checkbox>
        </v-col>
        <template v-if="parameters.enable_hr">
          <v-col cols="6" sm="6" md="6" lg="6" xl="2">
            <div>Upscaler</div>
            <v-select :items="Object.values(Upscaler)" :value="Upscaler.LATENT" density="compact" single-line> </v-select>
          </v-col>
          <v-col cols="6" sm="6" md="6" lg="6" xl="3">
            <div>Hires steps</div>
            <v-slider min="15" max="30" step="5" v-model="parameters.hr_second_pass_steps">
              <template v-slot:append>
                <v-text-field
                  type="number"
                  style="width: 70px"
                  density="compact"
                  hide-details
                  variant="outlined"
                  v-model="parameters.hr_second_pass_steps"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
          <v-col cols="6" sm="6" md="6" lg="6" xl="3">
            <div>Denoising strength</div>
            <v-slider min="0.5" max="1.0" step="0.05" v-model="parameters.denoising_strength">
              <template v-slot:append>
                <v-text-field
                  type="number"
                  style="width: 80px"
                  density="compact"
                  hide-details
                  variant="outlined"
                  v-model="parameters.denoising_strength"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
          <v-col cols="6" sm="6" md="6" lg="6" xl="3">
            <div>Upscale by</div>
            <v-slider min="1.0" max="2.0" step="0.05" v-model="parameters.hr_scale">
              <template v-slot:append>
                <v-text-field
                  type="number"
                  style="width: 70px"
                  density="compact"
                  hide-details
                  variant="outlined"
                  v-model="parameters.hr_scale"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
        </template>
      </v-row>
      <v-divider></v-divider>
      <v-row :dense="true">
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Width</div>
          <v-radio-group inline v-model="parameters.width">
            <v-radio label="512" :value="512"></v-radio>
            <v-radio label="768" :value="768"></v-radio>
            <v-radio label="1024" :value="1024"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Height</div>
          <v-radio-group inline v-model="parameters.height">
            <v-radio label="512" :value="512"></v-radio>
            <v-radio label="768" :value="768"></v-radio>
            <v-radio label="1024" :value="1024"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Seed</div>
          <v-text-field type="number" density="compact" hide-details variant="outlined" v-model="parameters.seed"> </v-text-field>
        </v-col>
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Random</div>
          <v-btn-toggle divided>
          <v-btn @click="parameters.seed = -1">
            <v-icon icon="mdi-dice-6-outline" role="img"></v-icon>
          </v-btn>
          <v-btn @click="parameters.seed = previous_parameters.seed">
            <v-icon icon="mdi-recycle-variant" role="img"></v-icon>
          </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row :dense="true">
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Save images</div>
          <v-checkbox label="Enabled" density="compact" v-model="parameters.save_images"></v-checkbox>
        </v-col>
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Post images</div>
          <v-checkbox label="Enabled" density="compact" v-model="parameters.post_images"></v-checkbox>
        </v-col>
        <v-col cols="6" sm="6" md="3" lg="3" xl="3">
          <div>Batch size</div>
          <v-slider min="1" max="4" step="1" v-model="parameters.batch_size">
            <template v-slot:append>
              <v-text-field
                type="number"
                style="width: 80px"
                density="compact"
                hide-details
                variant="outlined"
                v-model="parameters.batch_size"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" lg="4">
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="12" xl="12" class="images-preview mb-2">
          <v-img :src="images[selected_index]" class="mx-auto">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-linear color="amber" max="1" min="0" :model-value="progress.progress" height="25">
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="2" class="justify-center" v-for="(image, index) in images" :key="index">
          <v-img
            :src="image"
            width="64"
            class="mx-2"
            @click="selected_index = index"
            :class="selected_index === index ? 'selected' : ''"
            :cover="true"
          ></v-img>
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
