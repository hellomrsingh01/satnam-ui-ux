import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      // The host's inotify watcher budget is often exhausted by other apps;
      // polling avoids relying on it instead of requiring a system-wide fix.
      usePolling: true,
    },
  },
});
