# Fit Friends - Fitness Challenge App

A team-based fitness challenge tracker designed for 28-day competitions. Two teams compete to accumulate the most exercise points over the month.

## Features

- **Team Challenges**: Create or join 28-day fitness challenges with friends
- **Activity Logging**: Track 13 different exercise types with automatic point calculation
- **Real-time Leaderboard**: Watch team scores update live
- **Mobile-First Design**: Optimized for mobile with modern, clean UI
- **Proof Upload**: Attach screenshots or Strava links to activities
- **Dispute System**: Referee mode for managing disputes and removing invalid entries

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jtcronje1/fit-friends-app.git
cd fit-friends-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up the database:
   - Go to your Supabase project SQL Editor
   - Run the SQL from `supabase-schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy!

## Exercise Scoring System

| Exercise | Unit | Points Per | Unit Amount |
|----------|------|------------|-------------|
| Running/Jogging | km | 10 | 1 |
| Trail Running | km | 10 | 0.8 |
| Brisk Walking | km | 10 | 2 |
| Cycling | km | 10 | 3.6 |
| Swimming | m | 10 | 250 |
| Rowing | m | 10 | 850 |
| Golf | holes | 20 | 9 |
| Stair Climbing (Time) | mins | 10 | 5 |
| Stair Climbing (Flights) | flights | 10 | 25 |
| Gym (High Intensity) | mins | 10 | 10 |
| Gym (Medium Intensity) | mins | 10 | 20 |
| Gym (Low Intensity) | mins | 10 | 30 |
| Tennis/Squash/Padel | mins | 10 | 20 |

**Formula**: `Points = floor((measurement ÷ unitAmount) × pointsPer)`

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── activity-feed.tsx
│   ├── challenge-stats.tsx
│   ├── daily-quote.tsx
│   ├── log-activity.tsx
│   └── team-scores.tsx
├── lib/                   # Utility functions
│   ├── exercises.ts      # Exercise definitions
│   └── supabase.ts       # Supabase client
├── types/                 # TypeScript types
│   ├── index.ts
│   └── database.ts
├── supabase-schema.sql    # Database schema
└── next.config.ts         # Next.js config
```

## Roadmap

### MVP (Current)
- [x] User authentication (email/password)
- [x] Create challenges with 2 teams
- [x] Log activities with 13 exercise types
- [x] Real-time leaderboard
- [x] Activity feed with dispute system
- [x] Basic statistics

### Future Features
- [ ] Social login (Google, Apple)
- [ ] Push notifications
- [ ] Activity photo uploads
- [ ] Premium tier with custom exercises
- [ ] Longer/shorter challenge durations
- [ ] Team chat
- [ ] Achievement badges
- [ ] Integration with fitness apps (Strava, Apple Health)

## License

MIT License - feel free to use this for your own projects!

## Support

Built with ❤️ for friends who want to get fit together.
