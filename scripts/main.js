import * as THREE from './three.module.js';
import { OrbitControls } from './orbit-controls.three.module.js';
import { GLTFLoader } from './gltf-loader.three.module.js';

// значение для canvas по умолчанию
const fov = 75;
const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const near = 0.1;
const far = 10000;
const cube_size = 500;
const pacman_size = 25;

// создание сцены
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
var controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

// создание геометрии
var geometry = new THREE.BoxGeometry(cube_size, cube_size, cube_size);
var material = new THREE.MeshBasicMaterial({ color: 0xfafafa });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// определение положения камеры
camera.position.set(0, 100, 1000);
controls.update();

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
    console.log('Loading complete!');
};


manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function (url) {
    console.log('There was an error loading ' + url);
};


const loader = new GLTFLoader(manager);
loader.load('./models/pacman.glb', function (gltf) {
    let geometry = gltf.scene.children[0].geometry;
    let material = new THREE.MeshBasicMaterial({ color: 0xffff33 });
    let pacman = new THREE.Mesh(geometry, material);
    pacman.scale.set(pacman_size, pacman_size, pacman_size);
    pacman.rotateY(-Math.PI / 2);
    pacman.position.set(0, 0, cube_size / 2 + pacman_size / 2);

    scene.add(pacman);
}, undefined, function (error) {
    console.error(error);
});

// вызов функции анимации
animate();

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
};