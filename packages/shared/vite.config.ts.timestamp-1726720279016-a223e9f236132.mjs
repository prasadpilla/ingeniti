// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'file:///home/devang-vishnu/CS/work/ingeniti/node_modules/vite/dist/node/index.js';
import dts from 'file:///home/devang-vishnu/CS/work/ingeniti/node_modules/vite-plugin-dts/dist/index.mjs';
var __vite_injected_original_dirname = '/home/devang-vishnu/CS/work/ingeniti/packages/shared';
var vite_config_default = defineConfig({
  build: {
    lib: { entry: resolve(__vite_injected_original_dirname, 'src/main.ts'), name: 'utils' },
  },
  plugins: [dts()],
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXZhbmctdmlzaG51L0NTL3dvcmsvaW5nZW5pdGkvcGFja2FnZXMvc2hhcmVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXZhbmctdmlzaG51L0NTL3dvcmsvaW5nZW5pdGkvcGFja2FnZXMvc2hhcmVkL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2RldmFuZy12aXNobnUvQ1Mvd29yay9pbmdlbml0aS9wYWNrYWdlcy9zaGFyZWQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHsgbGliOiB7IGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9tYWluLnRzJyksIG5hbWU6ICd1dGlscycgfSB9LFxuICBwbHVnaW5zOiBbZHRzKCldLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThVLFNBQVMsZUFBZTtBQUN0VyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFGaEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLFFBQVEsa0NBQVcsYUFBYSxHQUFHLE1BQU0sUUFBUSxFQUFFO0FBQUEsRUFDMUUsU0FBUyxDQUFDLElBQUksQ0FBQztBQUNqQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
