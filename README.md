# Markus Bajlo - Portfolio

Interactive 3D solar system portfolio showcasing my projects and background in Physics Engineering.

## 🚀 Live Demo
[mackrus.github.io](https://mackrus.github.io/)

## 🛠 Tech Stack
- **Frontend**: [Three.js](https://threejs.org/) (WebGL), TypeScript, Vite
- **Logic/Simulation**: [Rust](https://www.rust-lang.org/) compiled to **WebAssembly (WASM)**
- **Styling**: Vanilla CSS with a focus on glassmorphism and HUD-style interfaces
- **Deployment**: GitHub Actions (CI/CD)

## 🌌 Features
- **Interactive Orrery**: Real-time orbital mechanics calculated in Rust.
- **Project Orbitals**: Interactive satellites around Jupiter that serve as archives for my work.
- **Dynamic Camera**: Smooth orbital transitions between celestial bodies.
- **Quick Navigation**: A persistent UI for fast travel between key data nodes.
- **Scroll Zoom**: Dynamic distance adjustment for precise exploration.

## 📁 Structure
- `wasm-crate/`: Rust source code for the orbital mechanics and state management.
- `www/`: TypeScript frontend and Three.js scene configuration.
- `.github/workflows/`: Automated build and deployment pipeline.

## 🏗 Development

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install) + `wasm-pack`
- [Node.js](https://nodejs.org/)

### Build & Run
1. Build the WASM module:
   ```bash
   cd wasm-crate
   wasm-pack build --target web --out-dir ../www/src/pkg
   ```
2. Install frontend dependencies:
   ```bash
   cd ../www
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## 📜 License
MIT
