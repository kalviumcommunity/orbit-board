# 🛰️ SETUP.md — Running OrbitBoard Locally

Welcome, contributor! This guide gets **OrbitBoard** running on your machine,
start to finish. Read it top-to-bottom **before** typing commands — most setup
problems are answered here.

> ⏱️ Time: ~10–15 minutes. 😌 If you hit an error, don't panic — it's normal.
> Jump to Troubleshooting at the bottom.

## 0 · What you're setting up
OrbitBoard has two parts that run together:
- **server/** — a Node.js + Express API (serves boards & cards)
- **client/** — a React + Vite front end (the board UI)
The root package.json has helper scripts that run both for you.

## 1 · Prerequisites (check these first)
You need these tools. Verify each — don't assume:
| Tool | Version | Check command |
|---|---|---|
| Node.js | 18 or higher | node -v |
| npm | 9+ (ships with Node) | npm -v |
| Git | any recent | git --version |

> ⚠️ Node version matters. OrbitBoard requires Node 18+ (see .nvmrc). If node -v
> shows 16 or lower, you'll get an `engine "node" incompatible` error. Fix it:
>     nvm install 18
>     nvm use 18
>     node -v      # should now print v18.x

## 2 · Get the code
    # Fork the repo on GitHub first (top-right "Fork"), then clone YOUR fork:
    git clone https://github.com/<your-username>/orbit-board.git
    cd orbit-board
Confirm you're inside the project:
    ls        # macOS/Linux  →  README.md  SETUP.md  package.json  client/  server/ ...
    dir       # Windows

## 3 · Install dependencies
Install everything for root, server, and client in one go:
    npm run install:all

> 🐛 Heads-up — you may see a peer-dependency warning (npm ERR! ERESOLVE or a
> peer-dep message). One dependency is pinned to an older major version. This is
> expected. Resolve it cleanly with:
>     npm install --legacy-peer-deps
>     npm --prefix server install --legacy-peer-deps
>     npm --prefix client install --legacy-peer-deps
> Still stuck? Delete and reinstall:
>     rm -rf node_modules package-lock.json   # (Windows: delete folders manually)
>     npm install --legacy-peer-deps

## 4 · Configure environment variables
OrbitBoard needs a .env file. This step is NOT optional — the server crashes
without it. Copy the template:
    cp .env.example .env      # macOS/Linux
    copy .env.example .env    # Windows
The defaults in .env.example work out of the box:
    PORT=3000
    API_URL=http://localhost:3000/api
    DATA_FILE=./server/data/board.json
(Optional) Seed sample boards & cards so the app isn't empty:
    npm run seed

## 5 · Run the app 🚀
    npm run dev
You should see something like:
    ✓ server ready · OrbitBoard API on http://localhost:3000
    ➜  Local:   http://localhost:3000
Open http://localhost:3000 in your browser. You should see the OrbitBoard
Kanban board with sample columns. That's liftoff! 🎉
> 📸 This is your screenshot moment for the assignment: capture the terminal
> (ready message) and the board in the browser together.

## 6 · Feature Highlights
OrbitBoard provides a complete, lightweight Kanban workflow:
- 🚀 Drag-and-drop & quick navigation (`←` / `→`) between columns.
- ✏️ Inline card title and description editing.
- 🗑️ Safe card deletion with instant UI sync.
- 🔍 Fast real-time card filtering and search.
See docs/faq.md and docs/api.md for architecture and API documentation.

## 🔧 Troubleshooting
| Error you see | What it means | Fix |
|---|---|---|
| bash: node: command not found | Node not installed / not on PATH | Install Node 18+ from nodejs.org, reopen terminal, node -v |
| engine "node" incompatible — wanted >=18 | Node too old | nvm install 18 && nvm use 18 |
| npm ERR! ERESOLVE / peer dep | Dependency version conflict | Use npm install --legacy-peer-deps (see §3) |
| Missing config: did you run cp .env.example .env? | No .env file | cp .env.example .env, then restart |
| Error: listen EADDRINUSE :::3000 | Port 3000 is busy | Close the other app, or PORT=3001 npm run dev |
| App loads but deleting a card errors | Known planted bug | Not a setup problem — the app is running fine ✅ |

Still stuck? Read the FIRST red line of the error, copy the exact message, and
search it or paste it into your AI setup co-pilot. One error at a time.

Thanks for contributing to OrbitBoard 💚 — the OrbitLabs team.
