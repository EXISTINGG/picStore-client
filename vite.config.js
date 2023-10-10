import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // Vite路径别名配置
    alias: {
      "@": path.resolve(__dirname, './src'),
  }
  },
  // 配置前端服务地址和端口
  // server: {
  //   host: '0.0.0.0',
  //   port: 5173,
  //   // 是否开启 https
  //   https: false,
  // },
})
