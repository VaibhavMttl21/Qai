import { jwtVerify } from 'jose'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // ✅ Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // Change this to your frontend domain if needed
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      })
    }

    const token = extractToken(request, url)
    if (!token) {
      return new Response("Unauthorized: No token", {
        status: 401,
        headers: corsHeaders()
      })
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(env.JWT_SECRET)
      )

      if (!payload.isPaid) {
        return new Response("Forbidden: Not a paid user", {
          status: 403,
          headers: corsHeaders()
        })
      }

      const key = url.pathname.slice(1)
      const object = await env.VIDEOS_BUCKET.get(key)

      if (!object) {
        return new Response("File not found", {
          status: 404,
          headers: corsHeaders()
        })
      }

      const contentType = key.endsWith(".m3u8")
        ? "application/vnd.apple.mpegurl"
        : key.endsWith(".ts")
        ? "video/mp2t"
        : "application/octet-stream"

      return new Response(object.body, {
        headers: {
          ...corsHeaders(),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600"
        }
      })
    } catch (err) {
      return new Response("Unauthorized: Invalid token", {
        status: 403,
        headers: corsHeaders()
      })
    }
  }
}

// Function to extract token from either the Authorization header or the query parameter
function extractToken(req: Request, url: URL): string | null {
  const authHeader = req.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }

  return url.searchParams.get("token")
}

// ✅ Centralized CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // change to your frontend domain if needed
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400"
  }
}

interface Env {
  JWT_SECRET: string
  VIDEOS_BUCKET: R2Bucket
}
