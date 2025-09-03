import path from 'path';

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
        vite: {
          //
          //  typescript eliminates 'import type', but output 'import' as is,
          //  e.g.
          //    import type SomeInterface from '~/InterfaceFolder/SomeInterface'
          //  is eliminated, where as
          //    import SomeEnum from '~/EnumFolder/SomeEnum',
          //    import SomeFunc from '~/FuncFolder/SomeFunc'
          //  appear in javascript.
          //
          //  rollup does not know how to resolve those paths.
          //    [vite]: Rollup failed to resolve import "~/EnumFolder/SomeEnum" from "/home/user/projects/nuxt4-electron-minimum-sample/app/electron/main.ts".
          //  so we tell rollup that ~/ means {__dirname}/app/
          //
          //  NOTE that path.join(__dirname, 'app') does NOT work.
          //  beware trailing '/'
          //
          resolve: {
            alias: { '~/': path.join(__dirname, 'app/') },
          },
        },
      },
      {
        entry: 'app/electron/preload.ts',
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
