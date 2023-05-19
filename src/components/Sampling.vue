<script setup lang="ts">
import { Txt2ImgParameters } from "@/api/webuiapi";
import { SamplingMethod, Upscaler } from "@/parameters";
import { PropType } from "vue";

defineProps({
  parameters: {
    type: Object as PropType<Txt2ImgParameters>,
    required: true,
  },
});
</script>

<template>
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
</style>
