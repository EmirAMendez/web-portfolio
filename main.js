import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
  Lista de los 7 elementos del set-up de Blender:
  1. Escritorio
  2. Monitor
  3. Teclado
  4. Mouse
  5. Laptop/PC
  6. Lámpara (objeto creativo)
  7. Planta (objeto creativo)
*/

// --- 1. Inicialización de Three.js ---
const container = document.getElementById('canvas-container');

// Escena
const scene = new THREE.Scene();



// Cámara
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(5, 5, 5);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Controles (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true; // Activar rotación automática
controls.autoRotateSpeed = 1.5; // Velocidad suave

// --- 2. Iluminación ---
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Intensidad base para Dark Mode
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// --- 3. Carga del Modelo 3D ---
const loader = new GLTFLoader();

// Añadir un mensaje de carga visual
const loadingEl = document.createElement('div');
loadingEl.style.position = 'absolute';
loadingEl.style.top = '10px';
loadingEl.style.left = '10px';
loadingEl.style.color = 'white';
loadingEl.style.background = 'rgba(0,0,0,0.7)';
loadingEl.style.padding = '10px';
loadingEl.style.zIndex = '1000';
loadingEl.innerText = 'Cargando modelo...';
container.appendChild(loadingEl);

loader.load(
    'Setup_gra.glb', 
    (gltf) => {
        const model = gltf.scene;
        
        // Autocentrar y escalar el modelo automáticamente
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        
        let meshCount = 0;
        let vertexCount = 0;
        model.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                if (child.geometry && child.geometry.attributes.position) {
                    vertexCount += child.geometry.attributes.position.count;
                }
            }
        });

        if (maxDim === 0 || meshCount === 0) {
            console.error('El modelo está vacío o no tiene tamaño.');
            loadingEl.innerHTML = `<span style="color:red;">Error de Exportación:</span><br>
            Tu archivo Setup_gra.glb tiene <b>${meshCount} mallas</b> y <b>${vertexCount} vértices</b>.<br>
            El tamaño físico calculado es: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}.<br>
            Esto significa que Blender exportó un archivo vacío o sin modelos 3D visibles.`;
            return;
        }

        // El fov es 45. Para que un objeto de tamaño 5 entre en la pantalla:
        // Distancia = (tamaño / 2) / tan(fov / 2)
        // distance = 2.5 / tan(22.5 grados) = 6.03
        const cameraZ = 9.0; // Distancia fija segura porque siempre escalamos a tamaño 5

        // Escalar modelo si es demasiado grande o pequeño (normalizar a tamaño 5)
        const scale = 5 / maxDim;
        model.scale.setScalar(scale);

        // Volver a calcular centro después de escalar
        const boxScaled = new THREE.Box3().setFromObject(model);
        const centerScaled = boxScaled.getCenter(new THREE.Vector3());

        model.position.x += (model.position.x - centerScaled.x);
        model.position.y += (model.position.y - centerScaled.y);
        model.position.z += (model.position.z - centerScaled.z);
        
        scene.add(model);
        
        camera.position.set(0, 2, cameraZ);
        controls.target.set(0, 0, 0);
        controls.update();

        loadingEl.innerText = 'Modelo cargado y ajustado exitosamente.';
        setTimeout(() => loadingEl.remove(), 3000);
    },
    (xhr) => {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        loadingEl.innerText = `Cargando modelo: ${percent}% completado`;
    },
    (error) => {
        console.error('Error:', error);
        loadingEl.innerHTML = `<span style="color:red;">Error al cargar el modelo 3D.</span><br>
        1. Asegúrate de que el archivo es "Setup_gra.glb".<br>
        2. <b>Si abriste el archivo con doble clic, los navegadores bloquean el modelo 3D por seguridad (CORS).</b><br>
        Debes usar Live Server en VS Code.`;
    }
);

// --- 4. Animación (Render Loop) ---
const clock = new THREE.Clock();

// Variables para animación de cámara
let isAnimatingCamera = false;
let targetCameraPos = new THREE.Vector3();
let targetControlsPos = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);
    
    // Smooth camera transition
    if (isAnimatingCamera) {
        camera.position.lerp(targetCameraPos, 0.05);
        controls.target.lerp(targetControlsPos, 0.05);
        
        // Stop animating when close enough
        if (camera.position.distanceTo(targetCameraPos) < 0.05 && controls.target.distanceTo(targetControlsPos) < 0.05) {
            isAnimatingCamera = false;
        }
    }

    // Actualizar controles para el damping
    controls.update();

    // Renderizar la escena
    renderer.render(scene, camera);
}
animate();

