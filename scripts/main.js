import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/orbit-controls.three.module.js';
import { GLTFLoader } from './lib/gltf-loader.three.module.js';
import { Game } from './game.js';
import { Objects, Params } from './entity.js';

// значение для canvas по умолчанию
const fov = 75;
const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.85;
const aspect = width / height;
const near = 0.1;
const far = 10000;

// создание сцены
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
var controls = new OrbitControls(camera, renderer.domElement);
let viewerBox = document.getElementById('viewer');
viewerBox.appendChild(renderer.domElement);

// определение положения камеры
camera.position.set(0, 0, 750);
controls.update();

// Добавление освещения и луча света на переднюю грань
let ambientLight = new THREE.AmbientLight(0xfafafa, 0.9);
scene.add(ambientLight);
// Подобрать цвет и положение spotlight, подобрать подходящие цвета (оттенки) для стен
let spotLight = new THREE.SpotLight(0x404040);
spotLight.position.set(Params.CubeSize * 4, Params.CubeSize * 4, Params.CubeSize * 4);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 10000;
spotLight.shadow.camera.fov = 75;
scene.add(spotLight);

// создание куба
var geometry = new THREE.BoxGeometry(Params.CubeSize, Params.CubeSize, Params.CubeSize);
var material = new THREE.MeshStandardMaterial({ color: 0x000000 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// добавление контуров для куба
let edges = new THREE.EdgesGeometry(geometry);
let contour = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color:  0xfafafa }));
scene.add(contour);

var game = new Game();
// загрузка стен уровня
let walls = game.drawLevelWalls();
walls.forEach(wall => {
    scene.add(wall);
});
// зарузка плоскостей с игровыми объектами
let planes = game.drawLevelPlanes();
planes.forEach(plane => {
    scene.add(plane);
});

// создание менеджера загруки моделей
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

// загрузка модели пакмана
const loader = new GLTFLoader(manager);
loader.load('./models/pacman.glb', function (gltf) {
    let pacman = game.drawPacman(gltf.scene.children[0].geometry);
    scene.add(pacman);
}, undefined, function (error) {
    console.error(error);
});

// загрузка модели призрака Blinky
loader.load('./models/Blinky.glb', function (gltf) {
    let ghost = gltf.scene; // Загрузка всей сцены (возможно временное решение)
    ghost.scale.set(10, 10, 10); // Ghost.Size/2
    ghost.position.set(Params.CellSize, Params.CellSize, Params.CubeSize / 2 + Params.Depth / 2);
    ghost.rotateY(-Math.PI/2);
    console.log(ghost);
    scene.add(ghost);
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