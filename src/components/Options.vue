<script setup lang="ts">
import { SDModelCheckpoint, SDVAECheckpoint, SDWebUIAPI, SDWebUIAPIOptions } from '@/api/webuiapi';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { Ref } from 'vue';
import { PropType } from 'vue';

const client: SDWebUIAPI = new SDWebUIAPI();
const options: Ref<SDWebUIAPIOptions> = ref(new SDWebUIAPIOptions());
const sd_models: Ref<SDModelCheckpoint[]> = ref([]);
const sd_vae_checkpoints: Ref<SDVAECheckpoint[]> = ref(Object.values(SDVAECheckpoint));

onMounted(async () => {
  options.value = await client.get_options();
  sd_models.value = await client.get_sd_models();
})
</script>

<template>
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
</template>

<style lang="scss" scoped>
</style>
