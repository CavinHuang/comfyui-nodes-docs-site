import { defineConfig } from 'vite';
import unocss from 'unocss/vite';
import { MarkdownTransform } from './.vitepress/plugins/markdown-transform';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';


export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import ~/theme/styles/mixins.scss;`,
      },
    },
  },
  optimizeDeps: {
    exclude: ['vitepress'],
  },
  server: {
    port: 8090,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    
    AutoImport({
      imports: ['vue',
      // publics
        {
          
        }
      ],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    Icons({
      autoInstall: true,
    }),
    unocss() as any,
    MarkdownTransform(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './.vitepress'),
    },
  },
});
