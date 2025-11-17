# Manhattan Madness - System Architecture & Design Decisions

## Project Overview
A mobile-first web application to automate scoring and gameplay for the Manhattan Madness location-based scavenger hunt game.

**Tech Stack:**
- Frontend: Vite + React
- Backend: Firebase (Firestore, Authentication, Storage)
- Deployment: Firebase Hosting
- Future: PWA capabilities (post-MVP)

---

## MVP Scope

### In Scope
- Team creation and passcode-protected team selection
- Location claiming workflow with challenge system
- Point tracking and calculation
- Live leaderboard with team scores and last claimed location
- Challenge generation (random 1-50)
- Veto system with penalty tracking
- Photo upload for challenge proof (honor system)
- Rules and helpful links


---

## App Structure

### Navigation Sections

1. **PLAY** - Main gameplay interface
   - Team selection/creation
   - Challenge generation and completion
   - Location claiming
   - Photo upload
   - Point tracking

2. **LEADERBOARD** - Score tracking
   - All teams with current scores
   - Last claimed location per team
   - Sorted by points (descending)

3. **ABOUT** - Information
   - Game rules
   - Helpful links (Google Maps, etc.)
   - How to play guide

---

## User Flow & State Machine

### Initial State: Team Selection/Creation

```
[App Start]
    |
    v
[Team Selection Screen]
    |
    +---> [Create New Team] --> Enter team name + passcode --> [TRAVELING State]
    |
    +---> [Join Existing Team] --> Select team + enter passcode --> [TRAVELING State]
```

**Team Selection Features:**
- Team creation: name + passcode
- Team joining: dropdown/list of teams + passcode input
- Admin passcode: works for any team (for game master access)

### Core Game State Machine

```
┌─────────────────────────────────────────────────────┐
│                   TRAVELING                         │
│  - View current score                               │
│  - See claimed locations                            │
│  - Two action options:                              │
│    1. Generate challenge (max 2 between locations)  │
│    2. Claim location                                │
└─────────────────────────────────────────────────────┘
         |                              |
         | (Generate Challenge)         | (Claim Location)
         v                              v
┌──────────────────────┐      ┌─────────────────────────┐
│ COMPLETING CHALLENGE │      │ CLAIMING LOCATION       │
│ (Not at location)    │      │ (Auto-generate          │
│                      │      │  challenge)             │
│ Options:             │      │                         │
│ - Complete (+points) │      │ Options:                │
│ - Veto (-penalty)    │      │ - Complete (claim loc)  │
└──────────────────────┘      │ - Veto (-penalty)       │
         |                    └─────────────────────────┘
         |                              |
         | (Complete or Veto)           | (Complete or Veto)
         v                              v
    [TRAVELING]                  ┌──────────────┐
                                 │ Veto: Stay   │
                                 │ in CLAIMING  │
                                 │ (pull new    │
                                 │ challenge)   │
                                 └──────────────┘
                                        |
                                        v
                                 [CLAIMING LOCATION]
                                        |
                                        | (Complete)
                                        v
                                 [Location Claimed!]
                                        |
                                        v
                                    [TRAVELING]
```

### State Transition Rules

**TRAVELING State:**
- Can generate up to 2 challenges before claiming a location
- Can select a location to claim at any time
- Displays: current score, claimed locations, challenges attempted count

**COMPLETING CHALLENGE State (Not at location):**
- **Complete:** Add challenge points to score → return to TRAVELING
- **Veto:** Subtract veto penalty from score → return to TRAVELING
- Counter increments: challenges attempted between locations

**CLAIMING LOCATION State:**
- Challenge auto-generated upon location selection
- **Complete:** Add location points (NOT challenge points) → claim location → return to TRAVELING → reset challenge counter
- **Veto:** Subtract veto penalty from location points → generate NEW challenge → stay in CLAIMING LOCATION state
- Location only claimed when challenge completed successfully

---

## Data Architecture

### Static Data (Frontend JSON Files)

**Challenges** (`src/data/challenges.json`):
- All 50 challenges stored as static JSON array
- Loaded once on app initialization
- Fast access, no Firebase reads needed
- Easy to update by editing JSON file

**Locations** (`src/data/locations.json`):
- All claimable locations stored as static JSON array
- Loaded once on app initialization
- Fast access, no Firebase reads needed
- Includes `tier` values for grouping and scoring UX
- Can be updated independently of database

**Rationale:**
- Reduces Firebase read operations (cost savings)
- Faster access (no network latency)
- Simpler for MVP (no admin interface needed to manage)
- Challenges and locations rarely change during a game
- Future: Can migrate to Firestore if dynamic management needed

