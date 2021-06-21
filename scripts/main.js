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
const pacman_size = 10;

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

// создание куба
var geometry = new THREE.BoxGeometry(Params.CubeSize, Params.CubeSize, Params.CubeSize);
var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// добавление контуров для куба
let edges = new THREE.EdgesGeometry(geometry);
let contour = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color:  0xfafafa }));
scene.add(contour);

// загрузка стен уровня
var game = new Game();
drawLevelWalls(game);
drawLevelDots(game);
drawLevelCherries(game);

function drawLevelWalls(game) {
    let levelWalls = game.drawWalls();
    for (let level of levelWalls)
    {
        for (let walls of level)
        {
            let edges = new THREE.EdgesGeometry(walls.geometry);
            let contour = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color:  0xfafafa }));
            walls.add(contour);
            scene.add(walls);
        }  
    }
}

function drawLevelDots(game) {
    let levelDots = game.drawDots();
    let geometry = new THREE.PlaneGeometry(Params.CubeSize, Params.CubeSize);
    let material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0 });

    let planes = {
        'front': new THREE.Mesh(geometry, material),
        'back': new THREE.Mesh(geometry, material),
        'right': new THREE.Mesh(geometry, material),
        'left': new THREE.Mesh(geometry, material),
        'top': new THREE.Mesh(geometry, material),
        'bottom': new THREE.Mesh(geometry, material)
    }
    for (let level of levelDots)
    {
        let name = level.name;
        //let plane = new THREE.Mesh(geometry, material);
        let offset = { // Добавление дополнительного смещения в половину высоты стены
            x: game.map[name].offset.x ? (game.map[name].offset.x > 0 ? game.map[name].offset.x + Params.Depth/2 : game.map[name].offset.x - Params.Depth/2) : 0,
            y: game.map[name].offset.y ? (game.map[name].offset.y > 0 ? game.map[name].offset.y + Params.Depth/2 : game.map[name].offset.y - Params.Depth/2) : 0,
            z: game.map[name].offset.z ? (game.map[name].offset.z > 0 ? game.map[name].offset.z + Params.Depth/2 : game.map[name].offset.z - Params.Depth/2) : 0
        }
        planes[name].position.set(offset.x, offset.y, offset.z);
        planes[name].setRotationFromEuler(new THREE.Euler(game.map[name].rotation.x, game.map[name].rotation.y, game.map[name].rotation.z));
        for (let dot of level.dots)
        {
            let mesh = dot.mesh;
            planes[name].add(mesh.clone());
        }
        scene.add(planes[name]);
    }
}

function drawLevelCherries(game) {
    let levelCherries = game.drawCherries();
    let geometry = new THREE.PlaneGeometry(Params.CubeSize, Params.CubeSize);
    let material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0 });
    
    for (let level of levelCherries)
    {
        let name = level.name;
        let plane = new THREE.Mesh(geometry, material);
        let offset = { // Добавление дополнительного смещения в половину высоты стены
            x: game.map[name].offset.x ? (game.map[name].offset.x > 0 ? game.map[name].offset.x + Params.Depth/2 : game.map[name].offset.x - Params.Depth/2) : 0,
            y: game.map[name].offset.y ? (game.map[name].offset.y > 0 ? game.map[name].offset.y + Params.Depth/2 : game.map[name].offset.y - Params.Depth/2) : 0,
            z: game.map[name].offset.z ? (game.map[name].offset.z > 0 ? game.map[name].offset.z + Params.Depth/2 : game.map[name].offset.z - Params.Depth/2) : 0
        }
        plane.position.set(offset.x, offset.y, offset.z);
        plane.setRotationFromEuler(new THREE.Euler(game.map[name].rotation.x, game.map[name].rotation.y, game.map[name].rotation.z));
        for (let cherry of level.cherries)
        {
            let mesh = cherry.mesh.clone()
            plane.add(mesh);
        }
        scene.add(plane);
    }
}

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
    // создание геометрии и mesh (модели) пакмана
    let geometry = gltf.scene.children[0].geometry;
    let material = new THREE.MeshBasicMaterial({ color: 0xffff33 });
    let pacman = new THREE.Mesh(geometry, material);
    pacman.scale.set(pacman_size, pacman_size, pacman_size);
    pacman.rotateY(-Math.PI / 2);
    pacman.position.set(0, 0, Params.CubeSize / 2 + pacman_size);

    // создание контура для пакмана
    let curve = new THREE.EllipseCurve(0, 0, 1, 1, 2.15, -2.32 * Math.PI, false, 1);
    let points = curve.getPoints(50);
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    material = new THREE.LineBasicMaterial({color: '#000000'});
    let ellipse = new THREE.Line(geometry, material);
    ellipse.rotateY(Math.PI);
    ellipse.rotateX(7/4 * Math.PI);
    let ellipse2 = new THREE.Line(geometry, material);
    ellipse2.rotateY(-2 * Math.PI);
    ellipse2.rotateX(3/4 * Math.PI);
    pacman.add(ellipse);
    pacman.add(ellipse2);
    material = new THREE.LineBasicMaterial({ color: '#000000' });
    points = [];
    points.push(new THREE.Vector3(- 1.01, 0, -0.02));
    points.push(new THREE.Vector3(1.01, 0, -0.02));
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(geometry, material);
    pacman.add(line);

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