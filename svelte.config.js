import preprocess from "svelte-preprocess";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

import adapter from "@sveltejs/adapter-static";

const config = {
  preprocess: preprocess({
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  }),

  kit: {
    files: {
      // assets: "src/heartbeat_assets/assets",
      // hooks: {
      // 	server: 'src/heartbeat_assets/hooks',
      // 	client: 'src/heartbeat_assets/hooks'
      // },
      // lib: "src/heartbeat_assets/lib",
      routes: "src/heartbeat_assets/routes",
      appTemplate: "src/heartbeat_assets/app.html",
    },
    // paths: {
    // 	assets: '',
    // 	base: ''
    // },
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
      precompress: false,
    }),
  },
};

export default config;