### Dynamic Data (Firestore)

**Teams, ChallengeSubmissions** - stored in Firestore for:
- Real-time synchronization across players
- Persistent game state
- Leaderboard updates
- Game history

---

## Data Models

### Team
```typescript
{
  id: string (auto-generated)
  name: string
  passcode: string (plain text)
  createdAt: timestamp
  totalPoints: number
  claimedLocations: string[] (array of location IDs)
  lastClaimedLocation: string (location name)
  lastClaimedAt: timestamp
  challengesAttemptedSinceLastClaim: number (max 2)
  currentState: 'traveling' | 'completing_challenge' | 'claiming_location'
  activeChallenge?: {
    challengeId: number (1-50)
    isForLocationClaim: boolean
    locationId?: string (if claiming)
  }
}
```

### Challenge
```typescript
{
  id: number // 1-50
  type: 'challenge' | 'handicap'
  description: string
  points: number // veto penalty = -points
}
```

### Location
```typescript
{
  id: number // sequential integer
  name: string
  points: number
  tier: 'GREEN' | 'BLUE' | 'RED' | 'PURPLE' | 'GOLD'
}
```

### ChallengeSubmission (for history/proof)
```typescript
{
  id: string (auto-generated)
  teamId: string
  challengeId: number
  locationId?: string (if claiming location)
  photoUrl: string (required)
  timestamp: timestamp
  action: 'completed' | 'vetoed'
  pointsAwarded: number (can be negative for veto)
}
```

---


**Decision for MVP:** Use Firebase Storage with photos REQUIRED for all challenge completions. Implement basic compression before upload to minimize costs.

TBD: Define photo upload flow (capture, compression, retry/backoff, size limits, offline handling).

---

## Authentication & Security

### Team Access Control
- Teams protected by passcode (stored as plain text in Firestore)
- Admin passcode: environment variable, works for any team
- No user accounts needed - just team selection + passcode
- Firestore security rules prevent cross-team data manipulation

### Security Rules Strategy
```javascript
// Teams can only update their own data
// Anyone can read leaderboard
// Challenges and locations are read-only
```

---

## UI/UX Considerations

### Mobile-First Design
- Large touch targets (min 44px)
- Bottom navigation for main sections
- Single-column layouts
- Minimal scrolling on key screens
- Fast photo capture flow

### Key Screens
1. **Team Selection** - Simple list or create new
2. **Play Dashboard** - Current state, score, actions
3. **Challenge Display** - Full screen, clear instructions, photo upload, complete/veto buttons
4. **Location Selection** - List view (map for future)
5. **Leaderboard** - Table view with team name, score, last location

---

## Open Questions & Future Enhancements

### Resolved Decisions
1. ✅ Passcodes: Plain text (simpler for prototype)
2. ✅ Photo upload: **Required** for all challenge completions
3. ✅ Challenge list: Static JSON in frontend (`src/data/challenges.json`)
4. ✅ Location list: Static JSON in frontend (`src/data/locations.json`)

### Remaining Questions
1. Number of challenges to create (50 total needed)
2. Challenge distribution (regular challenges vs handicaps)
3. Game state persistence strategy (local storage vs Firestore rejoin flow) — TBD

### Configuration Values
- **Admin Passcode:** `madnessadmin`
- **Total Locations:** 139 (defined in `src/data/locations.json`)
- **End Time Tracking:** Not in MVP scope

### Post-MVP Features
- PWA installation
- Push notifications for battle challenges
- Admin dashboard for game management
- Photo gallery per team
- Map view with markers
- Challenge history timeline
- Export game results
- Multiple simultaneous games
- Custom challenge/location creation

---



## Performance Considerations

- Firestore real-time listeners only on leaderboard view
- Optimize photo uploads (compress, resize client-side)
- Lazy load images in history
- Debounce point updates
- Use Firestore batch writes for atomic updates

---


## Theme & Styling

- Framework: Tailwind CSS (Vite plugin `@tailwindcss/vite`, CSS `@import "tailwindcss"`).
- Default: Dark theme (html has `class="dark"`).
- Brand colors: Sulley-inspired — primary purple, secondary cyan/blue.
- Tokens: `primary-50..900`, `secondary-50..900` exposed via Tailwind color tokens.
- Usage: `bg-primary-600`, `text-secondary-400`, `btn-primary`, `btn-secondary` utilities.

Future: Add a theme toggle (persisted) if light mode is desired post-MVP.

*Last Updated: November 16, 2025*
