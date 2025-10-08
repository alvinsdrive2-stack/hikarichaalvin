# 🚨 Manual Border Database Setup Guide

## ⚠️ WARNING: This will RESET ALL DATA in your development database!

### Step 1: Reset Database (Manual)
Run this command in your terminal **MANUALLY**:

```bash
cd "C:\Users\Alvia\OneDrive - Bina Nusantara\Documents\BINUS\Project Hikaricha\gitgitgut\HikariChaWeb"

# First, set the consent environment variable
$env:PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION = "I understand and want to reset my development database"

# Now run the reset command
npx prisma db push --force-reset
```

### Step 2: Initialize Border Data
```bash
node scripts/init-borders-direct.js
```

### Step 3: Create Admin User
```bash
node scripts/create-admin-user.js
```

### Step 4: Verify Setup
```bash
# Check borders in database
npx prisma studio

# Or run this to see border data:
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.border.findMany().then(borders => {
  console.log('Borders in database:');
  borders.forEach(b => console.log(\`- \${b.name} (\${b.id}) - \${b.rarity}\`));
  prisma.\$disconnect();
});
"
```

## 🎯 Expected Result

After setup, you should have:

1. **6 Default Borders**:
   - Default (Common, Free)
   - Bronze (Common, Free - Achievement)
   - Silver (Rare, Free - Achievement)
   - Gold (Epic, 500 points)
   - Crystal (Epic, 1000 points)
   - Diamond (Legendary, 2000 points)

2. **Admin User**:
   - Email: admin@hikaricha.com
   - Role: ADMIN
   - Points: 999999
   - All borders unlocked

3. **Database Tables**:
   - ✅ Border table populated
   - ✅ BorderUnlock table populated for admin
   - ✅ User table has admin user

## 🔧 Troubleshooting

**If MySQL connection fails:**
- Make sure MySQL service is running
- Check DATABASE_URL in .env file
- Ensure database `hikaricha_db` exists

**If borders don't show up:**
- Check the API: `GET http://localhost:3000/api/borders`
- Check browser console for errors
- Verify border images exist in `public/borders/`

**If admin user can't access features:**
- Login with admin@hikaricha.com
- Check user role in database
- Restart development server

## 📝 Next Steps After Setup

1. **Test Border Selection**:
   - Go to profile page
   - Try selecting different borders
   - Check if selection persists

2. **Test Border Purchase**:
   - Create regular user account
   - Try purchasing paid borders
   - Check point deduction

3. **Add Custom Borders**:
   - Add new SVG files to `public/borders/`
   - Insert into database manually or via API
   - Test with different rarities and prices

4. **Customize Border Display**:
   - Modify CSS in `components/ui/border-preview.tsx`
   - Adjust sizes and colors
   - Add animations or effects