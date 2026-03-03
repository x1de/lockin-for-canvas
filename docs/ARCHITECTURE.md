# LockIn Architecture

## Extension Structure

The extension follows Chrome Manifest V3 architecture with three execution contexts:

### Background Service Worker (extension/src/background/)
- Persistent (event-driven) service worker
- Manages Firebase connection and auth
- Routes messages between content script and popup
- Handles notification display

### Content Script (extension/src/content/)
- Injected into Canvas (*.instructure.com) pages
- Scrapes Canvas DOM for user and assignment data
- Injects SquadBar React component into Canvas sidebar
- Observes DOM mutations for status changes

### Popup (extension/src/popup/)
- Opens when user clicks extension icon
- Squad management (create, join, view)
- Nudge sending and receiving
- Settings

## Data Flow

1. User visits Canvas assignment page
2. Content script scrapes assignment info from DOM
3. Content script sends data to background worker
4. Background worker syncs status to Firebase Realtime DB
5. Firebase pushes update to all squad members
6. Their content scripts update the SquadBar UI

## Firebase Schema

```
/users/{uid} -> User
/squads/{squadId} -> Squad
/status/{squadId}/{uid} -> MemberStatus
/nudges/{targetUid}/{nudgeId} -> Nudge
```
