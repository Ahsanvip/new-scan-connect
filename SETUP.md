# Quick Setup Guide

## 🚀 Getting Started

Since you don't have a Neon database yet, here are your setup options:

### Option 1: Full Setup with Database (Recommended for Production)

1. **Create a Neon Database:**
   - Go to [neon.tech](https://neon.tech) and sign up (free tier available)
   - Create a new project
   - Copy the connection string

2. **Update `.env.local`:**
   ```bash
   DATABASE_URL=your_neon_connection_string_here
   ENCRYPTION_KEY=any_32_character_string_here_1234
   ```

3. **Initialize the database:**
   ```bash
   # Use Neon web console SQL Editor and paste the contents of lib/schema.sql
   # OR use psql:
   psql your_connection_string -f lib/schema.sql
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

### Option 2: Quick Demo (No Database)

For a quick visual demo without setting up a database:

1. Comment out database calls temporarily
2. Run `npm run dev`
3. View the UI at http://localhost:3000

The landing page, forms, and UI will work, but activation/notification won't function without the database.

### Option 3: Use SQLite Locally (Quick Alternative)

If you want to test locally without Neon:

1. Install `better-sqlite3`:
   ```bash
   npm install better-sqlite3
   ```

2. Modify `lib/db.ts` to use SQLite instead of Neon
3. Run the schema against a local SQLite file

---

## 📝 Next Steps

1. Set up your database (Option 1 above)
2. Run `npm run dev`  
3. Visit http://localhost:3000
4. Test with code `TEST123` at http://localhost:3000/qr/TEST123

---

## 🎨 What You Can See Right Now

Even without database setup, you can view:
- ✅ Beautiful landing page at http://localhost:3000
- ✅ Activation form UI at http://localhost:3000/activate?code=DEMO
- ✅ Scanner flow UI at http://localhost:3000/scan/DEMO

---

## 🐛 Need Help?

Check the main README.md for detailed troubleshooting, architecture docs, and deployment guides.
