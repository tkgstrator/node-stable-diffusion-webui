import CATEGORY_00 from "@/tags/00.yaml";
import CATEGORY_01 from "@/tags/01.yaml";
import CATEGORY_02 from "@/tags/02.yaml";
import CATEGORY_03 from "@/tags/03.yaml";
import CATEGORY_04 from "@/tags/04.yaml";
import CATEGORY_05 from "@/tags/05.yaml";
import CATEGORY_06 from "@/tags/06.yaml";
import CATEGORY_07 from "@/tags/07.yaml";
import CATEGORY_08 from "@/tags/08.yaml";
import CATEGORY_09 from "@/tags/09.yaml";
import CATEGORY_10 from "@/tags/10.yaml";
import CATEGORY_11 from "@/tags/11.yaml";
import CATEGORY_12 from "@/tags/12.yaml";

/**
 * カテゴリ
 */
const categories = [
  CATEGORY_00,
  CATEGORY_01,
  CATEGORY_02,
  CATEGORY_03,
  CATEGORY_04,
  CATEGORY_05,
  CATEGORY_06,
  CATEGORY_07,
  CATEGORY_08,
  CATEGORY_09,
  CATEGORY_10,
  CATEGORY_11,
  CATEGORY_12,
];

/**
 * サンプラー
 */
export enum SamplingMethod {
  EULER = "Euler",
  DPM_2M_KARRAS = "DPM++ 2M Karras",
  DPM_SDE_KARRAS = "DPM++ SDE Karras",
}

/**
 * スケーラー
 */
export enum Upscaler {
  LATENT = "Latent",
  NEAREST = "Nearest",
}

/**
 * カテゴリ
 */
export enum CategoryGroup {
  DEFAULT = "一般",
  APPEARANCES = "外見",
  CHARACTERISTIC = "特徴",
  EXPRESSIONS = "表情",
  ACTIVITIES = "動作",
  EQUIPMENTS = "装飾",
  CLOTHES_BOTH = "服装",
  CLOTHES_TOPS = "トップス",
  CLOTHES_BOTTOMS = "ボトムス",
  CLOTHES_SWIM = "水着",
  ANGLE = "構図",
  PLACES = "場所",
  TIME = "天気/時間",
}

/**
 * WebUIAPIに投げるパラメーター
 */
export class SDWebUIParameters {
  category: CategoryGroup;
  parameters: Parameters;
  prompts: Prompt;

  constructor() {
    this.category = CategoryGroup.DEFAULT;
    this.parameters = new Parameters();
    this.prompts = new Prompt();
  }
}

/**
 * プロンプト
 */
export class Prompt {
  positive: string[] = [];
  negative: string[] = ["EasyNegativev2", "EasyNegative", "badhandv4", "bad-hands-5", "bad_prompt_version2", "text, signature"];
}

/**
 * チェックするプロンプト
 */
export class PromptTag {
  tag: string;
  prompt: string;
  selected: boolean

  constructor(key: string, value: string, selected = false) {
    this.tag = key;
    this.prompt = value;
    this.selected = selected;
  }
}

export class CategoryTag {
  subcategory: string;
  prompts: PromptTag[];

  constructor(subcategory: string, prompts: PromptTag[]) {
    this.subcategory = subcategory;
    this.prompts = prompts;
  }
}

export class CategoryTagGroup {
  category: CategoryGroup;
  groups: CategoryTag[];

  constructor(category: CategoryGroup, prompt: string[] = []) {
    const index: number = Object.values(CategoryGroup).indexOf(category);
    this.category = category;
    this.groups =
      index === -1
        ? []
        : Object.entries(categories[index]).map(([key, values]) => {
            const subcategory: string = key;
            const prompts: PromptTag[] = Object.entries(values).map(([key, value]) => new PromptTag(key, value as string, prompt.includes(value as string)));
            return new CategoryTag(subcategory, prompts);
          });
  }
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
