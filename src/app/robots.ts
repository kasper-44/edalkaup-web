import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

const SHARED = { allow: '/', disallow: ['/api/'] }

/** Named groups repeat the * rules. A specific group does not inherit *. */
const ROBOT_AGENTS = ['*', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Applebot', 'ClaudeBot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ROBOT_AGENTS.map((userAgent) => ({ userAgent, ...SHARED })),
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  }
}
