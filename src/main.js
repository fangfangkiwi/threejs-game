import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const fpsPanel = document.createElement('div');
fpsPanel.style.position = 'fixed';
fpsPanel.style.top = '10px';
fpsPanel.style.left = '10px';
fpsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
fpsPanel.style.color = '#0f0';
fpsPanel.style.fontFamily = 'monospace';
fpsPanel.style.fontSize = '13px';
fpsPanel.style.padding = '8px 12px';
fpsPanel.style.borderRadius = '4px';
fpsPanel.style.zIndex = '999';
fpsPanel.style.pointerEvents = 'none';

const fpsTitle = document.createElement('div');
fpsTitle.textContent = 'FPS';
fpsTitle.style.fontSize = '11px';
fpsTitle.style.opacity = '0.7';
fpsPanel.appendChild(fpsTitle);

const fpsValue = document.createElement('div');
fpsValue.textContent = '0';
fpsValue.style.fontSize = '16px';
fpsValue.style.fontWeight = '600';
fpsPanel.appendChild(fpsValue);

document.body.appendChild(fpsPanel);

let lastTime = performance.now();
let frameCount = 0;
let currentFps = 0;


function animate() {
    requestAnimationFrame(animate);

    frameCount += 1;
    const now = performance.now();
    const delta = now - lastTime;
    if (delta >= 500) {
        currentFps = Math.round((frameCount * 1000) / delta);
        fpsValue.textContent = currentFps.toString();
        frameCount = 0;
        lastTime = now;
    }

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// intentionally trigger the CI retry flow by referencing a missing identifier
fpsReferenceCheck();

animate();
