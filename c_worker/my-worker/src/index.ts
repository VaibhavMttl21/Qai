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

      const key = url.pathname.slice(1)
      const object = await env.VIDEOS_BUCKET.get(key)

      if (!object) {
        return new Response("File not found", { status: 404 })
      }

      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
          "Cache-Control": "public, max-age=3600"
        }
      })
    } catch (err) {
      return new Response("Unauthorized: Invalid token", { status: 403 })
    }
  }
}

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
