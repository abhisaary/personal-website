import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  return {
    plugins: [
      {
        name: 'absolute-og-urls',
        transformIndexHtml(html) {
          if (!siteUrl) return html
          return html
            .replace(
              /property="og:image" content="\/og\.png"/g,
              `property="og:image" content="${siteUrl}/og.png"`,
            )
            .replace(
              /name="twitter:image" content="\/og\.png"/g,
              `name="twitter:image" content="${siteUrl}/og.png"`,
            )
        },
      },
    ],
  }
})
