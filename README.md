# THE 404TH FLOOR

A vertical escape room built with **React**, **TypeScript**, and **Tailwind CSS**. Navigate through 8 increasingly difficult floors by solving DOM-based puzzles to restore a glitched elevator.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 and start your ascent.

## Puzzle Floors

| Floor | Name | Puzzle Type | Difficulty |
|-------|------|-------------|------------|
| 1 | Lobby | **Fuse Panel** — Drag & drop fuses into matching slots | Easy |
| 2 | Access Terminal | **Keypad Entry** — Find & enter the correct technician ID | Medium |
| 3 | Server Room | **Emergency Brake** — Mash SPACE to build hydraulic pressure | Medium |
| 4 | Executive Suite | **Final Debug** — Click all spawned bugs before they crash the system | Hard |
| 5 | Memory Core | **Sequence Lock** — Simon-says memory sequence, growing each round | Hard |
| 6 | Power Plant | **Circuit Balance** — Transfer power between circuits to stabilize the grid | Hard |
| 7 | Comms Hub | **Wire Cipher** — Connect wires to the correct color-coded terminals | Very Hard |
| 8 | Mainframe | **Core Reboot** — Multi-phase boss puzzle: drain, align, code, reboot | Extreme |

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build -> dist/
npm run preview  # Preview production build
npm test         # Run Mocha test suite (16+ tests)
```

## Tech Stack

- **React 19** + **TypeScript 6** — Component architecture with type safety
- **Vite 8** — Lightning-fast HMR and bundling
- **Tailwind CSS 3** — Utility-first styling with custom dark theme
- **React Router 7** — Client-side routing for floor navigation
- **Web Audio API** — Procedural sound effects without external assets
- **Mocha + Chai** — Unit testing for game logic & utilities
- **localStorage** — Progress persistence across sessions

## Color Scheme

Preserved from original project:
- Primary: `#135bec`
- Background: `#101622`
- Panel: `#1a1f2e`
- Metal: `#151a25`

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Router configuration
├── index.css             # Tailwind + glitch animations
├── types/index.ts        # TypeScript interfaces
├── lib/gameLogic.ts      # Game state, progression, utilities
├── audio/sounds.ts       # Web Audio sound engine
├── components/
│   ├── ElevatorHub.tsx   # Main hub/floor selection
│   └── Layout.tsx        # Shared layout + control panel
└── floors/
    ├── Floor1.tsx - Floor8.tsx  # Individual puzzle components
    └── Victory.tsx       # End credits cinematic
```

## Testing

```bash
npm test
```

Tests cover:
- Floor unlocking/progression logic
- Sequence generation (randomness & constraints)
- Cipher generation
- Bug type definitions
- localStorage persistence

## Credits

Built from the original vanilla JS concept by the team. Converted to React with additional floors, enhanced difficulty, and expanded test coverage.

---

*"No floors were harmed in the making of this escape room."*
