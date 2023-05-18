export enum SamplingMethod {
  EULER = "Euler",
  DPM_2M_KARRAS = "DPM++ 2M Karras",
  DPM_SDE_KARRAS = "DPM++ SDE Karras",
}

export enum Upscaler {
  LATENT = "Latent",
  NEAREST = "Nearest",
}

export class Parameters {
  sampling_method: SamplingMethod = SamplingMethod.DPM_2M_KARRAS;
  samplings_steps = 25;
  width = 512;
  height = 512;
  batch_count = 1;
  batch_size = 1;
  cfg_scale = 7;
  seed = -1;
  hires_fix = false;
  hires_steps = 0;
  upscaled_by = 1.5;
  denoising_strength = 0.7;
}
