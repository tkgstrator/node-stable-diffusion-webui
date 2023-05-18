import { Upscaler } from "@/parameters"
import axios from "axios"

enum SDWebUIAPIEndPoint {
  TXT2IMG = 'txt2img',
  OPTIONS = 'options',
  PROGRESS = 'progress',
  CMD_FLAGS = 'cmd-flags',
  SAMPLERS = 'samplers',
  UPSCALERS = 'upscalers',
  SD_MODELS = 'sd-models',
  HYPERNETWORKS = 'hypernetworks',
  FACE_RESTORERS = 'face-restorers',
  REALESRGAN_MODELS = 'realesrgan-models',
  PROMPT_STYLES = 'prompt-styles',
  ARTIST_CATEGORIES = 'artist-categories',
  CHECKPOINTS = 'checkpoints',
}

enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
}

export class Txt2ImgParameters {
  sampler_name: string = "DPM++ 2M Karras"
  prompt: string = ""
  negative_prompt: string = "EasyNegative, EasyNegativev2, badhandv4, bad-hands-5, bad_prompt_version2"
  denoising_strength: number = 0.7
  enable_hr: boolean = true
  hr_upscaler: Upscaler = Upscaler.LATENT
  hr_scale: number = 1.5
  hr_second_pass_steps: 15
  cfg_scale: number = 7.0
  seed: number = -1
  width: number = 512
  height: number = 768
  steps: number = 30
  batch_count: number = 1
  batch_size: number = 1
  save_images: boolean = true
  post_images: boolean = false
}

export class SDWebUIAPI {
  private readonly base_url: string = "https://dev.tkgstrator.work/sdapi/v1/";

  constructor(base_url: string) {
    this.base_url = base_url;
  }

  private async request(
    method: HTTPMethod,
    endpoint: SDWebUIAPIEndPoint,
    params: any
  ) {
    const url = this.base_url + endpoint;

    try {
      switch (method) {
        case HTTPMethod.GET:
          return await axios.get(url);
        case HTTPMethod.POST:
          return await axios.post(url, params);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async txt2img(params: Txt2ImgParameters): Promise<any> {
    return this.request(HTTPMethod.POST, SDWebUIAPIEndPoint.TXT2IMG, params)
  }

  async get_options(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.OPTIONS, {})
  }

  async set_options(): Promise<any> {
    return this.request(HTTPMethod.POST, SDWebUIAPIEndPoint.OPTIONS, {})
  }

  async get_progress(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.PROGRESS, {})
  }

  async get_cmd_flags(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.CMD_FLAGS, {})
  }

  async get_samplers(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.SAMPLERS, {})
  }

  async get_upscalers(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.UPSCALERS, {})
  }

  async get_sd_models(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.SD_MODELS, {})
  }

  async get_hypernetworks(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.HYPERNETWORKS, {})
  }

  async get_face_restorers(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.FACE_RESTORERS, {})
  }

  async get_realesrgan_models(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.REALESRGAN_MODELS, {})
  }

  async get_prompt_styles(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.PROMPT_STYLES, {})
  }

  async get_artist_categories(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.ARTIST_CATEGORIES, {})
  }

  async refresh_checkpoints(): Promise<any> {
    return this.request(HTTPMethod.POST, SDWebUIAPIEndPoint.CHECKPOINTS, {})
  }
}
