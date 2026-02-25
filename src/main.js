import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

// 45度视角相机设置
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(60, 60, 60);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 光照
const sunLight = new THREE.PointLight(0xffffff, 1.5, 0);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x404040));

// 太阳
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffdd33 })
);
scene.add(sun);

// 星空 (使用 BufferGeometry 优化性能)
const starGeometry = new THREE.BufferGeometry();
const starCount = 1200;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    const distance = Math.random() * 200 + 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = distance * Math.cos(phi);
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.8
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// 行星数据 (celestialBodies)
const celestialBodies = [];
const planetData = [
    { name: 'Mercury', radius: 0.3, distance: 8, color: 0x909090, speed: 0.03 },
    { name: 'Venus', radius: 0.5, distance: 11, color: 0xd4a05f, speed: 0.022 },
    { name: 'Earth', radius: 0.6, distance: 14, color: 0x3c74d9, speed: 0.02 },
    { name: 'Mars', radius: 0.4, distance: 17, color: 0xd14c32, speed: 0.017 },
    { name: 'Jupiter', radius: 1.5, distance: 24, color: 0xd08552, speed: 0.013 },
    { name: 'Saturn', radius: 1.2, distance: 30, color: 0xdecc9d, speed: 0.011, hasRing: true },
    { name: 'Uranus', radius: 0.9, distance: 36, color: 0x6bd7de, speed: 0.009 },
    { name: 'Neptune', radius: 0.8, distance: 42, color: 0x2e6bd8, speed: 0.008 },
    { name: 'Pluto', radius: 0.2, distance: 48, color: 0xb8b2c7, speed: 0.006 }
];

planetData.forEach((data) => {
    const pivot = new THREE.Object3D();
    scene.add(pivot);
    
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(data.radius, 24, 24),
        new THREE.MeshStandardMaterial({ color: data.color })
    );
    mesh.position.set(data.distance, 0, 0);
    pivot.add(mesh);

    if (data.hasRing) {
        const ringGeo = new THREE.RingGeometry(data.radius + 0.3, data.radius + 1, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        mesh.add(ringMesh);
    }

    celestialBodies.push({ pivot, speed: data.speed });
});

// FPS 面板
const fpsPanel = document.createElement('div');
Object.assign(fpsPanel.style, {
    position: 'fixed', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)',
    color: '#0f0', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', zIndex: '999'
});
document.body.appendChild(fpsPanel);

let lastTime = performance.now();
let frameCount = 0;
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const now = performance.now();
    
    frameCount++;
    if (now - lastTime >= 500) {
        fpsPanel.textContent = `FPS: ${Math.round((frameCount * 1000) / (now - lastTime))}`;
        frameCount = 0;
        lastTime = now;
    }

    // 行星公转
    celestialBodies.forEach(body => {
        body.pivot.rotation.y = elapsed * body.speed;
    });

    starField.rotation.y += 0.0002;
    renderer.render(scene, camera);
}

animate();
