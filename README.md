# Manhattan Madness 2.0

A mobile-first web application for running automated, real-time scavenger hunt games across Manhattan. Teams compete to claim locations, complete challenges, and climb the leaderboard in this location-based adventure game.

## About

Manhattan Madness 2.0 is a digital reimplementation of the classic Manhattan scavenger hunt game, designed to automate scoring, track team progress in real-time, and provide a seamless mobile experience for players navigating the city.

**Original Game Credit:** This project is based on the [Manhattan Madness](https://sites.google.com/view/metromaze/nyc-games/manhattan-madness) game created by Metro Maze. The digital version maintains the core gameplay while adding real-time scoring, photo verification, and live leaderboards.

## Features

### 🎮 Core Gameplay
- **Team Management**: Create or join teams with passcode protection
- **Location Claiming**: Compete to claim 139 locations across Manhattan
- **Challenge System**: Complete randomized challenges (1-50) to earn points
- **Veto Mechanic**: Skip challenges with a penalty to keep moving
- **Photo Verification**: Upload proof photos for every completed challenge
- **Real-time Leaderboard**: Live scoring and team rankings

### 📱 Mobile-First Design
- Optimized for on-the-go gameplay
- Large touch targets and single-column layouts
- Bottom navigation for easy one-handed use
- Fast photo capture and upload

### ⚡ Technical Features
- Real-time data synchronization via Firebase
- Offline-capable architecture (PWA-ready)
- Secure team authentication with admin override
- Automatic point calculation and state management

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Firebase
  - Firestore (real-time database)
  - Authentication (anonymous auth)
  - Storage (photo uploads)
  - Hosting
- **Styling**: Tailwind CSS
- **Future**: Progressive Web App (PWA) capabilities

## Project Structure

```
src/
├── components/       # React components
│   ├── layout/      # Navigation and page structure
│   ├── play/        # Gameplay components
│   ├── leaderboard/ # Leaderboard display
│   └── about/       # Info and rules
├── pages/           # Main page views
├── services/        # Firebase integration
│   ├── firestore.ts # Database operations
│   └── storage.ts   # Photo uploads
├── data/            # Static game data
│   ├── challenges.json  # All 50 challenges
│   └── locations.json   # All 139 locations
├── hooks/           # Custom React hooks
└── lib/             # Utilities and config
```

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore, Storage, and Hosting enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd manhattan-madness2
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a `.env` file with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_PASSCODE=your_admin_passcode
```

4. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

### Deploy

Deploy to Firebase Hosting:
```bash
npm run build
firebase deploy --only hosting
```

## Game Rules

### States & Flow

1. **TRAVELING**: Choose to generate a challenge (max 2 between locations) or claim a location
2. **COMPLETING CHALLENGE**: Complete for points or veto with penalty, then return to traveling
3. **CLAIMING LOCATION**: Auto-generated challenge; complete to claim location or veto to try a new challenge

### Scoring

- Each challenge has a point value
- Locations award points when successfully claimed
- Veto penalty = negative challenge point value
- Location points awarded only upon successful claim (not challenge points)

### Photo Requirements

- All challenge completions require photo proof
- Photos are automatically named with timestamp, team name, location, and challenge ID
- Stored in Firebase Storage for game master review

## Data Models

### Team
```typescript
{
  name: string
  passcode: string
  totalPoints: number
  claimedLocations: number[]
  lastClaimedLocation: string
  challengesAttemptedSinceLastClaim: number (max 2)
  currentState: 'traveling' | 'completing_challenge' | 'claiming_location'
  activeChallenge?: { challengeId, isForLocationClaim, locationId? }
}
```

### Challenge (Static JSON)
```typescript
{
  id: number (1-50)
  type: 'challenge' | 'handicap'
  description: string
  points: number
}
```

### Location (Static JSON)
```typescript
{
  id: number
  name: string
  points: number
  tier: 'GREEN' | 'BLUE' | 'RED' | 'PURPLE' | 'GOLD'
}
```

## Architecture

For detailed architecture decisions, data flow, and technical considerations, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Roadmap

### Current (MVP)
- ✅ Team management and authentication
- ✅ Challenge generation and completion
- ✅ Location claiming workflow
- ✅ Photo upload and verification
- ✅ Real-time leaderboard
- ✅ Veto system with penalties

### Future Enhancements
- [ ] PWA installation and offline support
- [ ] Push notifications for game events
- [ ] Admin dashboard for game management
- [ ] Team photo galleries
- [ ] Map view with location markers
- [ ] Challenge history timeline
- [ ] Export and analytics
- [ ] Multiple simultaneous games
- [ ] Custom challenge/location creation

## Contributing

This is a personal project, but suggestions and feedback are welcome! Please open an issue to discuss proposed changes.

## License

MIT License - See LICENSE file for details

## Credits

- **Original Game**: [Manhattan Madness by Metro Maze](https://sites.google.com/view/metromaze/nyc-games/manhattan-madness)
- **Development**: Built with React, Firebase, and Tailwind CSS
- **Design**: Sulley-inspired dark theme with purple and cyan accents

---

*Last Updated: November 16, 2025*
