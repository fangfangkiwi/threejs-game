import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
renderer.setPixelRatio(window.devicePixelRatio);
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 1.2, 0);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

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
const starBaseOpacity = 0.65;
const starFlickerAmplitude = 0.12;
const starFlickerSpeed = 0.0025;
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: starBaseOpacity,
    depthWrite: false,
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.set(60, 60, 60); camera.lookAt(0, 0, 0);

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffdd33 })
);
scene.add(sun);

const planetData = [
    { name: 'Mercury', radius: 0.28, distance: 8, color: 0x909090, speed: 0.03 },
    { name: 'Venus', radius: 0.5, distance: 11, color: 0xd4a05f, speed: 0.022 },
    { name: 'Earth', radius: 0.55, distance: 14, color: 0x3c74d9, speed: 0.02 },
    { name: 'Mars', radius: 0.45, distance: 17, color: 0xd14c32, speed: 0.017 },
    { name: 'Jupiter', radius: 1.4, distance: 22, color: 0xd08552, speed: 0.013 },
    { name: 'Saturn', radius: 1.1, distance: 27, color: 0xdecc9d, speed: 0.011 },
    { name: 'Uranus', radius: 0.95, distance: 32, color: 0x6bd7de, speed: 0.009 },
    { name: 'Neptune', radius: 0.9, distance: 36, color: 0x2e6bd8, speed: 0.008 },
    { name: 'Pluto', radius: 0.3, distance: 40, color: 0xb8b2c7, speed: 0.006 },
];

const planets = [];
planetData.forEach((data) => {
    const pivot = new THREE.Object3D();
    scene.add(pivot);
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(data.radius, 24, 24),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.1, roughness: 0.7 })
    );
    mesh.position.set(data.distance, 0, 0);
    pivot.add(mesh);
    planets.push({ pivot, speed: data.speed });
});

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const flicker = Math.sin(elapsed * starFlickerSpeed) * starFlickerAmplitude;
    starMaterial.opacity = THREE.MathUtils.clamp(starBaseOpacity + flicker, 0, 1);
    starField.rotation.y += 0.0003;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    planets.forEach(({ pivot, speed }) => {
        pivot.rotation.y = elapsed * speed;
    });
    renderer.render(scene, camera);
}
animate();
