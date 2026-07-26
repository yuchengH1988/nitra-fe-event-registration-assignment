import { copyFileSync } from 'node:fs'
import { join } from 'node:path'
import UnoCSS from 'unocss/vite'

const githubPagesBase = '/nitra-fe-event-registration-assignment/'

export default function () {
  return {
    boot: ['unocss'],

    css: ['app.scss'],

    extras: ['material-icons'],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
      },
      vueRouterMode: 'history',
      // Project site: https://<user>.github.io/nitra-fe-event-registration-assignment/
      publicPath: process.env.NODE_ENV === 'production' ? githubPagesBase : '/',
      extendViteConf(viteConf) {
        viteConf.plugins = viteConf.plugins || []
        viteConf.plugins.push(...UnoCSS())
      },
      afterBuild() {
        const spaDir = join(process.cwd(), 'dist/spa')
        copyFileSync(join(spaDir, 'index.html'), join(spaDir, '404.html'))
      },
    },

    devServer: {
      open: true,
      port: 9001,
    },

    framework: {
      config: {},
      plugins: [],
    },
  }
}
