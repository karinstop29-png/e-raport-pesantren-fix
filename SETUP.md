# Setup Environment Variables

## Langkah-langkah Setup Environment

### 1. Copy File Environment
\`\`\`bash
cp .env.example .env.local
\`\`\`

### 2. Konfigurasi Database
- Buat database PostgreSQL baru
- Update `DATABASE_URL` dengan connection string database Anda

### 3. Konfigurasi Supabase
1. Buat project baru di [Supabase](https://supabase.com)
2. Buka Project Settings > API
3. Copy `Project URL` ke `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `anon/public key` ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Jalankan Database Migration
\`\`\`bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database (optional)
npx prisma db seed
\`\`\`

### 5. Jalankan Aplikasi
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables yang Diperlukan

| Variable | Deskripsi | Contoh |
|----------|-----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Redirect URL untuk development | `http://localhost:3000/auth/callback` |
