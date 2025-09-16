# Install nuxt4

$ npm create nuxt@latest nuxt4-electron-minimum-sample

❯ Which package manager would you like to use?
● npm (current)

❯ Initialize git repository?
● No

❯ Pick the modules to install:
(none selected)

cd nuxt4-electron-minimum-sample

# follow `nuxt-electron`'s Quick Setup

https://github.com/caoxiemeihao/nuxt-electron#quick-setup

1.  $ npx nuxi module add electron
2.  $ npm install --save-dev vite-plugin-electron vite-plugin-electron-renderer electron electron-builder
3.  edit `nuxt.config.ts`
4.  add `electron/main.ts`
5.  add the `main` entry to `package.json`

# bring changes from `nuxt-electron`'s `quick-start` directory

https://github.com/caoxiemeihao/nuxt-electron/blob/main/quick-start/

1.  copy following files
    - `electron-builder.json5`
    - `electron-env.d.ts`
    - `electron/preload.ts`
2.  replace following files
    - `.gitignore`
    - `electron/main.ts`
3.  replace `app/app.vue` with `app.vue`
    according to `nuxt4`'s new directory structure
4.  merge following files
    - `electron` object in `nuxt.config.ts`
    - add `"electron:build": "nuxi build --prerender && electron-builder"` script into `package.json`
      leave `nuxt4`'s "build" script as-is.

# Smooth rough edges

1.  add `version` property to `package.json` for electron-builder.

2.  override `@percel/watcher` at 2.4.1 to make build smooth on `Windows`
    otherwise `node-gyp` kicks in and start building something.

3.  add "workaround" for [#108](https://github.com/caoxiemeihao/nuxt-electron/issues/108)

    1. $ npm install --save-dev patch-package
    2. add patch file equivalent to [#109](https://github.com/caoxiemeihao/nuxt-electron/pull/109) which should fix [#108](https://github.com/caoxiemeihao/nuxt-electron/issues/108) under `patches` directory

       ** thanks to https://github.com/michaelw85 **

    3. modify `postinstall` script in `package.json` to run `patch-package` after `npm install`

       `"postinstall": "nuxt prepare && patch-package"`

    4. $ npm install

       ensure patch applies cleanly

4.  fix `electron/main.ts` and move under `app/electron/main.ts` so that `import { Something } from '~/Folder/Something'` should work.

    1.  `__dirname` cannot be used, use `import.meta.dirname` instead.
    2.  modify `entry: 'electron/main.ts'` to `entry: 'app/electron/main.ts'`
    3.  tell `rollup` how to resolve `~/`

5.  fix `electron/preload.ts` and move to `app/electron/preload.ts`

    1.  it seems that `import` cannot be used in `preload.ts.`
        use `require()` instead.
        NOTE that `import type` works, `import` doesn't.
    2.  modify `entry: 'electron/preload.ts'` to `entry: 'app/electron/preload.ts'`

6.  modify `nuxt.config.ts`

    - switch `disableDefaultOptions` on build target.
    - set router in hash mode.

7.  $ npm run dev
    check if development build works
8.  $ npm run electron:build
    check if release/0.0.1/nuxt-app_0.0.1.exe(windows) or release/0.0.1/nuxt-app-0.0.1.AppImage(linux) runs.
    I haven't checked other artifacts.

# DONE
