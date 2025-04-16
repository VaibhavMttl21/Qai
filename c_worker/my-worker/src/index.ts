import { jwtVerify } from 'jose'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    const token = extractToken(request, url)
    if (!token) {
      return new Response("Unauthorized: No token", { status: 401 })
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(env.JWT_SECRET)
      )

      if (!payload.isPaid) {
        return new Response("Forbidden: Not a paid user", { status: 403 })
      }

      // Handle the HLS video requests
      const key = url.pathname.slice(1) // Strip out '/videos/' to get the key
      const object = await env.VIDEOS_BUCKET.get(key)

      if (!object) {
        return new Response("File not found", { status: 404 })
      }

      const contentType = key.endsWith(".m3u8")
        ? "application/vnd.apple.mpegurl"
        : key.endsWith(".ts")
        ? "video/mp2t"
        : "application/octet-stream"

      // Return the video segment or playlist file with appropriate headers
      return new Response(object.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "", // You can specify your frontend domain here
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400",
        }
      })
    } catch (err) {
      return new Response("Unauthorized: Invalid token", { status: 403 })
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

interface Env {
  JWT_SECRET: string
  VIDEOS_BUCKET: R2Bucket
}
