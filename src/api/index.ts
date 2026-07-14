import { AwsClient } from 'aws4fetch';

export interface Env {
  aacp_db: any; // D1Database binding
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  B2_KEY_ID: string;
  B2_APP_KEY: string;
  B2_BUCKET_NAME: string;
  B2_ENDPOINT: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/products')) {
      try {
        return await handleProducts(request, env);
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname.startsWith('/api/upload')) {
      try {
        return await handleUpload(request, env);
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname.startsWith('/api/images/')) {
      try {
        return await handleImageFetch(request, env);
      } catch (err: any) {
        return new Response("Not Found", { status: 404 });
      }
    }

    // Fallback to static assets (the Vite React app)
    return env.ASSETS.fetch(request);
  }
};

async function getAwsClient(env: Env) {
  return new AwsClient({
    accessKeyId: env.B2_KEY_ID,
    secretAccessKey: env.B2_APP_KEY,
    service: 's3',
    region: 'us-east-005', // B2 regions are usually us-east-005, eu-central-003, etc based on endpoint
  });
}

async function handleUpload(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return new Response('No file uploaded', { status: 400 });
  }

  const aws = await getAwsClient(env);
  const ext = file.name.split('.').pop() || 'png';
  const objectKey = `aacp-catalog/prod-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
  const bucket = env.B2_BUCKET_NAME;
  const endpoint = new URL(env.B2_ENDPOINT);
  
  // B2 uses virtual host styling or path styling. aws4fetch usually needs path style for B2.
  const s3Url = new URL(`/${bucket}/${objectKey}`, endpoint);

  const arrayBuffer = await file.arrayBuffer();

  const response = await aws.fetch(s3Url.toString(), {
    method: 'PUT',
    body: arrayBuffer,
    headers: {
      'Content-Type': file.type,
      'Content-Length': arrayBuffer.byteLength.toString(),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`B2 Upload failed: ${response.status} ${text}`);
  }

  return new Response(JSON.stringify({ url: `/api/images/${objectKey}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleImageFetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  // e.g. /api/images/aacp-catalog/filename.png
  const objectKey = url.pathname.replace('/api/images/', '');
  
  if (!objectKey) {
    return new Response('Not Found', { status: 404 });
  }

  const aws = await getAwsClient(env);
  const bucket = env.B2_BUCKET_NAME;
  const endpoint = new URL(env.B2_ENDPOINT);
  const s3Url = new URL(`/${bucket}/${objectKey}`, endpoint);

  const response = await aws.fetch(s3Url.toString(), {
    method: 'GET'
  });

  if (!response.ok) {
    return new Response('Not Found', { status: response.status });
  }

  // Return the fetched stream with a long cache
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

async function handleProducts(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathParts = url.pathname.split('/').filter(Boolean); // ['api', 'products', ':id']

    if (method === 'GET' && pathParts.length === 2) {
        const { results } = await env.aacp_db.prepare("SELECT * FROM products").all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (method === 'POST' && pathParts.length === 2) {
        const body = await request.json();
        const { id, title, desc, image, tag, weight, type, priceType, multiplier, fixedPrice } = body;
        
        await env.aacp_db.prepare(
            "INSERT INTO products (id, title, desc, image, tag, weight, type, priceType, multiplier, fixedPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(id, title, desc, image, tag, weight, type, priceType, multiplier, fixedPrice).run();

        return new Response(JSON.stringify({ success: true, id }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (method === 'PUT' && pathParts.length === 3) {
        const id = pathParts[2];
        const body = await request.json();
        const { title, desc, image, tag, weight, type, priceType, multiplier, fixedPrice } = body;
        
        await env.aacp_db.prepare(
            "UPDATE products SET title=?, desc=?, image=?, tag=?, weight=?, type=?, priceType=?, multiplier=?, fixedPrice=? WHERE id=?"
        ).bind(title, desc, image, tag, weight, type, priceType, multiplier, fixedPrice, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (method === 'DELETE' && pathParts.length === 3) {
        const id = pathParts[2];
        
        await env.aacp_db.prepare("DELETE FROM products WHERE id=?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response("Not Found", { status: 404 });
}
