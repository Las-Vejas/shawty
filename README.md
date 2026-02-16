# Shawty - HackClub URL Shortener

Short links for Hack Club members, built with SvelteKit and Supabase.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values (Supabase credentials are already filled).

Update the following in `.env`:
- `HACKCLUB_CLIENT_ID` - Your HackClub OAuth client ID
- `HACKCLUB_CLIENT_SECRET` - Your HackClub OAuth client secret
- `SESSION_SECRET` - A random string (at least 32 characters)

### 3. Get HackClub OAuth Credentials

1. Go to https://api.slack.com/apps
2. Create a new app (or use existing) for the HackClub Slack workspace (Team ID: `T0266FRGM`)
3. Under **"OAuth & Permissions"** → **"Redirect URLs"**, add:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
4. Under **"OAuth & Permissions"** → **"Scopes"** → **"User Token Scopes"**, add:
   - `openid`
   - `profile`
   - `email`
5. Copy **Client ID** and **Client Secret** to your `.env` file

**🔑 Your OAuth Redirect URL**: 
- Dev: `http://localhost:5173/auth/callback`
- Prod: `https://yourdomain.com/auth/callback`

### 4. Create Database Tables

Run this SQL in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slack_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code TEXT UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_short_code ON links(short_code);
CREATE INDEX idx_users_slack_id ON users(slack_id);
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` 🚀

## Features

- HackClub Slack OAuth authentication
- Github OAuth authentication
- Create and manage short links
- Track click counts and other analytics
- Built with SvelteKit, shadcn-svelte, tailwindcss and Supabase

## How It Works

1. Users authenticate with HackClub Auth or Github OAuth
2. Create short links in the dashboard
3. Share links like `shawty.app/abc123`
4. Automatic click tracking

## Deployment
Shawty is deployed on Vercel.
