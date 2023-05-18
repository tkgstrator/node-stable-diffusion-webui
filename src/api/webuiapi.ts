import axios from "axios";
import { Expose, Transform, plainToInstance } from "class-transformer";

import { SamplingMethod, Upscaler } from "@/parameters";

enum SDWebUIAPIEndPoint {
  TXT2IMG = "txt2img",
  OPTIONS = "options",
  PROGRESS = "progress",
  CMD_FLAGS = "cmd-flags",
  SAMPLERS = "samplers",
  UPSCALERS = "upscalers",
  SD_MODELS = "sd-models",
  HYPERNETWORKS = "hypernetworks",
  FACE_RESTORERS = "face-restorers",
  REALESRGAN_MODELS = "realesrgan-models",
  PROMPT_STYLES = "prompt-styles",
  ARTIST_CATEGORIES = "artist-categories",
  CHECKPOINTS = "checkpoints",
}

enum HTTPMethod {
  GET = "GET",
  POST = "POST",
}

export class Txt2ImgResponse {
  @Expose()
  @Transform((param) => param.value.map((value: string) => "data:image/png;base64," + value))
  images: string[];
}

export class Sampler {
  name: string
  aliases: string[]
}

export class Txt2ImgProgress {
  progress = 0.0;
  eta_relative = 0.0;
  state: {
    interrupted: boolean;
    job: string;
    job_count: number;
    job_no: number;
    job_timestamp: string;
    sampling_step: number;
    sampling_steps: number;
    skipped: boolean;
  };
  current_image: string | null;
  textinfo: string | null;
}

export class Txt2ImgParameters {
  sampler_name: SamplingMethod = SamplingMethod.DPM_2M_KARRAS;
  prompt =
    "masterpiece, (best quality), (ultra-detailed:1.4), high resolution, original characters, depth of field, solo focus, wearing black glasses, a middle school student girl, small breasts, semi long straight hair, little smiling, wearing a school uniform with blue tie, short sleeve, head tilt, in the nostalgic library, best composition, loose strokes, rough painting, cheerful";
  negative_prompt = "EasyNegative, EasyNegativev2, badhandv4, bad-hands-5, bad_prompt_version2";
  denoising_strength = 0.7;
  enable_hr = true;
  hr_upscaler: Upscaler = Upscaler.LATENT;
  hr_scale = 1.5;
  hr_second_pass_steps = 15;
  cfg_scale = 7.0;
  seed = -1;
  width = 512;
  height = 768;
  steps = 30;
  batch_count = 1;
  batch_size = 1;
  save_images = true;
  post_images = false;
}

export class SDWebUIAPIOptions {
  sd_model_checkpoint: string
  sd_checkpoint_cache: number
  sd_vae_checkpoint_cache: number
  sd_vae: string
  sd_vae_as_default: boolean
  CLIP_stop_at_last_layers: number
}

export class SDModelCheckpoint {
  title: string
  model_name: string
  hash: string | null
  sha256: string | null
  filename: string
  config: string | null
}

export class SDWebUIAPI {
  private readonly base_url: string;

  constructor() {
    this.base_url = import.meta.env.VITE_APP_SDWEBUI_API_BASE_URL;
  }

  private async request(method: HTTPMethod, endpoint: SDWebUIAPIEndPoint, params: object = {}): Promise<any> {
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

  async txt2img(params: Txt2ImgParameters, callback: (progress: Txt2ImgProgress) => void): Promise<Txt2ImgResponse> {
    const timer = setInterval(async () => {
      const progress: Txt2ImgProgress = await this.get_progress();
      callback(progress);
    }, 1000);
    const response: Txt2ImgResponse = plainToInstance(
      Txt2ImgResponse,
      (await this.request(HTTPMethod.POST, SDWebUIAPIEndPoint.TXT2IMG, params)).data,
    );
    clearInterval(timer);
    return response;
  }

  async get_options(): Promise<SDWebUIAPIOptions> {
    return plainToInstance(SDWebUIAPIOptions, (await this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.OPTIONS)).data);
  }

  async set_options(params: SDWebUIAPIOptions): Promise<SDWebUIAPIOptions> {
    return plainToInstance(SDWebUIAPIOptions, (await this.request(HTTPMethod.POST, SDWebUIAPIEndPoint.OPTIONS, params)).data);
  }

  async get_progress(): Promise<Txt2ImgProgress> {
    return plainToInstance(Txt2ImgProgress, (await this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.PROGRESS)).data);
  }

  async get_cmd_flags(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.CMD_FLAGS, {});
  }

  async get_samplers(): Promise<any> {
    return (await this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.SAMPLERS)).data.map((sampler: any) => plainToInstance(Sampler, sampler));
  }

  async get_upscalers(): Promise<Sampler[]> {
    return (await this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.UPSCALERS)).data.map((sampler: any) => plainToInstance(Upscaler, sampler));
  }

  async get_sd_models(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.SD_MODELS);
  }

  async get_hypernetworks(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.HYPERNETWORKS, {});
  }

  async get_face_restorers(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.FACE_RESTORERS, {});
  }

  async get_realesrgan_models(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.REALESRGAN_MODELS, {});
  }

  async get_prompt_styles(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.PROMPT_STYLES, {});
  }

  async get_artist_categories(): Promise<any> {
    return this.request(HTTPMethod.GET, SDWebUIAPIEndPoint.ARTIST_CATEGORIES, {});
  }

  async refresh_checkpoints(): Promise<any> {
    return this.request(HTTPMethod.POST, SDWebUIAPIEndPoint.CHECKPOINTS, {});
  }
}
