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
  sampling_method: SamplingMethod = SamplingMethod.DPM_2M_KARRAS
  samplings_steps: number = 25
  width: number = 512
  height: number = 512
  batch_count: number = 1
  batch_size: number = 1
  cfg_scale: number = 7
  seed: number = -1
  hires_fix: boolean = false
  hires_steps: number = 0
  upscaled_by: number = 1.5
  denoising_strength: number = 0.7
}
