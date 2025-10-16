# 🚀 Quick Deploy Checklist - Vercel + PlanetScale

## ✅ Files Ready
- [x] `planetscale_import.sql` - Database export (135KB, 38 tables)
- [x] `DEPLOY_TO_VERCEL_PLANETSCALE.md` - Complete guide
- [x] `.env.production.example` - Environment template
- [x] Clean commit history (no AI attribution)

---

## ⚡ Quick Deploy Commands

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login ke Vercel
vercel login

# 3. Test build lokal
npm run build

# 4. Deploy ke Vercel
vercel

# 5. Setup environment variables di Vercel Dashboard
# DATABASE_URL (dari PlanetScale)
# NEXTAUTH_URL (https://hikaricha-web.vercel.app)
# NEXTAUTH_SECRET (npx auth secret)

# 6. Production deploy
vercel --prod
```

---

## 🗄️ PlanetScale Setup (5 minutes)

### 1. Sign up & Create Database
1. Go to [Planetscale.com](https://planetscale.com)
2. Sign up → Create database: `hikaricha-web`
3. Region: Singapore
4. Import: Upload `planetscale_import.sql`

### 2. Get Connection String
1. Dashboard → Connect → @vercel/deployment
2. Copy `DATABASE_URL`

### 3. Add ke Vercel Environment
Vercel Dashboard → Settings → Environment Variables
- Name: `DATABASE_URL`
- Value: PlanetScale connection string

---

## 🔑 Required Environment Variables

```env
DATABASE_URL="mysql://user:pass@aws.connect.psdb.cloud/hikaricha-web?ssl={...}"
NEXTAUTH_URL="https://hikaricha-web.vercel.app"
NEXTAUTH_SECRET="generate-with-npx-auth-secret"
```

---

## 🧪 Test Production

```bash
# Test API
curl https://hikaricha-web.vercel.app/api/statistics

# Test website
# 1. Open https://hikaricha-web.vercel.app
# 2. Register new user
# 3. Test login
# 4. Test achievements
```

---

## 💰 Total Cost

- **Vercel Hobby:** FREE
- **PlanetScale Hobby:** FREE
- **Total:** $0/month 🎉

---

## ⏱️ Estimated Time

- PlanetScale setup: 5 minutes
- Vercel deploy: 3 minutes
- Environment setup: 2 minutes
- Testing: 5 minutes
- **Total: 15 minutes**

---

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **PlanetScale Dashboard:** https://app.planetscale.com
- **Production URL:** https://hikaricha-web.vercel.app

---

## ✨ Success Criteria

- [x] Database exported cleanly
- [x] All features tested locally
- [x] Clean git history
- [x] Production ready code
- [x] FREE hosting setup
- [x] SSL certificates included

---

**🚀 Ready to deploy! Follow the steps in DEPLOY_TO_VERCEL_PLANETSCALE.md**