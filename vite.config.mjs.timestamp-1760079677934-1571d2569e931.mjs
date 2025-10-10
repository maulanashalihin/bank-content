// vite.config.mjs
import { defineConfig } from "file:///Users/maulanashalihin/Project/bank-contents/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/maulanashalihin/Project/bank-contents/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import "file:///Users/maulanashalihin/Project/bank-contents/node_modules/dotenv/config.js";
import { resolve } from "path";
import { readdirSync } from "fs";
var __vite_injected_original_dirname = "/Users/maulanashalihin/Project/bank-contents";
var files = readdirSync("resources/views");
var input = {};
for (const filename of files) {
  input[filename.replace(".html", "")] = resolve(__vite_injected_original_dirname, `resources/views/${filename}`);
}
var PORT = parseInt(process.env.VITE_PORT) || 3e3;
var vite_config_default = defineConfig({
  plugins: [
    svelte(),
    {
      name: "port-handling",
      configureServer(server) {
        server.httpServer?.on("error", (err) => {
          if (err.code === "EADDRINUSE") {
            console.error(`\x1B[31mError: Vite Port ${PORT} is already in use. Shutting down server.\x1B[0m`);
            process.exit(1);
          }
        });
      }
    }
  ],
  root: "resources",
  server: {
    host: "0.0.0.0",
    port: PORT,
    strictPort: true
    // Don't allow Vite to automatically try the next available port
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hdWxhbmFzaGFsaWhpbi9Qcm9qZWN0L2JhbmstY29udGVudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYXVsYW5hc2hhbGloaW4vUHJvamVjdC9iYW5rLWNvbnRlbnRzL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWF1bGFuYXNoYWxpaGluL1Byb2plY3QvYmFuay1jb250ZW50cy92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcbmltcG9ydCAnZG90ZW52L2NvbmZpZydcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgcmVhZGRpclN5bmMgfSBmcm9tICdmcyc7XG5cbmNvbnN0IGZpbGVzID0gcmVhZGRpclN5bmMoXCJyZXNvdXJjZXMvdmlld3NcIik7XG5cbmxldCBpbnB1dCA9IHt9O1xuXG5mb3IgKGNvbnN0IGZpbGVuYW1lIG9mIGZpbGVzKSB7XG4gIGlucHV0W2ZpbGVuYW1lLnJlcGxhY2UoXCIuaHRtbFwiLCBcIlwiKV0gPSByZXNvbHZlKF9fZGlybmFtZSwgYHJlc291cmNlcy92aWV3cy8ke2ZpbGVuYW1lfWApO1xufVxuXG4vLyBEZWZhdWx0IHBvcnQgZnJvbSBlbnZpcm9ubWVudCBvciBmYWxsYmFjayB0byAzMDAwXG5jb25zdCBQT1JUID0gcGFyc2VJbnQocHJvY2Vzcy5lbnYuVklURV9QT1JUKSB8fCAzMDAwO1xuIFxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3ZlbHRlKCksXG4gICAge1xuICAgICAgbmFtZTogJ3BvcnQtaGFuZGxpbmcnLFxuICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICAvLyBIYW5kbGUgc2VydmVyIHN0YXJ0dXAgZXJyb3JzXG4gICAgICAgIHNlcnZlci5odHRwU2VydmVyPy5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRUFERFJJTlVTRScpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFxceDFiWzMxbUVycm9yOiBWaXRlIFBvcnQgJHtQT1JUfSBpcyBhbHJlYWR5IGluIHVzZS4gU2h1dHRpbmcgZG93biBzZXJ2ZXIuXFx4MWJbMG1gKTtcbiAgICAgICAgICAgIC8vIEV4aXQgdGhlIHByb2Nlc3Mgd2l0aCBhbiBlcnJvciBjb2RlXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIF0sXG4gIHJvb3Q6ICdyZXNvdXJjZXMnLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgcG9ydDogUE9SVCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlIC8vIERvbid0IGFsbG93IFZpdGUgdG8gYXV0b21hdGljYWxseSB0cnkgdGhlIG5leHQgYXZhaWxhYmxlIHBvcnRcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICcuLi9kaXN0JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDogaW5wdXRcbiAgICB9XG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VCxTQUFTLG9CQUFvQjtBQUNyVixTQUFTLGNBQWM7QUFDdkIsT0FBTztBQUNQLFNBQVMsZUFBZTtBQUN4QixTQUFTLG1CQUFtQjtBQUo1QixJQUFNLG1DQUFtQztBQU16QyxJQUFNLFFBQVEsWUFBWSxpQkFBaUI7QUFFM0MsSUFBSSxRQUFRLENBQUM7QUFFYixXQUFXLFlBQVksT0FBTztBQUM1QixRQUFNLFNBQVMsUUFBUSxTQUFTLEVBQUUsQ0FBQyxJQUFJLFFBQVEsa0NBQVcsbUJBQW1CLFFBQVEsRUFBRTtBQUN6RjtBQUdBLElBQU0sT0FBTyxTQUFTLFFBQVEsSUFBSSxTQUFTLEtBQUs7QUFHaEQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1A7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLGdCQUFnQixRQUFRO0FBRXRCLGVBQU8sWUFBWSxHQUFHLFNBQVMsQ0FBQyxRQUFRO0FBQ3RDLGNBQUksSUFBSSxTQUFTLGNBQWM7QUFDN0Isb0JBQVEsTUFBTSw0QkFBNEIsSUFBSSxrREFBa0Q7QUFFaEcsb0JBQVEsS0FBSyxDQUFDO0FBQUEsVUFDaEI7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNiO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
