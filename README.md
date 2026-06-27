# Meta Glasses Dashboard

A Next.js application for managing and connecting Meta glasses videos with social authentication.

## Features

- Social authentication (Google & Facebook)
- Dashboard with sidebar navigation
- Meta glasses connection interface
- Video gallery view
- Black and white minimalist theme
- TypeScript & Tailwind CSS
- NextAuth.js v5 for authentication

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

### 3. Set up OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing
3. Add Facebook Login product
4. In Settings → Basic, copy App ID and App Secret
5. Add Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`
6. Add credentials to `.env.local`

### 4. Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

Add the output to `.env.local` as `AUTH_SECRET`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API route
│   ├── dashboard/               # Dashboard pages
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   └── page.tsx            # Main dashboard page
│   ├── login/                  # Login page
│   └── page.tsx                # Home page (redirects)
├── components/
│   ├── Sidebar.tsx             # Sidebar navigation
│   ├── Providers.tsx           # SessionProvider wrapper
│   └── VideoCard.tsx           # Video card component for gallery
└── auth.ts                     # NextAuth configuration
```

## Next Steps

- Implement backend API for Meta glasses connection
- Add video upload and storage functionality
- Populate video gallery with real data
- Add video playback features
- Add user settings page
- Implement real-time connection status

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- NextAuth.js v5
- React Icons
