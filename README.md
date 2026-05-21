# 3D Web Portfolio

A highly interactive, visually stunning personal portfolio built with modern web technologies and **Three.js**. This project features a custom 3D workspace setup model that users can interact with, a modern glassmorphism UI, a dynamic background particle system, and an integrated light/dark mode theme.

## ✨ Features

- **Interactive 3D Model**: Built-in 3D model (`.glb` format) rendered using WebGL and Three.js. Users can automatically rotate, manually zoom, and pan around the virtual workspace.
- **Smart Camera Controls**: Pre-defined camera animations (`lerp`) to smoothly focus on specific elements of the 3D scene, such as the action figures and the monitors.
- **Light/Dark Mode**: A dynamic theme toggle that simultaneously updates the CSS variables (glassmorphism UI, colors) and the Three.js lighting setup in real-time.
- **Dynamic Background**: A custom lightweight 2D canvas particle system that gently floats in the background, adjusting its color palette based on the active theme.
- **Ambient Audio**: Built-in background music with a mute/unmute toggle to enhance the immersive experience.
- **Responsive Design**: Mobile-first CSS layout utilizing Flexbox and Grid, seamlessly switching from a stacked view on mobile devices to a fixed split-screen layout on desktop.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Vanilla CSS with custom properties (variables), Grid, Flexbox, and Glassmorphism effects.
- **JavaScript (ES6+)**: Core logic, DOM manipulation, and interactivity.
- **Three.js**: 3D library used to render the scene, camera, lights, and load the GLTF/GLB models.

## 🚀 Getting Started (Local Development)

To run this project locally, you must use a local development server. Opening the `index.html` file directly in the browser via `file://` will cause **CORS (Cross-Origin Resource Sharing)** errors when attempting to load the 3D model (`Setup_gra.glb`).

### Prerequisites
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (or Node.js `http-server`, Python `http.server`, etc.)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/EmirAMendez/web-portfolio.git
   ```
2. Navigate to the project directory:
   ```bash
   cd web-portfolio
   ```
3. Open the project in VS Code.
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. The portfolio will automatically open in your default web browser (usually at `http://localhost:5500`).

## 📁 Project Structure

```text
web-portfolio/
├── index.html        # Main HTML structure and text content
├── style.css         # Styling, glassmorphism, UI themes and responsive layout
├── main.js           # Three.js rendering setup, camera animations, and JS logic
├── Setup_gra.glb     # 3D Model file exported from Blender
├── akari.mp3         # Background ambient audio file
└── README.md         # Project documentation
```

## 👨‍💻 Author

**Emir Mendez**
- GitHub: [@EmirAMendez](https://github.com/EmirAMendez)
