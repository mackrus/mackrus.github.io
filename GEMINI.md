# Gemini Project Context: Portfolio Home

This project is a personal portfolio website featuring an interactive 3D solar system. It utilizes a hybrid architecture with a Rust-based WebAssembly (WASM) backend for logic and a TypeScript/Vite frontend for rendering and UI.

## Project Structure

- **`wasm-crate/`**: Contains the Rust source code for the solar system simulation.
  - `src/lib.rs`: Defines the `SolarSystem`, `Planet`, and `Satellite` structures and their update logic.
  - `Cargo.toml`: Rust project configuration and dependencies (`wasm-bindgen`, `serde`, `js-sys`).
- **`www/`**: Contains the TypeScript frontend and Vite configuration.
  - `src/main.ts`: The main entry point for the frontend, handling Three.js scene setup, planet rendering, and user interactions.
  - `src/style.css`: Styles for the UI overlay and page layout.
  - `src/pkg/`: Directory where the compiled WASM module and its JS glue code reside.
  - `public/`: Static assets, including planet textures and photos.

## Core Technologies

- **Frontend**: [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Three.js](https://threejs.org/)
- **Backend (WASM)**: [Rust](https://www.rust-lang.org/), [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen)
- **Communication**: [Serde](https://serde.rs/) (via `serde-wasm-bindgen`) for efficient data transfer between Rust and JavaScript.

## Building and Running

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) and `wasm-pack`
- [Node.js](https://nodejs.org/) and `npm`

### Setup

1.  **Build the WASM module**:
    ```bash
    cd wasm-crate
    wasm-pack build --target web --out-dir ../www/src/pkg
    ```
2.  **Install frontend dependencies**:
    ```bash
    cd ../www
    npm install
    ```

### Development

Run the development server:
```bash
cd www
npm run dev
```

### Production Build

1.  Rebuild the WASM module (if needed).
2.  Build the frontend:
    ```bash
    cd www
    npm run build
    ```

## Development Conventions

- **Hybrid Logic**: Complex mathematical calculations (like orbital mechanics) should ideally be handled in the Rust `wasm-crate` for performance and separation of concerns.
- **Rendering**: Three.js is used for all 3D rendering. Planet data is fetched from the `SolarSystem` instance in `main.ts`.
- **UI**: The UI is an HTML/CSS overlay on top of the Three.js canvas. Interaction with the 3D scene (e.g., clicking planets) updates the UI state.
- **Assets**: Planet textures are located in `www/public/photos/celestial_bodies/`.

## Key Files

- `wasm-crate/src/lib.rs`: Orbital mechanics and state management.
- `www/src/main.ts`: Three.js scene setup, animation loop, and UI integration.
- `www/src/style.css`: Visual styling for the overlay and HUD elements.
- `www/index.html`: Main HTML structure with the `<canvas id="bg">`.
