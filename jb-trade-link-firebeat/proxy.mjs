#!/usr/bin/env node

/**
 * Simple CORS Proxy for Development
 * Bypasses CORS restrictions for Supabase authentication
 * Usage: node proxy.mjs
 */

const PORT = process.env.PROXY_PORT || 3001;
const SUPABASE_URL = 'https://qlosefnvwvmqeebfqdcg.supabase.co';

// Create HTTP server
const server = await import('http').then(mod => mod.createServer);
const url = await import('url').then(mod => mod.URL);

const requestHandler = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-client-info');
  res.setHeader('Access-Control-Max-Age', '3600');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Remove leading /supabase from path if present
    let targetPath = req.url.replace(/^\/supabase/, '');
    if (!targetPath.startsWith('/')) targetPath = '/' + targetPath;

    const targetUrl = `${SUPABASE_URL}${targetPath}`;

    console.log(`${req.method} ${req.url} -> ${targetUrl}`);

    // Build request options
    const requestOptions = {
      method: req.method,
      headers: {
        ...req.headers,
        host: new url.URL(SUPABASE_URL).host,
      },
    };

    // Remove hop-by-hop headers
    delete requestOptions.headers['connection'];
    delete requestOptions.headers['keep-alive'];
    delete requestOptions.headers['transfer-encoding'];
    delete requestOptions.headers['upgrade'];

    // Forward the request
    const https = await import('https');
    const proxyReq = https.request(targetUrl, requestOptions, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
      console.error('Proxy request error:', error);
      res.writeHead(502);
      res.end(JSON.stringify({ error: 'Bad gateway', message: error.message }));
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
  }
};

const http = await import('http');
const httpServer = http.createServer(requestHandler);

httpServer.listen(PORT, () => {
  console.log(`\n🔄 CORS Proxy Server Running`);
  console.log(`════════════════════════════════════`);
  console.log(`  📍 Listening on: http://localhost:${PORT}`);
  console.log(`  🎯 Proxying to: ${SUPABASE_URL}`);
  console.log(`  🌐 CORS enabled for all origins`);
  console.log(`════════════════════════════════════\n`);
  console.log(`✅ Ready to forward requests`);
  console.log(`📝 Start your dev server on another terminal: npm run dev\n`);
});

process.on('SIGINT', () => {
  console.log('\n✋ Shutting down proxy...');
  httpServer.close(() => {
    console.log('✅ Proxy stopped');
    process.exit(0);
  });
});
