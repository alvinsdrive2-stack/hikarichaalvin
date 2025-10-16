# 🚀 Railway.app Quick Deploy (5 Minutes)

## ⚡ Quick Steps

### 1. Sign up & Connect GitHub (1 min)
1. Buka [Railway.app](https://railway.app)
2. Sign up dengan **GitHub**
3. **New Project** → **GitHub** → Select repo `HikariChaWeb`

### 2. Add MySQL Service (1 min)
1. Dashboard → **New Service**
2. Pilih **MySQL**
3. Plan: **Hobby ($5/bulan)**

### 3. Import Database (2 min)
1. Pilih **MySQL service**
2. **Data** tab → **Import**
3. Upload `planetscale_import.sql`
4. Click **Import**

### 4. Setup Environment (1 min)
Add ke **web service** → **Variables**:
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-project.up.railway.app
NEXTAUTH_SECRET=generate-with-npx-auth-secret
DATABASE_URL=${{MYSQLUSER}}:${{MYSQLPASSWORD}}@${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=create-new-keys
RECAPTCHA_SECRET_KEY=create-new-keys
```

### 5. Deploy! (30 seconds)
1. Dashboard → **Builds**
2. Click **Redeploy**
3. Wait sampai selesai

---

## 🔗 Production URL

Setelah deploy selesai: **https://your-project-name.up.railway.app**

---

## 💰 Cost

- **Web Service:** $5/bulan (Developer plan)
- **MySQL:** $5/bulan (Hobby plan)
- **Total:** $10/bulan

---

## ✅ Test Production

```bash
# Test API
curl https://your-project.up.railway.app/api/statistics

# Manual test
# 1. Open production URL
# 2. Register new user
# 3. Test login
# 4. Test achievements
```

---

## 🎯 Railway vs Vercel+PlanetScale

| Feature | Railway | Vercel+PlanetScale |
|---------|---------|-------------------|
| **Setup** | ⭐⭐⭐⭐⭐ (5 min) | ⭐⭐⭐ (15 min) |
| **Cost** | 💰 $10/bulan | 💰 $0/bulan (FREE) |
| **Easy** | ⭐⭐⭐⭐⭐ (Easiest) | ⭐⭐⭐ (Medium) |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (Best) |

**Recommendation:**
- **For quick launch:** Railway (5 menit setup)
- **For free:** Vercel + PlanetScale (but 15 menit setup)

---

**🚀 Railway siap! Ikuti lengkap di DEPLOY_TO_RAILWAY.md**