# Fix CORS on Render (NestJS)

Use this guide when your frontend (Vercel/local) cannot call the backend hosted on Render.

## 1) Set CORS in `src/main.ts`

Put this inside `bootstrap()` (only once):

```ts
app.enableCors({
  origin: [
    'http://localhost:3004',
    'http://127.0.0.1:3004',
    'https://cursor-greenpro-admin-mern-cyan.vercel.app',
  ],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
  optionsSuccessStatus: 204,
  preflightContinue: false,
});
```

Important:
- Do **not** keep any extra custom `app.use(...)` middleware that manually sets `Access-Control-*` headers.
- Keep only one CORS configuration source.

## 2) Rebuild and redeploy on Render

Make sure Render uses a build command like:

```bash
npm install && npm run build
```

And start command like:

```bash
npm run start:prod
```

(`start:prod` should run `node dist/main.js`; `prestart:prod` should run `npm run build`.)

## 3) Verify frontend API base URL

On Vercel frontend, confirm API URL points to your Render backend domain, for example:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

If this points to localhost in production, browser will fail.

## 4) Test preflight from browser

In DevTools Network tab, open a failing request and check:

- Request `Origin` is one of allowed origins
- Response includes:
  - `Access-Control-Allow-Origin: <your-origin>`
  - `Access-Control-Allow-Methods`
  - `Access-Control-Allow-Headers`
- OPTIONS request returns **204** (or 200)

## 5) Common causes if still failing

- Frontend domain mismatch (wrong Vercel URL/subdomain)
- Backend not redeployed after CORS change
- Multiple backend instances with old code
- Proxy/CDN layer stripping CORS headers
- Sending cookies with `credentials: include` while backend has `credentials: false`

## 6) If you need multiple frontend domains

Add all exact domains to the `origin` array (including preview domains if used).

---

If issue still persists, share one failed request details from Network tab:
- Request URL
- Request Origin
- Response headers
- Status code for `OPTIONS` and actual request

With those 4 details, the exact CORS blocker can be pinpointed quickly.
