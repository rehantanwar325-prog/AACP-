export interface Env {
  aacp_db: any; // D1Database binding
  ASSETS: { fetch: (req: Request) => Promise<Response> };
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

    // Fallback to static assets (the Vite React app)
    return env.ASSETS.fetch(request);
  }
};

async function handleProducts(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathParts = url.pathname.split('/').filter(Boolean); // ['api', 'products', ':id']

    if (method === 'GET' && pathParts.length === 2) {
        // GET /api/products
        const { results } = await env.aacp_db.prepare("SELECT * FROM products").all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (method === 'POST' && pathParts.length === 2) {
        // POST /api/products
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
        // PUT /api/products/:id
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
        // DELETE /api/products/:id
        const id = pathParts[2];
        
        await env.aacp_db.prepare("DELETE FROM products WHERE id=?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response("Not Found", { status: 404 });
}
