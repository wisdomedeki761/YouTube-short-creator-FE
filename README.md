# Video Editor Frontend

A modern, responsive Next.js frontend for the Video Editor API with email/password and Google OAuth authentication.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth
- 📹 **Video Management**: Upload, view, and manage videos
- 🎨 **Modern UI**: Built with Tailwind CSS and responsive design
- 📊 **Admin Dashboard**: User management, statistics, and filler video management
- 🔑 **API Keys**: Manage YouTube and Facebook API keys
- ⚡ **Fast**: Optimized with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_APP_NAME=Video Editor
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   └── (admin)/           # Admin pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── common/           # Common/reusable components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components
│   └── ui/               # UI primitives
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- Email/password login and registration
- Google OAuth integration
- Password reset functionality
- Protected routes

### Dashboard
- Video upload with drag & drop
- Video list with filtering and search
- Video details and processing status
- Recent videos overview

### User Settings
- Profile management
- API keys management (YouTube, Facebook)
- Account settings and preferences

### Admin Dashboard
- User management and approval
- Filler video management
- Statistics and analytics
- System overview

## Environment Variables

See `.env.local` for required environment variables.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Self-Hosted

Build the application:
```bash
npm run build
npm start
```

## License

MIT

