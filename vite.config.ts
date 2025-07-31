import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500,
    open: true,
    proxy: {
      '/api': {
        target: 'https://dev.epx.everypixel.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },


  },
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   server: {
//     port: 5500, // Фронтенд на 5500
//     open: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000', // Замени на реальный порт бэкенда (например, 5000, 3000)
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
//   plugins: [react()],
// });