import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

const SITE_ASSETS = resolve(__dirname, '../site/assets');

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png',  '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp',
};

function serveSiteAssets() {
  return {
    name: 'serve-site-assets',
    configureServer(server) {
      server.middlewares.use('/site-assets', (req, res, next) => {
        const fp = path.join(SITE_ASSETS, decodeURIComponent(req.url.split('?')[0]));
        try {
          if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
            const ext = path.extname(fp).toLowerCase();
            res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public,max-age=3600');
            fs.createReadStream(fp).pipe(res);
          } else { next(); }
        } catch { next(); }
      });
    },
  };
}

function redirectHtmlExtensions() {
  return {
    name: 'redirect-html-extensions',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith('.html')) {
          const clean = req.url.slice(0, -5) || '/';
          res.writeHead(301, { Location: clean });
          res.end();
        } else { next(); }
      });
    },
  };
}

export default defineConfig({
  plugins: [serveSiteAssets(), redirectHtmlExtensions()],
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products/index.html'),
        about:    resolve(__dirname, 'about/index.html'),
        contact:  resolve(__dirname, 'contact/index.html'),
      },
    },
  },
  server: { open: true },
});
