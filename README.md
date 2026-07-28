# Mantri Traders — E-commerce & Portfolio Platform

**Live site:** [mantritraders.netlify.app](https://mantritraders.netlify.app) · **API:** [mantri-traders-client.onrender.com](https://mantri-traders-client.onrender.com/api/health)

> The API runs on Render's free tier and spins down when idle, so the first request after a quiet period takes around 50 seconds. Subsequent requests are fast.

A full-stack e-commerce and portfolio web application built for Mantri Traders, a local tile supplier. The platform showcases the supplier's product catalog and lets customers browse inventory and submit enquiries, with a secure admin panel that allows the owner to manage products without any developer involvement. Delivered to the client, earning a formal Letter of Recommendation.

## Features

- **Product catalog** with a browsable gallery of tiles and product details
- **Customer enquiry system** for prospective buyers to reach out directly
- **Secure admin panel** with full CRUD, so the owner can add, edit, and remove products independently
- **Portfolio/showcase pages** presenting the supplier's offerings

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT with bcrypt-hashed passwords

## Repository Layout

```
mantri-traders-client/
├── client/     React + Vite frontend  → deployed to Netlify
└── server/     Express + MongoDB API  → deployed to Render
```

The two halves deploy separately. See `server/README.md` for full API endpoint documentation.

## Local Development

Run both halves in separate terminals.

**Backend**

```bash
cd server
npm install
cp config.env.example config.env    # then fill in real values
npm run dev                         # http://localhost:5000
```

**Frontend**

```bash
cd client
npm install
cp .env.example .env.local          # point VITE_API_URL at your local API
npm run dev                         # http://localhost:5173
```

Create the initial admin user once the backend is running:

```bash
curl -X POST http://localhost:5000/api/auth/setup
```

## Deployment

**Frontend — Netlify**

| Setting | Value |
| --- | --- |
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Set `VITE_API_URL` under Site settings → Environment variables. `client/netlify.toml` supplies the SPA redirect; without it, refreshing on `/products` returns a 404.

**Backend — Render**

| Setting | Value |
| --- | --- |
| Root directory | `server` |
| Build command | `npm install` |
| Start command | `npm start` |

Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_URL` in the Render dashboard. If using MongoDB Atlas, allowlist `0.0.0.0/0` under Network Access, or every database call will hang while `/api/health` still reports OK.

## Known Limitations

- **Uploaded images are not persistent.** `server/middleware/upload.js` writes to local disk, and Render's filesystem is ephemeral — images uploaded via the admin panel are lost on every deploy and cold start. Migrating to Cloudinary or S3 is the outstanding fix.
- **Free-tier cold starts.** The API sleeps when idle; the first request after a quiet period can take ~50 seconds.
