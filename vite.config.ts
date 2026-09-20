import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import nodemailer from 'nodemailer'

import siteConfiguration from './.figma/make/site.json'

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // .figma/make/deploy-preview passes `--mode development` for cached-preview builds.
  const emitSourcemaps = mode === 'development'
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
      figmaSiteConfiguration(siteConfiguration),
      figmaErrorOverlayReplay(),
      figmaReactRefreshBoundaryFallback(),
      figmaMakeKitPlugin({ storiesGlob: '/src/**/*.stories.{ts,tsx,js,jsx}' }),
      apiDevServerPlugin(env),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
      strictPort: true,
      watch: {
        ignored: [
          '**/.figma/**',
],
      },
    },
    preview: {
      host: process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(process.env.PORT || '8443'),
    },
  }
})

type FigmaSiteConfiguration = {
  title?: string
  description?: string
  language?: string
  robots?: {
    index?: boolean
  }
  icons?: {
    icon?: string
  }
  openGraph?: {
    image?: string
  }
  analytics?: {
    googleAnalyticsId?: string
  }
  customScripts?: {
    headStart?: string
    headEnd?: string
    bodyStart?: string
    bodyEnd?: string
  }
  accessibility?: {
    addBypassLinks?: boolean
  }
}

/** Applies /.figma/make/site.json to the generated document shell. */
function figmaSiteConfiguration(config: FigmaSiteConfiguration): Plugin {
  function sanitizeHtmlValue(value: string | undefined): string {
    return value?.replace(/[^a-zA-Z0-9_-]/g, '') || ''
  }
  function escapeHtmlText(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  function replaceHtmlCommentSlot(html: string, slotName: string, content: string): string {
    return html.replace(`<!-- ${slotName} -->`, content)
  }

  const title = config.title ?? "Pass No Jugaad"
  const description = config.description ?? "Ahmedabad's Navratri 2026 Event Discovery & Demand Aggregation Platform"
  const favicon = config.icons?.icon ?? '/logo.png'
  const socialImage = config.openGraph?.image ?? '/logo.png'
  const language = sanitizeHtmlValue(config.language) || 'en'
  const googleAnalyticsId = sanitizeHtmlValue(config.analytics?.googleAnalyticsId)
  const headStart = config.customScripts?.headStart ?? ''
  const headEnd = config.customScripts?.headEnd ?? ''
  const bodyStart = config.customScripts?.bodyStart ?? ''
  const bodyEnd = config.customScripts?.bodyEnd ?? ''
  const robotsTxt = config.robots?.index === false ? 'User-agent: *\nDisallow: /\n' : ''

  return {
    name: 'figma-site-configuration',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!robotsTxt || req.url?.split('?')[0] !== '/robots.txt') return next()

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsTxt)
      })
    },
    generateBundle() {
      if (!robotsTxt) return

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt,
      })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let result = html
        result = replaceHtmlCommentSlot(result, 'figma:lang', language)
        result = replaceHtmlCommentSlot(result, 'figma:title', escapeHtmlText(title))
        result = replaceHtmlCommentSlot(result, 'figma:head-start', headStart)
        result = replaceHtmlCommentSlot(result, 'figma:head-end', headEnd)
        result = replaceHtmlCommentSlot(result, 'figma:body-start', bodyStart)
        result = replaceHtmlCommentSlot(result, 'figma:body-end', bodyEnd)

        const tags: HtmlTagDescriptor[] = []
        if (description) {
          tags.push({ tag: 'meta', attrs: { name: 'description', content: description }, injectTo: 'head' })
        }
        if (config.robots?.index === false) {
          tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' })
        }
        if (favicon) {
          tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' })
        }
        if (title) {
          tags.push({ tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' })
        }
        if (description) {
          tags.push({ tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' })
        }
        if (socialImage) {
          tags.push(
            { tag: 'meta', attrs: { property: 'og:image', content: socialImage }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:image', content: socialImage }, injectTo: 'head' },
          )
        }

        if (googleAnalyticsId) {
          tags.push(
            {
              tag: 'script',
              attrs: {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
              },
              injectTo: 'head',
            },
            {
              tag: 'script',
              children: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(googleAnalyticsId)});
`,
              injectTo: 'head',
            },
          )
        }

        if (config.accessibility?.addBypassLinks) {
          tags.push(
            {
              tag: 'style',
              children: `
  .figma-bypass-link {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 2147483647;
    transform: translateY(-150%);
    border-radius: 6px;
    background: #111827;
    color: #fff;
    padding: 8px 12px;
    font: 600 14px/1.2 system-ui, sans-serif;
    text-decoration: none;
  }
  .figma-bypass-link:focus {
    transform: translateY(0);
  }
`,
              injectTo: 'head',
            },
            {
              tag: 'a',
              attrs: { class: 'figma-bypass-link', href: '#root' },
              children: 'Skip to content',
              injectTo: 'body-prepend',
            },
          )
        }

        return {
          html: result,
          tags,
        }
      },
    },
  }
}

/**
 * Replay the most recent build error to clients that connect after
 * it was first broadcast. Vite buffers an error payload only while
 * no clients are connected and clears the buffer on the first
 * reconnect (see `bufferedMessage` in `createWebSocketServer`), so
 * if the preview iframe reloads after Vite already delivered an
 * error to a live socket, the new socket misses the payload and
 * the overlay stays hidden even though the build is still broken.
 * We intercept `ws.send` to remember the latest error and replay
 * it on every new connection; the cache clears on a successful
 * `update` or `full-reload` so a stale overlay can't survive a
 * fixed build.
 */
function figmaErrorOverlayReplay(): Plugin {
  return {
    name: 'figma-error-overlay-replay',
    apply: 'serve',
    configureServer(server) {
      let lastError: object | null = null

      const origSend = server.ws.send.bind(server.ws) as (...args: any[]) => void
      server.ws.send = ((...args: any[]) => {
        const payload = args[0]
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          const type = (payload as { type?: string }).type
          if (type === 'error') {
            lastError = payload as object
          } else if (type === 'update' || type === 'full-reload') {
            lastError = null
          }
        }
        return origSend(...args)
      }) as typeof server.ws.send

      server.ws.on('connection', (socket) => {
        if (lastError !== null) {
          socket.send(JSON.stringify(lastError))
        }
      })
    },
  }
}

/**
 * Reload when a module that previously defined a React Refresh boundary stops
 * defining one. This happens when an agent moves a component into a new file
 * and replaces the old module with a re-export:
 *
 *   export { default } from './app/App'
 *
 * Vite otherwise accepts the update using the previous module's HMR boundary,
 * but the re-export-only transform no longer registers a replacement for the
 * mounted component family. React reports a successful refresh while leaving
 * the old tree mounted until the page is reloaded.
 */
function figmaReactRefreshBoundaryFallback(): Plugin {
  const hadRefreshBoundary = new Map<string, boolean>()
  let sendFullReload: (() => void) | null = null

  return {
    name: 'figma-react-refresh-boundary-fallback',
    apply: 'serve',
    enforce: 'post',
    configureServer(server) {
      sendFullReload = () => server.ws.send({ type: 'full-reload', path: '*' })
    },
    transform(code, id) {
      if (!/\.[jt]sx?(?:\?|$)/.test(id) || id.includes('/node_modules/')) return null

      const moduleId = id.split('?')[0] ?? id
      const hasRefreshBoundary = code.includes('registerExportsForReactRefresh')
      const previousHadRefreshBoundary = hadRefreshBoundary.get(moduleId)
      hadRefreshBoundary.set(moduleId, hasRefreshBoundary)

      if (previousHadRefreshBoundary && !hasRefreshBoundary) {
        queueMicrotask(() => sendFullReload?.())
      }

      return null
    },
  }
}

/**
 * Serves a blank render-target page at /.figma/make/kit.html that
 * the Figma preview script drives directly. The page exposes a
 * registry of every file matching `storiesGlob` on
 * window.__FIGMA__.stories so the design surface can dynamically
 * import + mount each entry into its own grid view.
 *
 * Dev-only: `apply: 'serve'` gates the plugin to `vite dev`. Prod
 * builds (`vite build`) skip it entirely so the route doesn't leak
 * into shipped bundles.
 */
function figmaMakeKitPlugin(options: { storiesGlob: string | string[] }): Plugin {
  const storiesGlob = Array.isArray(options.storiesGlob) ? options.storiesGlob : [options.storiesGlob]
  const ROUTE = '/.figma/make/kit.html'
  const VIRTUAL_ID = 'virtual:figma-stories'
  const RESOLVED_ID = '\0' + VIRTUAL_ID
  const STORIES_MODULE = `export const stories = import.meta.glob(${JSON.stringify(storiesGlob)})`
  const HTML_BOOTSTRAP = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div id="figma-make-kit-root"></div>
<script type="module">
  import { stories } from 'virtual:figma-stories'
  window.__FIGMA__ = Object.assign(window.__FIGMA__ ?? {}, { stories })
  window.dispatchEvent(new CustomEvent('figma.ready'))
</script>
</body>
</html>`

  return {
    name: 'figma-make-kit',
    apply: 'serve',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },
    load(id) {
      if (id !== RESOLVED_ID) return null
      return STORIES_MODULE
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (url.split('?')[0] !== ROUTE) return next()

        try {
          res.setHeader('Content-Type', 'text/html')
          res.end(await server.transformIndexHtml(url, HTML_BOOTSTRAP))
        } catch (err) {
          next(err as Error)
        }
      })
    },
  }
}

/**
 * Dev server plugin to handle /api/send-email locally
 */
function apiDevServerPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'api-dev-server-email-handler',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (url.split('?')[0] !== '/api/send-email' || req.method !== 'POST') {
          return next()
        }

        let bodyStr = ''
        req.on('data', chunk => {
          bodyStr += chunk
        })
        req.on('end', async () => {
          try {
            const { type, payload } = JSON.parse(bodyStr || '{}')
            const ADMIN_EMAIL = env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'passnojugaadd@gmail.com'
            const SMTP_USER = env.SMTP_USER || process.env.SMTP_USER || env.GMAIL_USER || process.env.GMAIL_USER || 'passnojugaadd@gmail.com'
            const SMTP_PASS = env.SMTP_PASS || process.env.SMTP_PASS || env.GMAIL_PASS || process.env.GMAIL_PASS || env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || ''
            const SMTP_HOST = env.SMTP_HOST || process.env.SMTP_HOST || 'smtp.gmail.com'
            const SMTP_PORT = parseInt(env.SMTP_PORT || process.env.SMTP_PORT || '465', 10)

            const emailsToSend: { to: string; subject: string; html: string }[] = []

            if (type === 'pass_request') {
              const { eventName, buyerName, buyerEmail, quantity, budgetMin, budgetMax, priorityNote } = payload || {}
              emailsToSend.push({
                to: ADMIN_EMAIL,
                subject: `🔥 New Pass Request: ${eventName} - ${buyerName} (${quantity} passes)`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px; border: 1px solid rgba(26,22,18,0.1);">
                    <div style="background: #7A1F2E; padding: 18px; border-radius: 8px; color: #FAF7F2; margin-bottom: 20px;">
                      <h2 style="margin: 0;">Pass No Jugaad — New Pass Request</h2>
                    </div>
                    <p style="font-size: 16px;"><strong>Event:</strong> ${eventName}</p>
                    <p><strong>Buyer:</strong> ${buyerName} (${buyerEmail})</p>
                    <p><strong>Quantity:</strong> ${quantity} passes</p>
                    <p><strong>Budget:</strong> ₹${budgetMin} – ₹${budgetMax}</p>
                    ${priorityNote ? `<p><strong>Note:</strong> ${priorityNote}</p>` : ''}
                    <p style="font-size: 12px; color: #888;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                  </div>
                `,
              })
              if (buyerEmail) {
                emailsToSend.push({
                  to: buyerEmail,
                  subject: `🎟️ Request Received for ${eventName} | Pass No Jugaad`,
                  html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
                      <h2 style="color: #7A1F2E;">Pass No Jugaad</h2>
                      <p>Hi ${buyerName || 'Garba Lover'}, we have received your request for <strong>${quantity} passes</strong> for <strong>${eventName}</strong>.</p>
                      <p>We are coordinating with verified organisers to find passes in your budget (₹${budgetMin}–₹${budgetMax}).</p>
                    </div>
                  `,
                })
              }
            } else if (type === 'jugaad_signal') {
              const { buyerName, buyerEmail, preferredDates, numPasses, budgetMin, budgetMax, readiness } = payload || {}
              emailsToSend.push({
                to: ADMIN_EMAIL,
                subject: `📡 New Radar Signal from ${buyerName} (${numPasses} passes, ${readiness})`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
                    <h2 style="color: #C1440E;">New Radar Signal Logged</h2>
                    <p><strong>Buyer:</strong> ${buyerName} (${buyerEmail})</p>
                    <p><strong>Dates:</strong> ${preferredDates?.join(', ') || 'Any'}</p>
                    <p><strong>Passes:</strong> ${numPasses}</p>
                    <p><strong>Budget:</strong> ₹${budgetMin} – ₹${budgetMax}</p>
                    <p><strong>Readiness:</strong> ${readiness}</p>
                  </div>
                `,
              })
            } else if (type === 'event_submission') {
              const { name, venue, date, priceMin, priceMax, contactEmail, instagramLink } = payload || {}
              emailsToSend.push({
                to: ADMIN_EMAIL,
                subject: `⏳ New Event Pending Review: ${name} @ ${venue}`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
                    <h2 style="color: #7A1F2E; margin-top: 0;">New Event Submitted for Approval</h2>
                    <p><strong>Event:</strong> ${name}</p>
                    <p><strong>Venue:</strong> ${venue || '—'}</p>
                    <p><strong>Date:</strong> ${date || '—'}</p>
                    <p><strong>Price:</strong> ₹${priceMin} – ₹${priceMax}</p>
                    <p><strong>Contact Email:</strong> ${contactEmail || '—'}</p>
                    <p><strong>Instagram:</strong> ${instagramLink || '—'}</p>
                  </div>
                `,
              })
            } else if (type === 'event_approved') {
              const { eventName, organiserEmail, date, venue } = payload || {}
              if (organiserEmail) {
                emailsToSend.push({
                  to: organiserEmail,
                  subject: `🎉 Your Event is Approved & Live on Pass No Jugaad: ${eventName}`,
                  html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
                      <h2 style="color: #2D7A4F; margin-top: 0;">Event Approved & Live!</h2>
                      <p>Hi, your event <strong>${eventName}</strong> has been approved and is now live on Pass No Jugaad.</p>
                      <p>${date ? `Date: ${date}` : ''} ${venue ? `| Venue: ${venue}` : ''}</p>
                    </div>
                  `,
                })
              }
            } else if (type === 'event_rejected') {
              const { eventName, organiserEmail, reason } = payload || {}
              if (organiserEmail) {
                emailsToSend.push({
                  to: organiserEmail,
                  subject: `Update regarding your event listing: ${eventName}`,
                  html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
                      <h2 style="color: #7A1F2E; margin-top: 0;">Event Listing Update</h2>
                      <p>Your event <strong>${eventName}</strong> could not be approved at this time.</p>
                      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                    </div>
                  `,
                })
              }
            } else if (type === 'user_signup') {
              const { name, email } = payload || {}
              emailsToSend.push({
                to: ADMIN_EMAIL,
                subject: `👤 New User Signup: ${name || 'New User'} (${email})`,
                html: `<p>New User: ${name} (${email})</p>`,
              })
            }

            if (SMTP_PASS) {
              const transporter = nodemailer.createTransport(
                SMTP_HOST === 'smtp.gmail.com'
                  ? {
                      service: 'gmail',
                      auth: {
                        user: SMTP_USER,
                        pass: SMTP_PASS.replace(/\s+/g, ''),
                      },
                    }
                  : {
                      host: SMTP_HOST,
                      port: SMTP_PORT,
                      secure: SMTP_PORT === 465,
                      auth: {
                        user: SMTP_USER,
                        pass: SMTP_PASS,
                      },
                    }
              )

              for (const email of emailsToSend) {
                await transporter.sendMail({
                  from: `"Pass No Jugaad" <${SMTP_USER}>`,
                  to: email.to,
                  subject: email.subject,
                  html: email.html,
                })
              }
              console.log(`\x1b[32m[Email Notification Sent]\x1b[0m Successfully sent ${emailsToSend.length} email(s) via ${SMTP_USER}`)
            } else {
              console.warn(
                `\x1b[33m[Email Notification Not Dispatched]\x1b[0m\n` +
                  `Reason: SMTP_PASS is not set in .env.\n` +
                  `Recipient: ${emailsToSend.map(e => e.to).join(', ')}\n` +
                  `Subject: ${emailsToSend.map(e => e.subject).join(' | ')}\n` +
                  `👉 To send real emails from passnojugaadd@gmail.com, generate a Google App Password and add SMTP_PASS to your .env file.`
              )
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, count: emailsToSend.length }))
          } catch (err: any) {
            console.error('[Email Handler Error]:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Server error' }))
          }
        })
      })
    },
  }
}

