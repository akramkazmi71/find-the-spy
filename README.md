# 🕵️ Find the Spy

A fun social deduction game where players must identify the spy among them! Everyone receives the same word except one player who is secretly the spy. Players take turns describing the word, and the spy must figure out what it is without revealing their identity.

## 🎮 How to Play

1. **Setup**: Select the number of players (3-16)
2. **Enter Names**: Each player enters their name
3. **Reveal Words**: Players take turns clicking their name to privately view their word
   - Regular players see the secret word
   - The spy sees "YOU ARE THE SPY!"
4. **Discussion**: Players take turns describing the word (without saying it directly)
5. **Deduce**: Try to figure out who the spy is, or if you're the spy, try to guess the word!

## 🚀 Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd find-the-spy

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deploying to Netlify

### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket
2. Log in to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

### Option 3: Drag and Drop

1. Build the project locally: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

The `netlify.toml` file is already configured for proper SPA routing.

## 📁 Project Structure

```
find-the-spy/
├── src/
│   ├── components/
│   │   ├── PlayerSetup.jsx      # Player count selection
│   │   ├── NameEntry.jsx        # Player name input
│   │   ├── WordReveal.jsx       # Secret word reveal overlay
│   │   └── GameControls.jsx     # Game management controls
│   ├── utils/
│   │   ├── wordDatabase.js      # 500+ curated words
│   │   └── gameLogic.js         # Game logic & session management
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Styling and design system
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── netlify.toml                # Netlify deployment config
└── package.json                # Dependencies and scripts
```

## 🎨 Features

- **500+ Words**: Curated word database across 12 categories
- **Session Management**: Tracks used words via localStorage to prevent repetition
- **Automatic Reset**: When all words are used, automatically starts fresh
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern, mysterious aesthetic with glassmorphism effects
- **Smooth Animations**: Polished UI with micro-interactions
- **Privacy-First**: Secret word reveal system ensures players can't see each other's words

## 🔧 Technical Details

- **Framework**: React 18 with Vite
- **Styling**: Vanilla CSS with CSS custom properties
- **State Management**: React hooks (useState)
- **Storage**: Browser localStorage for session persistence
- **Build Tool**: Vite for fast development and optimized production builds

## 🎯 Game Rules

- Minimum 3 players, maximum 16 players
- One player is randomly selected as the spy
- All other players receive the same word
- Players describe the word without saying it directly
- The spy tries to blend in and figure out the word
- After discussion, players vote on who they think is the spy
- The spy can also try to guess the word

## 📝 License

See the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Enjoy the game! May the best detective win! 🕵️‍♂️🔍**
