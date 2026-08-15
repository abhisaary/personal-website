import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public')
const outFile = path.join(outDir, 'Abhisaar-Yadav.pdf')
const chrome =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  throw new Error(`Preview server did not become ready: ${url}`)
}

function runChrome(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(chrome, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Chrome exited with code ${code}`))
    })
  })
}

const server = await preview({
  root,
  preview: {
    host: '127.0.0.1',
    port: 4179,
    strictPort: false,
  },
})

const baseUrl = server.resolvedUrls?.local?.[0] || 'http://127.0.0.1:4179/'
const pageUrl = new URL('/', baseUrl).href

try {
  await waitForServer(pageUrl)
  await mkdir(outDir, { recursive: true })
  await runChrome([
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outFile}`,
    '--print-to-pdf-no-header',
    pageUrl,
  ])
  console.log(`Wrote ${outFile}`)
} finally {
  await server.close()
}