// --- 5. Resize Handler ---
window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// --- 6. Interactividad: Cambio de Tema y Luces ---
const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', () => {
    // Toggle en el body
    document.body.classList.toggle('light-theme');
    
    // Comprobar qué tema está activo
    const isLight = document.body.classList.contains('light-theme');
    
    // Ajustar iluminación de Three.js
    if (isLight) {
        // Tema Claro: Luces más intensas
        ambientLight.intensity = 1.2;
        directionalLight.intensity = 2;
        scene.fog = new THREE.FogExp2(0xf8fafc, 0.02); // Opcional para blending con el fondo
    } else {
        // Tema Oscuro: Luces más tenues (creando ambiente)
        ambientLight.intensity = 0.5;
        directionalLight.intensity = 1;
        scene.fog = null;
    }
});

// --- 7. Controles de Cámara Especiales ---

function animateCameraTo(camPos, targetPos) {
    targetCameraPos.copy(camPos);
    targetControlsPos.copy(targetPos);
    isAnimatingCamera = true;
    controls.autoRotate = false; // Detener auto-rotación al enfocar
}

const resetCameraBtn = document.getElementById('reset-camera-btn');
if (resetCameraBtn) {
    resetCameraBtn.addEventListener('click', () => {
        animateCameraTo(new THREE.Vector3(0, 2, 9.0), new THREE.Vector3(0, 0, 0));
        setTimeout(() => { controls.autoRotate = true; }, 1000); // Reanudar después de un momento
    });
}

const zoomFiguresBtn = document.getElementById('zoom-figures-btn');
if (zoomFiguresBtn) {
    zoomFiguresBtn.addEventListener('click', () => {
        // Apuntar hacia las repisas y pósters en la pared izquierda
        animateCameraTo(new THREE.Vector3(-0.5, 1.3, 1.8), new THREE.Vector3(-2.5, 1.5, -0.5));
    });
}

const zoomMonitorsBtn = document.getElementById('zoom-monitors-btn');
if (zoomMonitorsBtn) {
    zoomMonitorsBtn.addEventListener('click', () => {
        // Posiciones aproximadas para los monitores (centro del escritorio)
        animateCameraTo(new THREE.Vector3(0, 1.2, 2.5), new THREE.Vector3(0, 0.8, -0.5));
    });
}

// --- 8. Sistema de Partículas de Fondo ---
const bgCanvas = document.getElementById('bg-particles');
if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 80; // Número de partículas en pantalla

    function resizeCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * bgCanvas.height;
            this.size = Math.random() * 2 + 0.5; // Tamaño aleatorio
            this.speedY = Math.random() * 1 + 0.2; // Velocidad de caída
        }
        update() {
            this.y += this.speedY;
            // Reposicionar en la parte superior si sale de la pantalla
            if (this.y > bgCanvas.height) {
                this.y = 0 - this.size;
                this.x = Math.random() * bgCanvas.width;
            }
        }
        draw() {
            // Comprobar el tema actual para definir el color
            const isLight = document.body.classList.contains('light-theme');
            // Blanco semi-transparente para modo oscuro, azul pastel para modo claro
            ctx.fillStyle = isLight ? 'rgba(135, 206, 235, 0.8)' : 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Reajustar el canvas al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// --- 9. Audio Setup ---
const bgAudio = document.getElementById('bg-audio');
const muteBtn = document.getElementById('mute-btn');
if (muteBtn && bgAudio) {
    const iconUnmute = muteBtn.querySelector('.icon-unmute');
    const iconMute = muteBtn.querySelector('.icon-mute');

    function updateMuteIcon() {
        if (bgAudio.muted || bgAudio.paused) {
            iconUnmute.style.display = 'none';
            iconMute.style.display = 'inline';
        } else {
            iconUnmute.style.display = 'inline';
            iconMute.style.display = 'none';
        }
    }

    // Inicializar icono
    updateMuteIcon();

    muteBtn.addEventListener('click', () => {
        if (bgAudio.paused) {
            bgAudio.play();
            bgAudio.muted = false;
        } else {
            bgAudio.muted = !bgAudio.muted;
        }
        updateMuteIcon();
    });

    // Intentar reproducir en el primer clic si el navegador bloquea el autoplay
    document.body.addEventListener('click', () => {
        if (bgAudio.paused && !bgAudio.muted) {
            bgAudio.play().then(updateMuteIcon).catch(() => {});
        }
    }, { once: true });
}
