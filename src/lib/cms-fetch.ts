/**
 * Fetch wrapper that adds Cloudflare Access service token headers
 * for Vercel → CMS calls (CMS is behind Cloudflare Access).
 */
export function cmsFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)

  const cfId = process.env.CF_ACCESS_CLIENT_ID
  const cfSecret = process.env.CF_ACCESS_CLIENT_SECRET
  if (cfId && cfSecret) {
    headers.set('CF-Access-Client-Id', cfId)
    headers.set('CF-Access-Client-Secret', cfSecret)
  }

  return fetch(url, { ...init, headers })
}
