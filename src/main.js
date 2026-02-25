import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 太阳
const sun = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffdd33 }));
scene.add(sun);

// 星空
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(1000 * 3);
for (let i = 0; i < 1000; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 200;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starField = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 }));
scene.add(starField);

// 故意留下错误：缺少一个大括号，导致语法解析失败
function animate() {
    requestAnimationFrame(animate);
    starField.rotation.y += 0.001;
    renderer.render(scene, camera);
// 这里少了一个 } 

animate();
