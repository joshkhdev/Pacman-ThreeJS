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

// загрузка модели пакмана
const loader = new GLTFLoader(manager);
loader.load('./models/Pacman.glb', function (gltf) {
    let pacman = gltf.scene;
    game.initPacman(pacman);
    console.log(game.Pacman.getModel());
    scene.add(game.Pacman.getModel());
}, undefined, function (error) {
    console.error(error);
});

// загрузка модели призрака Blinky
loader.load('./models/Blinky.glb', function (gltf) {
    let blinky = gltf.scene;
    game.initGhost(blinky, 'Blinky');
    scene.add(game.Blinky.getModel());
}, undefined, function (error) {
    console.error(error);
});
// загрузка модели призрака Pinky
loader.load('./models/Pinky.glb', function (gltf) {
    let pinky = gltf.scene;
    game.initGhost(pinky, 'Pinky');
    scene.add(game.Pinky.getModel());
}, undefined, function (error) {
    console.error(error);
});
// загрузка модели призрака Inky
loader.load('./models/Inky.glb', function (gltf) {
    let inky = gltf.scene;
    game.initGhost(inky, 'Inky');
    scene.add(game.Inky.getModel());
}, undefined, function (error) {
    console.error(error);
});
// загрузка модели призрака Clyde
loader.load('./models/Clyde.glb', function (gltf) {
    let clyde = gltf.scene;
    game.initGhost(clyde, 'Clyde');
    scene.add(game.Clyde.getModel());
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




export const PACMAN_MOVEMENT = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    };
    PACMAN_MOVEMENT.RIGHT=true;
    export const CAMERA_MOVEMENT = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    };
    
    const onKeyDown = function ( event ) {
 
    switch ( event.keyCode ) {
    case 87: // W
    if (PACMAN_MOVEMENT.RIGHT==true){
        game.Pacman.rotateX(Math.PI/2); 
        PACMAN_MOVEMENT.RIGHT=false;
      
    }
    if (PACMAN_MOVEMENT.LEFT==true){
        game.Pacman.rotateX(-Math.PI/2); 
        PACMAN_MOVEMENT.LEFT=false;
    }
    if (PACMAN_MOVEMENT.DOWN==true){
        game.Pacman.rotateX(Math.PI); 
        PACMAN_MOVEMENT.DOWN=false;
    }
     
    PACMAN_MOVEMENT.UP = true;
    break;
    case 65: // A
    if (PACMAN_MOVEMENT.RIGHT==true){
        game.Pacman.rotateX(Math.PI); 
        PACMAN_MOVEMENT.RIGHT=false;
    }
    if (PACMAN_MOVEMENT.UP==true){
        game.Pacman.rotateX(Math.PI/2); 
        PACMAN_MOVEMENT.UP=false;
    }
    if (PACMAN_MOVEMENT.DOWN==true){
        game.Pacman.rotateX(-Math.PI/2); 
        PACMAN_MOVEMENT.DOWN=false;
    }
    PACMAN_MOVEMENT.LEFT = true;
    break;
    case 83: // S
    if (PACMAN_MOVEMENT.RIGHT==true){
        game.Pacman.rotateX(-Math.PI/2); 
        PACMAN_MOVEMENT.RIGHT=false;
    }
    if (PACMAN_MOVEMENT.LEFT==true){
        game.Pacman.rotateX(Math.PI/2); 
        PACMAN_MOVEMENT.LEFT=false;
    }
    if (PACMAN_MOVEMENT.UP==true){
        game.Pacman.rotateX(Math.PI); 
        PACMAN_MOVEMENT.UP=false;
    }
    PACMAN_MOVEMENT.DOWN = true;
    break;
    case 68: // D
    if (PACMAN_MOVEMENT.UP==true){
        game.Pacman.rotateX(-Math.PI/2); 
        PACMAN_MOVEMENT.UP=false;
    }
    if (PACMAN_MOVEMENT.LEFT==true){
        game.Pacman.rotateX(Math.PI); 
        PACMAN_MOVEMENT.LEFT=false;
    }
    if (PACMAN_MOVEMENT.DOWN==true){
        game.Pacman.rotateX(Math.PI/2); 
        PACMAN_MOVEMENT.DOWN=false;
    }
    PACMAN_MOVEMENT.RIGHT = true;
    break;
    case 38: // ARROW UP
    CAMERA_MOVEMENT.UP = true;
    camera.position.y += ySpeed;
    break;
    case 37: // ARROW LEFT
    CAMERA_MOVEMENT.LEFT = true;
    camera.position.x -= xSpeed; // При движении нужно приближать камеру
    break;
    case 40: // ARROW DOWN
    CAMERA_MOVEMENT.DOWN = true;
    camera.position.y -= ySpeed;
    break;
    case 39: // ARROW RIGHT
    CAMERA_MOVEMENT.RIGHT = true;
    camera.position.x += xSpeed;
    break;
    }
    
    
    };
    
    // const onKeyUp = function ( event ) {
    
    // switch ( event.keyCode ) {
    // case 87: // W
    // PACMAN_MOVEMENT.UP = false;
    // console.log('W pressed');
    
    // break;
    // case 65: // A
    // PACMAN_MOVEMENT.LEFT = false;
    // break;
    // case 83: // S
    // PACMAN_MOVEMENT.DOWN = false;
    // break;
    // case 68: // D
    // PACMAN_MOVEMENT.RIGHT = false;
    // break;
    // case 38: // ARROW UP
    // CAMERA_MOVEMENT.UP = false ;
    
    // break;
    // case 37: // ARROW LEFT
    // CAMERA_MOVEMENT.LEFT = false;
    // break;
    // case 40: // ARROW DOWN
    // CAMERA_MOVEMENT.DOWN = false;
    // break;
    // case 39: // ARROW RIGHT
    // CAMERA_MOVEMENT.RIGHT = false;
    // break;
    // }
    
    // };
    
    addEventListener( 'keydown', onKeyDown );
    addEventListener( 'keyup', onKeyUp );