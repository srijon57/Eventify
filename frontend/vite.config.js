import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // <-- needed for alias

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- sets @ to src folder
    },
    extensions: ['.js', '.jsx'], // <-- let Vite resolve .jsx files
  },
});
