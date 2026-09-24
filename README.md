# 🛰️ OrbitBoard

[![CI](https://github.com/OrbitLabs/orbit-board/actions/workflows/ci.yml/badge.svg)](https://github.com/OrbitLabs/orbit-board/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](./.nvmrc)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Made by OrbitLabs](https://img.shields.io/badge/made%20by-OrbitLabs-5b3df5.svg)](https://github.com/OrbitLabs)

> A lightweight, open-source **Kanban board** for teams — by **OrbitLabs**.

OrbitBoard is a small, friendly task board you can self-host in minutes. Organise
work into columns, drop cards where they belong, and keep your team in sync — no
heavyweight setup, no external database required to get started.

It's part of the [OrbitLabs](https://github.com/OrbitLabs) family of developer
productivity tools, built and maintained by a community of contributors. 💚

---

## ✨ Features

- 📋 **Boards & columns** — organise work into visual lanes.
- 🃏 **Cards** — lightweight tasks you can create and move.
- ⚡ **Fast** — React + Vite front end, Express API back end.
- 🗂️ **Zero-DB start** — data lives in a local JSON file, so you can run it instantly.
- 🔌 **REST API** — clean, documented endpoints (see [`docs/api.md`](./docs/api.md)).
- 🧩 **Hackable** — small codebase, easy to read and extend.

> 🚧 OrbitBoard is **actively being built (~50% complete)**. Some features are
> intentionally open for contribution — see [Good first issues](#-good-first-issues).

---

## 🖼️ Screenshot

<!-- TODO: replace with a real screenshot once the UI theme lands -->
```
+-----------------------------------------------------------+
|  🛰️  OrbitBoard                                            |
+---------------+---------------+---------------+-----------+
|   Backlog     |   In Progress |     Review    |   Done    |
+---------------+---------------+---------------+-----------+
| [ Set up CI ] | [ Build API ] | [ Write docs ]| [ Logo  ] |
| [ Seed data ] | [ Board UI  ] |               |           |
+---------------+---------------+---------------+-----------+
```
_(screenshot placeholder — grab your own after running it locally!)_

---

## 🚀 Quick start

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/orbit-board.git
cd orbit-board

# 2. Use the right Node version
nvm use            # reads .nvmrc (Node 18)

# 3. Install everything (root + server + client)
npm run install:all

# 4. Configure environment
cp .env.example .env      # Windows: copy .env.example .env

# 5. Seed sample data (optional but nice)
npm run seed

# 6. Run it 🚀
npm run dev
```

Then open **http://localhost:3000** — you should see the board with sample columns.

👉 **Full, detailed instructions live in [`SETUP.md`](./SETUP.md).** If you hit a
snag, that's where the answers are.

---

## 🎯 Features & Roadmap

OrbitBoard features:

- ✅ **Drag-and-drop & column navigation** — smoothly move cards across workflow lanes.
- ✅ **Full card lifecycle** — create, inline edit, and delete cards.
- ✅ **Search & filter** — quickly find cards by keyword across all lanes.
- ✅ **Robust REST API** — persistent JSON store with proper error handling.

---

## 🤝 Contributing

We love contributions of all sizes! Read [`CONTRIBUTING.md`](./CONTRIBUTING.md)
and our [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) to get started.

## 👥 Contributors

OrbitBoard is built by the OrbitLabs community — maintainers, first-timers, and
everyone in between. Your name could be here next. ✨

## 📄 License

[MIT](./LICENSE) © OrbitLabs
