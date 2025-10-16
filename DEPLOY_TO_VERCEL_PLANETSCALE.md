# 🚀 Deploy ke Vercel + PlanetScale (Clean Version)

## 📋 Checklist Sebelum Deploy

- ✅ Database exported: `planetscale_import.sql`
- ✅ Project ready untuk deployment
- ✅ Environment variables prepared
- ✅ Clean commit history (no AI attribution)

---

## 🗄️ Step 1: Setup PlanetScale

### 1. Sign up PlanetScale
1. Buka [Planetscale.com](https://planetscale.com)
2. Sign up dengan GitHub/Google
3. Create new organization: "hikaricha-web"

### 2. Create Database
1. Dashboard → **Create database**
2. Database name: `hikaricha-web`
3. Region: **AWS Singapore** (terdekat)
4. Plan: **Hobby (FREE)**
5. Click **Create database**

### 3. Import Database
1. Database dashboard → **Import**
2. Upload file: `planetscale_import.sql`
3. Click **Import**
4. Wait sampai selesai (±2-3 menit)

### 4. Get Connection String
1. Dashboard → **Connect**
2. Select **@vercel/deployment**
3. Copy **DATABASE_URL**:
   ```
   mysql://xxxxx:xxxxx@aws.connect.psdb.cloud/hikaricha-web?ssl={"rejectUnauthorized":true}
   ```

---

## ⚙️ Step 2: Setup Environment Variables

### Create .env.production
```bash
# Copy template
cp .env.example .env.production
```

### Edit .env.production
```env
# Database (PlanetScale)
DATABASE_URL="mysql://xxxxx:xxxxx@aws.connect.psdb.cloud/hikaricha-web?ssl={"rejectUnauthorized":true}"

# NextAuth
NEXTAUTH_URL="https://hikaricha-web.vercel.app"
NEXTAUTH_SECRET="run: npx auth secret"

# Supabase (optional backup)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="buat-baru"
RECAPTCHA_SECRET_KEY="buat-baru"
```

---

## 📦 Step 3: Prepare Code for Production

### 1. Test Build
```bash
cd "C:\Project\gitgitgut\HikariChaWeb"
npm run build
```

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Generate NextAuth Secret
```bash
npx auth secret
# Copy hasilnya ke .env.production
```

---

## 🚀 Step 4: Deploy ke Vercel

### 1. Login Vercel
```bash
vercel login
# Buka browser, authorize dengan GitHub
```

### 2. Deploy Project
```bash
vercel
```

**Follow prompts:**
- ✅ Set up and deploy? **Y**
- ✅ Scope? (pilih akun kamu)
- ✅ Link to existing project? **N**
- ✅ Project name? **hikaricha-web**
- ✅ Directory? **./**
- ✅ Override settings? **Y**

### 3. Setup Environment Variables di Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **hikaricha-web**
3. **Settings → Environment Variables**
4. Add semua variables dari `.env.production`

| Name | Value |
|------|-------|
| `DATABASE_URL` | PlanetScale connection string |
| `NEXTAUTH_URL` | `https://hikaricha-web.vercel.app` |
| `NEXTAUTH_SECRET` | Generated secret |
| `NEXT_PUBLIC_SUPABASE_URL` | (optional) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (optional) |
| `SUPABASE_SERVICE_ROLE_KEY` | (optional) |

### 4. Production Deploy
```bash
vercel --prod
```

---

## ✅ Step 5: Test Deployment

### 1. Basic Tests
```bash
# Test API endpoints
curl https://hikaricha-web.vercel.app/api/auth/session
curl https://hikaricha-web.vercel.app/api/statistics
```

### 2. Manual Tests
1. Buka **https://hikaricha-web.vercel.app**
2. Test **Register** new user
3. Test **Login**
4. Test **Achievement system**
5. Test **Social features**

### 3. Check Logs
1. Vercel Dashboard → **Logs**
2. Cek untuk error messages
3. PlanetScale Dashboard → **Query logs**

---

## 🔧 Troubleshooting

### Database Connection Error
```env
# Tambah SSL mode
DATABASE_URL="mysql://...&sslmode=require"
```

### Build Error
```bash
# Clear cache
rm -rf .next
npm run build
```

### NextAuth Error
```env
# Pastikan NEXTAUTH_URL benar
NEXTAUTH_URL="https://hikaricha-web.vercel.app"
```

### CORS Error
Update `lib/auth.ts`:
```typescript
export const authOptions: NextAuthOptions = {
  // ... existing config
  useSecureCookies: process.env.NODE_ENV === 'production',
}
```

---

## 📊 Deployment Summary

**URL Production:** https://hikaricha-web.vercel.app
**Database:** PlanetScale (FREE - 5GB)
**Cost:** $0/month (FREE tier)
**Features:** ✅ All features working
**SSL:** ✅ Enabled by default
**Backup:** ✅ Auto backup by PlanetScale

---

## 🎉 Success!

Setelah deploy selesai:
1. ✅ **Website live** di Vercel
2. ✅ **Database production** di PlanetScale
3. ✅ **All features working**
4. ✅ **Free hosting**
5. ✅ **Clean repository** (no AI attribution)

**Share URL:** https://hikaricha-web.vercel.app

---

## 🔄 Maintenance

- **Weekly:** Check Vercel analytics
- **Monthly:** Check PlanetScale usage
- **Updates:** Deploy dengan `vercel --prod`

**Selamat! Website kamu sudah live!** 🚀