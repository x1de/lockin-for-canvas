# LockIn for Canvas

The Social Accountability Extension for Canvas LMS.
Built for MICS 2026 by Rishi, Devank, and Triya.

## Prerequisites

- **Node.js >= 18** ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Google Chrome** (for loading the extension)

To check if you have Node installed:
```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

If you don't have Node.js, install it from https://nodejs.org (LTS version recommended).

## Setup (First Time)

```bash
# 1. Clone the repo
git clone https://github.com/<your-org>/lockin-for-canvas.git
cd lockin-for-canvas

# 2. Install all dependencies (reads package.json automatically)
npm install

# 3. Copy the environment template and fill in Firebase keys
cp .env.example .env.local
# Open .env.local and add your Firebase project config (ask Rishi for keys)

# Or use the shortcut that does steps 2+3:
npm run setup
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Then load the extension in Chrome:
# 1. Go to chrome://extensions
# 2. Enable "Developer mode" (top right toggle)
# 3. Click "Load unpacked"
# 4. Select the ./dist folder from this project
# 5. Navigate to your Canvas LMS site - LockIn should appear
```

## Available Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev build with hot reload |
| `npm run build` | Production build to ./dist |
| `npm run test` | Run unit tests with Vitest |
| `npm run lint` | Check code for ESLint errors |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run setup` | Install deps + create .env.local from template |

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Extension:** Chrome Manifest V3
- **Realtime Backend:** Firebase Realtime Database
- **Auth:** Session-Bridge (Canvas session to Firebase anonymous auth)
- **Build:** Vite + CRXJS
- **Linting:** ESLint + Prettier
- **Testing:** Vitest

## Architecture

Content scripts and popup NEVER talk to Firebase directly. All data flows through the Background Service Worker via messageBridge.ts. See docs/ARCHITECTURE.md for the full diagram.

## Team

| Member | Role | Primary Files |
|--------|------|---------------|
| Rishi | Firebase Gateway + Auth | background/, services/firebase.ts, auth.ts, squads.ts, statusSync.ts |
| Devank | Canvas Bridge + Data Sync | content/, services/canvasParser.ts, messageBridge.ts, hooks/ |
| Triya | UI Components + Popup | components/, popup/, styles/ |

## Troubleshooting

**npm install fails:** Make sure you have Node >= 18. Run `node --version` to check.

**Extension doesn't load:** Make sure you're loading the `dist` folder (not the project root) and that Developer Mode is enabled in chrome://extensions.

**Firebase errors:** Make sure `.env.local` exists with valid Firebase keys. Ask Rishi if you don't have them.

**Changes don't appear:** Try reloading the extension in chrome://extensions (click the refresh icon on the LockIn card).
