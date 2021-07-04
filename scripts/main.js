import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/orbit-controls.three.module.js';
import { GLTFLoader } from './lib/gltf-loader.three.module.js';
import { Params } from './levels.js';
import { Game } from './game.js';

// значение для canvas по умолчанию
const fov = 75;
const width = window.innerWidth * 0.8;
const height = parseInt(window.innerHeight * 0.95);
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
camera.position.set(0, 0, Params.CubeSize * 1.5);
controls.update();

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

// Добавление освещения и луча света на переднюю грань
let ambientLight = new THREE.AmbientLight(0xfafafa, 0.9);
scene.add(ambientLight);
// Подобрать цвет и положение spotlight, подобрать подходящие цвета (оттенки) для стен
let spotLight = new THREE.SpotLight(0x606060);
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
cube.add(contour);

var game = new Game();

// загрузка стен уровня
let walls = game.drawLevelWalls();
walls.forEach(wall => {
    cube.add(wall);
});

// зарузка плоскостей с игровыми объектами
let planes = game.drawLevelPlanes();
planes.forEach(plane => {
    cube.add(plane);
});

// загрузка модели пакмана
const loader = new GLTFLoader(manager);
loader.load('./models/Pacman.glb', function (gltf) {
    let pacman = gltf.scene;
    game.initPacman(pacman);
    cube.add(game.Pacman.getModel());
}, undefined, function (error) {
    console.error(error);
});

// загрузка модели призрака Blinky
loader.load('./models/Blinky.glb', function (gltf) {
    let blinky = gltf.scene;
    game.initGhost(blinky, 'Blinky');
    cube.add(game.Blinky.getModel());
}, undefined, function (error) {
    console.error(error);
});
// загрузка модели призрака Pinky
loader.load('./models/Pinky.glb', function (gltf) {
    let pinky = gltf.scene;
    game.initGhost(pinky, 'Pinky');
    cube.add(game.Pinky.getModel());
}, undefined, function (error) {
    console.error(error);
});
// загрузка модели призрака Inky
loader.load('./models/Inky.glb', function (gltf) {
    let inky = gltf.scene;
    game.initGhost(inky, 'Inky');
    cube.add(game.Inky.getModel());
}, undefined, function (error) {
    console.error(error);
});
// загрузка модели призрака Clyde
loader.load('./models/Clyde.glb', function (gltf) {
    let clyde = gltf.scene;
    game.initGhost(clyde, 'Clyde');
    cube.add(game.Clyde.getModel());
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


const onKeyDown = function (event) {
    switch(event.keyCode) {
        case 87: // W
            game.Pacman.startMovement('up')
            break;
        case 83: // S
            game.Pacman.startMovement('down');
            break;
        case 65: // A
            game.Pacman.startMovement('left');
            break;
        case 68: // D
            game.Pacman.startMovement('right');
            break;
    }
}
addEventListener('keydown', onKeyDown);

function ResizeCanvas () {
    let width = window.innerWidth * 0.8;
    let height = parseInt(window.innerHeight * 0.95);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}
addEventListener('resize', ResizeCanvas, false);