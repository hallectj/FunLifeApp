import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import AppServerModule from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  //const distFolder = join(process.cwd(), 'dist/fun_life_app/browser');
  //const distFolder = join(__dirname, 'dist/fun_life_app/browser');
  //const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    //? join(distFolder, 'index.original.html')
    //: join(distFolder, 'index.html');

  const distFolder = __dirname.replace('server', 'browser');
  let indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res, next) => {
    const { originalUrl, baseUrl, headers } = req;
  
    // Force HTTPS
    const protocol = 'https'
    const canonicalUrl = `${protocol}://${headers.host}${originalUrl}`;
  
    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: canonicalUrl,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => {
        // Inject the canonical URL into the HTML
        const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
        html = html.replace('</head>', `${canonicalTag}</head>`);
  
        res.send(html);
      })
      .catch((err) => next(err));
  });
  

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default AppServerModule;
