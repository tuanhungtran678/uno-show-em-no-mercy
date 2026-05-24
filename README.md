# UNO Show 'Em No Mercy Online

An online multiplayer card game inspired by **UNO Show 'Em No Mercy**.

Play with friends, stack massive draw cards, survive brutal combos, and try not to reach 25 cards... or you're eliminated.

---

# Features

- Online multiplayer
- Real-time gameplay with Socket.IO
- Stackable draw cards (+2, +4, +6, +10)
- Mercy Rule elimination
- Special action cards
- Room system
- Responsive UI
- Sound effects and animations
- Bot support (planned)

---

# Technologies

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Node.js
- Express
- Socket.IO

## Hosting
- GitHub Pages (frontend)
- Render/Railway (backend)

---

# Game Rules

## Draw Card Stacking

Players can stack:
- Draw 2
- Draw 4
- Draw 6
- Draw 10

The next player must play an equal or stronger draw card or draw the entire stack.

Example:

```txt
+2 → +4 → +10 = Draw 16
```

---

## Mercy Rule

If a player reaches **25 cards**, they are immediately eliminated.

---

## Special Cards

- Skip
- Reverse
- Skip Everyone
- Discard All
- Wild Draw 6
- Wild Draw 10
- Wild Reverse Draw 4

---

# Project Structure

```txt
uno-no-mercy/
│
├── client/
│   ├── index.html
│   ├── style.css
│   ├── game.js
│   └── assets/
│
├── server/
│   ├── server.js
│   ├── gameLogic.js
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/your-username/uno-no-mercy.git
```

---

## Install dependencies

```bash
cd server
npm install
```

---

## Run the server

```bash
node server.js
```

---

# Deployment

## Frontend
Deploy using GitHub Pages.

## Backend
Deploy using:
- Render
- Railway
- Fly.io

---

# Planned Features

- Matchmaking
- Ranked mode
- AI bots
- Mobile support
- Card animations
- Voice chat
- Friend system

---

# Screenshots

Coming soon...

---

# Contributing

Pull requests are welcome.

If you'd like to improve the game, feel free to fork the repository and submit a PR.

---

# License

This project is for educational and fan-made purposes only.

UNO is a trademark of Mattel.

---

# Credits

Inspired by UNO Show 'Em No Mercy by Mattel.
