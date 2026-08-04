import { NextResponse } from 'next/server'

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Under Maintenance</title>
  <style>
    body {font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f5f5;}
    .card{padding:32px;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.08);text-align:center;}
    h1{margin:0 0 8px;font-size:24px;}
    p{margin:0;color:#666;}
  </style>
</head>
<body>
  <div class="card">
    <h1>Under Maintenance</h1>
    <p>We're performing scheduled maintenance. Please check back soon.</p>
  </div>
</body>
</html>`

export function GET() {
  return new NextResponse(html, {
    status: 503,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}
