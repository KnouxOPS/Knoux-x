# ═══════════════════════════════════════════════════════════════════════
# KNOUX Player X™
## Next-Generation Media Player with AI Integration
# ═══════════════════════════════════════════════════════════════════════

![KNOUX Player X](assets/banner.png)

[![Version](https://img.shields.io/badge/version-1.0.0-cyan)](https://knoux.dev)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-9feaf9)](https://electronjs.org)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178c6)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

---

## ✨ Features

### 🎬 Media Playback
- **Video Formats**: MP4, MKV, AVI, MOV, WMV, FLV, WebM, and more
- **Audio Formats**: MP3, WAV, FLAC, AAC, OGG, M4A, and more
- **Hardware Acceleration**: GPU-accelerated decoding for smooth playback
- **Advanced Controls**: Playback speed, loop, shuffle, A-B repeat

### 🔊 Audio Enhancement
- **DSP Processing**: Real-time digital signal processing
- **10-Band Equalizer**: 18 presets + custom settings
- **Audio Effects**: Bass boost, surround sound, night mode, voice enhancement
- **Visualizer**: Real-time audio visualization

### 📝 Subtitles
- **Multiple Formats**: SRT, VTT, ASS, SSA
- **AI Sync**: Automatic subtitle synchronization using AI
- **AI Translation**: Translate subtitles to any language
- **Custom Styling**: Font, size, color, position

### 🤖 AI Integration
- **Gemini AI**: Powered by Google's Gemini API
- **Smart Recommendations**: Get personalized media suggestions
- **Natural Language**: Control the player with voice/text commands
- **Media Analysis**: AI-powered content analysis

### 🎨 UI/UX
- **Neon Glassmorphism**: Stunning futuristic design
- **Dark Theme**: Easy on the eyes
- **Customizable**: Accent colors and themes
- **Responsive**: Works on all screen sizes

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/knoux/player-x.git
cd player-x

# Install dependencies
npm install

# Start development server
npm start
```

### Building

```bash
# Build for current platform
npm run make

# Build for Windows
npm run make:win

# Build for macOS
npm run make:mac

# Build for Linux
npm run make:linux
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Electron 28 |
| Frontend | React 18 + TypeScript |
| Styling | CSS3 + Glassmorphism |
| State Management | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI | Google Gemini API |
| Build | Vite |

---

## 📁 Project Structure

```
KNOUX/
├── electron/              # Electron main process
│   ├── main.ts           # Main entry point
│   ├── preload.ts        # Preload script
│   ├── ipc/              # IPC handlers
│   └── menu/             # Application menus
├── src/
│   ├── components/       # React components
│   │   ├── neon/        # Neon UI components
│   │   └── layout/      # Layout components
│   ├── core/            # Core systems
│   │   ├── orchestrator/# System orchestrator
│   │   ├── dsp/         # DSP system
│   │   ├── security/    # Security manager
│   │   └── services/    # Business services
│   ├── features/        # Feature modules
│   │   ├── player/      # Player view
│   │   ├── library/     # Library view
│   │   ├── settings/    # Settings view
│   │   └── ai/          # AI assistant
│   ├── store/           # Zustand stores
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main app component
│   └── main.tsx         # React entry point
├── assets/              # Static assets
├── native/              # Native modules
└── docs/                # Documentation
```

---

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `← / →` | Seek backward/forward |
| `↑ / ↓` | Volume up/down |
| `M` | Mute |
| `F` | Fullscreen |
| `L` | Loop toggle |
| `S` | Shuffle toggle |
| `Ctrl + O` | Open file |
| `Ctrl + Shift + O` | Open folder |
| `Ctrl + L` | Show library |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Electron](https://electronjs.org) - Cross-platform desktop apps
- [React](https://reactjs.org) - UI library
- [Framer Motion](https://framer.com/motion) - Animations
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities

---

<p align="center">
  <strong>Made with 💜 by the KNOUX Development Team</strong>
</p>

<p align="center">
  <a href="https://knoux.dev">Website</a> •
  <a href="https://docs.knoux.dev">Documentation</a> •
  <a href="https://github.com/knoux/player-x">GitHub</a>
</p>
