import * as THREE from './three.module.js';
import { OrbitControls } from './orbit-controls.three.module.js';

// значение для canvas по умолчанию
const fov = 75;
const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const near = 0.1;
const far = 10000;

// создание сцены
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
var controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

// создание геометрии
var geometry = new THREE.BoxGeometry(500, 500, 500);
var material = new THREE.MeshBasicMaterial({ color: 0xfafafa });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// определение положения камеры
camera.position.set(0, 100, 1000);
controls.update();

// вызов функции анимации
animate();

function animate() {
    requestAnimationFrame(animate);

    //controls.update();

    renderer.render(scene, camera);
};