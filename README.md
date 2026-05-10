# THE 404TH FLOOR

A vertical escape room built with **React**, **TypeScript**, and **Tailwind CSS**. Navigate through 20 increasingly difficult floors by solving DOM-based puzzles to restore a glitched elevator.

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
| 2 | Access Terminal | **Keypad Entry** — Enter the correct 4-digit code | Medium |
| 3 | Server Room | **Emergency Brake** — Mash SPACE to build brake pressure | Medium |
| 4 | Executive Suite | **Debug Terminal** — Click all spawned bugs before they crash | Hard |
| 5 | Memory Core | **Sequence Lock** — Simon-says memory sequence, growing each round | Hard |
| 6 | Power Plant | **Circuit Balance** — Transfer power between circuits to stabilize the grid | Hard |
| 7 | Comms Hub | **Wire Cipher** — Connect wires to color-coded terminals | Very Hard |
| 8 | Mainframe | **Core Reboot** — Multi-phase boss: drain, align, code, reboot | Extreme |
| 9 | Signal Lab | **Frequency Match** — Stop a sweeping needle on the target frequency | Medium |
| 10 | Plumbing Core | **Pipe Network** — Rotate tiles to connect a continuous flow path | Medium |
| 11 | Logic Bay | **Boolean Gates** — Solve logic gate equations (AND, OR, NOT, NAND, NOR, XOR) | Hard |
| 12 | Decode Chamber | **Binary Decoder** — Convert binary to decimal across 8 rounds | Medium |
| 13 | Reactor Core | **Pattern Matrix** — Memorize and reproduce expanding grid patterns | Hard |
| 14 | Thermal Unit | **Temperature Control** — Balance sliders to hold target temperature | Hard |
| 15 | Vault Room | **Cipher Lock** — Crack a 4-dial code using guess feedback | Very Hard |
| 16 | Pulse Lab | **EM Sequencing** — Reorder scrambled pulse sequences | Hard |
| 17 | Life Support | **Oxygen Balance** — Balance 4 drifting oxygen gauges simultaneously | Very Hard |
| 18 | Zero Point | **Final Ascent** — 3-phase gauntlet: memory, recall, rapid-fire | Extreme |
| 19 | The Crucible | **Ultimate Trial** — 3-phase trial: cipher math, logic, reflexes | Extreme |
| 20 | The Overlord | **Final Boss** — Multi-phase boss: debug, firewall, data purge | Extreme |

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
    ├── Floor1.tsx - Floor20.tsx  # Individual puzzle components
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
