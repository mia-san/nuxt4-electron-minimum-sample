// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-electron'],
  //  https://github.com/caoxiemeihao/nuxt-electron#quick-setup
  electron: {
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: 'app/electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(args) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          args.reload()
        },
      },
    ],

    //
    //  npm run dev requires disableDefaultOptions: true
    //    c.f. https://github.com/caoxiemeihao/nuxt-electron/issues/86 etc
    //  npm run electron:build requires disableDefaultOptions: false
    //    otherwise built program does not work.
    //
    //  switch disableDefaultOptions on process.env.NODE_ENV,
    //  assuming
    //    npm run dev has process.env.NODE_ENV === 'development'
    //    npm run electron:build has process.env.NODE_ENV === 'production'
    //
    disableDefaultOptions: process.env.NODE_ENV === 'development',

    // Ployfill the Electron and Node.js API for Renderer process.
    // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
    // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
    renderer: {},
  },
  ssr: false, // #43
  //
  //  vue-router may not work as expected in history mode.
  //  use hash mode instead.
  //
  router: {
    options: {
      hashMode: true,
    },
  },
})
