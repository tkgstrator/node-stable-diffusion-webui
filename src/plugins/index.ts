/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import router from "../router";

import vuetify from "./vuetify";
import { loadFonts } from "./webfontloader";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify).use(router);
}
