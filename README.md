🐍 Snake | Arcade

A sleek, modern, and responsive take on the classic Snake arcade game built with vanilla HTML, CSS, and JavaScript. Eat food to grow your snake, dodge deadly timed poison pellets, and beat your local high score.

✨ Features

Three Difficulty Speeds: Switch dynamically between Easy (180ms), Medium (125ms), and Hard (85ms) modes—even mid-game.

Poison Hazard Mechanic: Purple poison pellets occasionally spawn after eating food and disappear after 8 seconds—avoid them at all costs!

Dark & Light Theme Toggle: Smooth theme switching with persistent user preference saved in localStorage.

Persistent High Scores: Automatically tracks and stores your personal best score locally in your browser.

Multi-Device Controls:

Desktop: Arrow keys (↑ ↓ ← →) or W A S D

Mobile / Touch: On-screen directional pad and swipe gestures directly on the game board

Accessible & Responsive UI: Built with semantic HTML, ARIA attributes, reduced-motion support, and fluid CSS Grid/Flexbox layouts.

🎮 How to Play

Choose your preferred speed (Easy, Medium, or Hard).

Press any Arrow key, WASD, swipe on the board, or tap a direction button to start moving.

Guide the snake to eat the glowing orange food pellets (+1 point each).

Avoid hitting the walls, your own tail, or the purple poison pellets.

Use the Pause button whenever you need a breather, or New game to reset the board.

🛠️ Built With

HTML5 – Semantic structure and ARIA accessibility

CSS3 – Custom properties (CSS variables), CSS Grid (30×30 board), glassmorphism card styling, and responsive media queries

JavaScript (ES6+) – Game loop, collision detection, touch/pointer swipe handling, and localStorage state management

📂 Project Structure

arcade-snake-game/
├── index.html   # Game markup and UI layout
├── style.css    # Dark/light themes, board grid, and animations
├── main.js      # Core game logic, controls, and state persistence
└── README.md    # Project documentation


🚀 Getting Started

To run the project locally on your machine:

Clone the repository:

git clone https://github.com/quamoyekan5-ux/arcade-snake-game


Navigate into the project directory:

cd arcade-snake-game


Open index.html in your favorite web browser—no build tools or dependencies required!

👨‍💻 Author

Created with ❤️ by Olamzy
