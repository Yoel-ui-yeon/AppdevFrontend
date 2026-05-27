# Mobile app ↔ Railway backend sync

The **Cloudrobe** mobile app runs on your PC/emulator but talks to the **deployed** Cloudrobe API on Railway. Admin/staff use the **web dashboard** on the same Railway app and database.

## One-time setup

1. Railway → **finals-webdev** → **Settings** → **Networking** → copy your public URL  
   Example: `https://finals-webdev-production.up.railway.app`

2. In the frontend app:

```powershell
cd AppdevFrontend\src\config
copy api.config.local.example.js api.config.local.js
```

3. Edit `api.config.local.js`:

```js
module.exports = {
  RAILWAY_API_BASE: 'https://YOUR-REAL-DOMAIN.up.railway.app/api',
  USE_RAILWAY_BACKEND: true,
  AUTO_REFRESH_MS: 15000,
};
```

4. Restart Metro and rebuild the app:

```powershell
cd AppdevFrontend
npm start
# new terminal:
npm run android
```

## How sync works

| Action | What happens |
|--------|----------------|
| Staff updates order status on dashboard | Same MySQL on Railway; mobile **My Orders** refetches every 15s and on tab focus |
| Staff edits products / inventory | Mobile **Home** / **Collections** refetch automatically |
| Customer places order in app | Written to Railway DB; staff see it when they open **Orders** in admin |
| Customer submits custom request | Staff see it in **Custom Requests**; customer sees status updates in app |

No separate “sync service” is required — **one database + REST API**.

Pull down on a screen to refresh immediately.

## Switch back to local Symfony

In `api.config.local.js` set `USE_RAILWAY_BACKEND: false` and run:

```powershell
cd AppdevBackend
php -S 127.0.0.1:8000 -t public
```

Android emulator with local API: use `http://10.0.2.2:8000/api` in `api.js` LOCAL_API.

## Troubleshooting

- **Cannot connect to backend** — wrong `RAILWAY_API_BASE`, or Railway app is down
- **Login works locally but not on Railway** — use accounts from the migrated DB (`customer@cloudrobe.com`, etc.)
- **Images broken** — product images use Railway URLs from the API; ensure deploy includes `public/uploads/`
