# mackrus.github.io

This is my personal website. It features an interactive solar system simulation built with a Rust-based WebAssembly (WASM) backend for orbital mechanics and a Three.js frontend for rendering.

## Architecture

The project utilizes a hybrid architecture to balance performance and developer experience:
- **`wasm-crate/`**: Rust source code for the simulation logic, state management, and coordinate calculations.
- **`www/`**: TypeScript/Vite frontend handling WebGL rendering, camera systems, and the UI overlay.

## Development

The build process is automated via GitHub Actions, but can be run locally:

1. **Build WASM module**:
   ```bash
   cd wasm-crate
   wasm-pack build --target web --out-dir ../www/src/pkg
   ```

2. **Run dev server**:
   ```bash
   cd www
   npm install
   npm run dev
   ```

## License

MIT
