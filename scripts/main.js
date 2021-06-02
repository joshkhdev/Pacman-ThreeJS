import * as THREE from './three.module.js';
import { OrbitControls } from './orbit-controls.three.module.js';
import { GLTFLoader } from './gltf-loader.three.module.js';
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
drawWalls(game);

function drawWalls(game) {
    for (let level of game.getMap())
    {
        let walls = game.findObjects(Objects.wall, level.grid); // Поиск всех блоков стен
        let checkedCells = new Array();
        clearCheckedCells(checkedCells);
        let tempWall = [];
        for (let block of walls) // Обход по каждому блоку стены
        {
            let i = block.i; let j = block.j;
            if (level.grid[i][j] != checkedCells[i][j]) {
                checkedCells[i][j] = Objects.wall;
                tempWallAdd(tempWall, i, j);
                follow(level.grid, 'left', i, j, tempWall, checkedCells);
                follow(level.grid, 'right', i, j, tempWall, checkedCells);

                let wall = truncateWall(tempWall);
                tempWall = [];
                let shape = drawPath(wall);
                let extrudeSettings = {
                    steps: 1,
                    depth: Params.Depth,
                    bevelEnabled: false,
                };
                let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                let wallMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: level.color, }));
                wallMesh.position.set(level.offset.x, level.offset.y, level.offset.z);
                wallMesh.rotation.setFromVector3(new THREE.Vector3(level.rotation.x, level.rotation.y, level.rotation.z));
                let edges = new THREE.EdgesGeometry(geometry);
                let contour = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color:  0xfafafa })); // TODO: Удалить сетку на котнурах
                wallMesh.add(contour);
                scene.add(wallMesh);
            }        
        }
    }
}

function clearCheckedCells(checkedCells) {
    for (let i = 0; i < Params.Rows; i++)
        checkedCells[i] = new Array();
}

function tempWallAdd(tempWall, i, j) {
    let delta = Params.CellSize / 2;
	let radius = Params.CubeSize / 2;
	let center = { x: j * Params.WallSize - (radius - delta), y: -i * Params.WallSize + (radius - delta)}
	tempWall.push({ x: center.x - delta, y: center.y + delta }); // left top 
	tempWall.push({ x: center.x + delta, y: center.y + delta }); // right top 
	tempWall.push({ x: center.x + delta, y: center.y - delta }); // right bottom
	tempWall.push({ x: center.x - delta, y: center.y - delta }); // left bottom
}

function follow(level, direction, i, j, tempWall, checkedCells) { // Рекурсивный метод по сборке стены
    if (!!level[i][j]) return; // Нужна ли эта проверка на undefined?

    if (level[i][j] == Objects.wall) {
        if (direction == 'right') {
            if (level[i][j + 1] == Objects.wall && level[i][j + 1] != checkedCells[i][j + 1]) { // Если справа стена
                tempWallAdd(tempWall, i, j + 1);
                checkedCells[i][j + 1] = Objects.wall;
                follow(level, 'right', i, j + 1, tempWall, checkedCells);
            } else
                follow(level, 'down', i, j, tempWall, checkedCells);
        }
        if (direction == 'down' && i < Params.CubeSize/Params.CellSize) {
            if (level[i + 1][j] == Objects.wall && level[i + 1][j] != checkedCells[i + 1][j]) { // Если снизу стена
                tempWallAdd(tempWall, i + 1, j);
                checkedCells[i + 1][j] = Objects.wall;
                follow(level, 'down', i + 1, j, tempWall, checkedCells);
                follow(level, 'left', i + 1, j, tempWall, checkedCells);
                follow(level, 'right', i + 1, j, tempWall, checkedCells);
            }
        }
        if (direction == 'left') {
            if (level[i][j - 1] == Objects.wall && level[i][j - 1] != checkedCells[i][j - 1]) { // Если слева стена
                tempWallAdd(tempWall, i, j - 1);
                checkedCells[i][j - 1] = Objects.wall;
                follow(level, 'left', i, j - 1, tempWall, checkedCells);
            } else
                follow(level, 'down', i, j, tempWall, checkedCells);
        }
    }
}

function truncateWall(tempWall) {
    let wall = [];
    for (let i = 0; i < tempWall.length; i++) {
        let count = 0;
        let point = tempWall[i];
        if (checkPointToSkip(tempWall, point.x, point.y + Params.WallSize))
            count++;
        if (checkPointToSkip(tempWall, point.x, point.y - Params.WallSize))
            count++;
        if (checkPointToSkip(tempWall, point.x + Params.WallSize, point.y))
            count++;
        if (checkPointToSkip(tempWall, point.x - Params.WallSize, point.y))
            count++;
        if (count < 4)
            wall.push(tempWall[i]);
    }
    return wall;
}

function checkPointToSkip(tempWall, x, y) { // Пропуск точек внутри фигуры
    return tempWall.some(item => item.x == x && item.y == y);
}

function drawPath(wall) {
    let head = wall[0];
    let shape = new THREE.Shape();
    shape.moveTo(head.x, head.y);
    checkPath(head, wall, shape);
    return shape;
}

function checkPath(head, wall, shape) {
    let top = findPointAround(head.x, head.y + Params.WallSize, wall);
    let right = findPointAround(head.x + Params.WallSize, head.y, wall);
    let left = findPointAround(head.x - Params.WallSize, head.y, wall);
    let down = findPointAround(head.x, head.y - Params.WallSize, wall);

    let pointsAround = [right, down, left, top];
    for (let item of pointsAround) {
        if (!!item) { // Проверка на undefined
            wall.splice(wall.indexOf(item), 1);
            shape.lineTo(item.x, item.y);
            checkPath(item, wall, shape);
            break;
        }
    }
}

function findPointAround(x, y, wall) {
    return wall.find(item => item.x == x && item.y == y);
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