import * as THREE from './lib/three.module.js';
import { MAP } from './levels.js';
import { Objects, Params } from './entity.js';
import { Pacman } from './pacman.js';
class Dot {
    static Size = 5;
    i;
    j;
    mesh;
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.setMesh();
    }
    setMesh() {
        let sphere = new THREE.SphereGeometry(Dot.Size, Dot.Size, Dot.Size);
        let material = new THREE.MeshBasicMaterial({ color: '#fafafa' });
        this.mesh = new THREE.Mesh(sphere, material);
        this.mesh.position.set(this.getX(), this.getY(), 0);
    }
    getX() {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let x = this.j * Params.CellSize - (radius - delta);
        return x;
    }
    getY() {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let y = -this.i * Params.CellSize + (radius - delta);
        return y;
    }
}
class Cherry extends Dot {
    static Length = 5; // x
    static Height = 15; // y
    static Width = 15; // z
    constructor(i, j) {
        super(i, j);
        this.setMesh();
    }
    setMesh() {
        let cherry_geometry = new THREE.SphereGeometry(Cherry.Length, Cherry.Height, Cherry.Width);
        let cherry_material = new THREE.MeshBasicMaterial({ color: "#991c1c" });
        let cherry1 = new THREE.Mesh(cherry_geometry, cherry_material);
        let cherry2 = new THREE.Mesh(cherry_geometry, cherry_material);
        cherry2.position.set(9, 5, 0); // ?
        let points1 = [];
        points1.push(new THREE.Vector3(0, Cherry.Length - 1, 0));
        points1.push(new THREE.Vector3(0, Cherry.Height - 1, 0));
        let pick_geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
        let pick_material = new THREE.LineBasicMaterial({ color: '#35a12d', linewidth: 5 });
        let pick1 = new THREE.Line(pick_geometry1, pick_material);
        cherry1.add(pick1);
        let curve = new THREE.EllipseCurve(0, 10, 8, 9.5, 3.5, -2.32 * Math.PI, false, 1);
        let points2 = curve.getPoints(50);
        let pick_geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        let pick2 = new THREE.Line(pick_geometry2, pick_material);
        pick2.rotateY(Math.PI);
        pick2.rotateX(2 * Math.PI);
        cherry2.add(pick2);
        cherry1.add(cherry2);
        this.mesh = cherry1;
        this.mesh.position.set(this.getX(), this.getY(), 0);
    }
    getX() {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let x = this.j * Params.CellSize - (radius - delta) - Cherry.Length * 0.8;
        return x;
    }
    getY() {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let y = -this.i * Params.CellSize + (radius - delta) - Cherry.Height / 3;
        return y;
    }
}
export class Game {
    curLevel;
    map;
    levels;
    score;
    scoreText;
    pacman;
    constructor() {
        this.curLevel = 'front';
        this.map = MAP;
        this.score = 0;
        this.scoreText = document.getElementById('score');
        this.setLevels();
    }
    startGame() {
        // TODO
    }
    restartGame() {
        // TODO
    }
    findObjects(object, grid) {
        let array = [];
        for (let i = 0; i < Params.CubeSize / Params.CellSize; i++)
            for (let j = 0; j < Params.CubeSize / Params.CellSize; j++)
                if (grid[i][j] == object)
                    array.push({ i: i, j: j });
        return array;
    }
    drawPacman(geometry) {
        this.pacman = new Pacman();
        // создание mesh (модели) пакмана
        let material = new THREE.MeshBasicMaterial({ color: 0xffff33 });
        let pacman = new THREE.Mesh(geometry, material);
        pacman.scale.set(Pacman.Size, Pacman.Size, Pacman.Size);
        pacman.rotateY(-Math.PI / 2);
        pacman.position.set(0, 0, Params.CubeSize / 2 + Pacman.Size);
        // создание контура для пакмана
        let curve = new THREE.EllipseCurve(0, 0, 1, 1, 2.15, -2.32 * Math.PI, false, 1);
        let points = curve.getPoints(50);
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: '#000000' });
        let ellipse = new THREE.Line(geometry, material);
        ellipse.rotateY(Math.PI);
        ellipse.rotateX(7 / 4 * Math.PI);
        let ellipse2 = new THREE.Line(geometry, material);
        ellipse2.rotateY(-2 * Math.PI);
        ellipse2.rotateX(3 / 4 * Math.PI);
        pacman.add(ellipse);
        pacman.add(ellipse2);
        material = new THREE.LineBasicMaterial({ color: '#000000' });
        points = [];
        points.push(new THREE.Vector3(-1.01, 0, -0.02));
        points.push(new THREE.Vector3(1.01, 0, -0.02));
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        var line = new THREE.Line(geometry, material);
        pacman.add(line);
        return pacman;
    }
    drawDots() {
        let dots = [];
        let levelDots = [];
        for (let level of this.levels) {
            let indexes = this.findObjects(Objects.dot, level.grid); // Поиск всех единиц еды
            for (let index of indexes) {
                let dot = new Dot(index.i, index.j);
                dots.push(dot);
            }
            levelDots.push({ dots: dots, name: level.name });
            dots = [];
        }
        return levelDots;
    }
    drawCherries() {
        let cherries = [];
        let levelCherries = [];
        for (let level of this.levels) {
            let indexes = this.findObjects(Objects.cherry, level.grid); // Поиск всех единиц еды
            for (let index of indexes) {
                let cherry = new Cherry(index.i, index.j);
                cherries.push(cherry);
            }
            levelCherries.push({ cherries: cherries, name: level.name });
            cherries = [];
        }
        return levelCherries;
    }
    drawWalls() {
        let levelWalls = [];
        for (let level of this.levels) {
            let walls = this.findObjects(Objects.wall, level.grid); // Поиск всех блоков стен
            let checkedCells = [];
            this.clearCheckedCells(checkedCells);
            let wallMeshes = [];
            let tempWall = [];
            for (let block of walls) // Обход по каждому блоку стены
             {
                let i = block.i;
                let j = block.j;
                if (level.grid[i][j] != checkedCells[i][j]) {
                    checkedCells[i][j] = Objects.wall;
                    this.tempWallAdd(tempWall, i, j);
                    this.follow(level.grid, 'left', i, j, tempWall, checkedCells);
                    this.follow(level.grid, 'right', i, j, tempWall, checkedCells);
                    let wall = this.truncateWall(tempWall);
                    tempWall = [];
                    let shape = this.drawPath(wall);
                    let extrudeSettings = {
                        steps: 1,
                        depth: Params.Depth,
                        bevelEnabled: false,
                    };
                    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    let material = new THREE.MeshBasicMaterial({ color: level.color });
                    let wallMesh = new THREE.Mesh(geometry, material);
                    wallMesh.position.set(level.offset.x, level.offset.y, level.offset.z);
                    wallMesh.rotation.setFromVector3(new THREE.Vector3(level.rotation.x, level.rotation.y, level.rotation.z));
                    wallMeshes.push(wallMesh);
                }
            }
            levelWalls.push(wallMeshes);
        }
        return levelWalls;
    }
    clearCheckedCells(checkedCells) {
        for (let i = 0; i < Params.Rows; i++)
            checkedCells[i] = [];
    }
    tempWallAdd(tempWall, i, j) {
        let cellDelta = Params.CellSize / 2;
        let wallDelta = Params.WallSize / 2;
        let radius = Params.CubeSize / 2;
        let center = { x: j * Params.CellSize - (radius - cellDelta), y: -i * Params.CellSize + (radius - cellDelta) };
        tempWall.push({ x: center.x - wallDelta, y: center.y + wallDelta }); // left top 
        tempWall.push({ x: center.x + wallDelta, y: center.y + wallDelta }); // right top 
        tempWall.push({ x: center.x + wallDelta, y: center.y - wallDelta }); // right bottom
        tempWall.push({ x: center.x - wallDelta, y: center.y - wallDelta }); // left bottom
    }
    follow(level, direction, i, j, tempWall, checkedCells) {
        if (level[i][j] == Objects.wall) {
            switch (direction) {
                case 'right':
                    if (j + 1 < Params.CubeSize / Params.CellSize) {
                        if (level[i][j + 1] == Objects.wall && level[i][j + 1] != checkedCells[i][j + 1]) { // Если справа стена
                            this.tempWallAdd(tempWall, i, j + 1);
                            checkedCells[i][j + 1] = Objects.wall;
                            this.follow(level, 'right', i, j + 1, tempWall, checkedCells);
                        }
                        else {
                            this.follow(level, 'down', i, j, tempWall, checkedCells);
                        }
                    }
                    break;
                case 'left':
                    if (j - 1 >= 0) {
                        if (level[i][j - 1] == Objects.wall && level[i][j - 1] != checkedCells[i][j - 1]) { // Если слева стена
                            this.tempWallAdd(tempWall, i, j - 1);
                            checkedCells[i][j - 1] = Objects.wall;
                            this.follow(level, 'left', i, j - 1, tempWall, checkedCells);
                        }
                        else {
                            this.follow(level, 'down', i, j, tempWall, checkedCells);
                        }
                    }
                    break;
                case 'down':
                    if (i + 1 < Params.CubeSize / Params.CellSize) {
                        if (level[i + 1][j] == Objects.wall && level[i + 1][j] != checkedCells[i + 1][j]) { // Если снизу стена
                            this.tempWallAdd(tempWall, i + 1, j);
                            checkedCells[i + 1][j] = Objects.wall;
                            this.follow(level, 'down', i + 1, j, tempWall, checkedCells);
                            this.follow(level, 'left', i + 1, j, tempWall, checkedCells);
                            this.follow(level, 'right', i + 1, j, tempWall, checkedCells);
                        }
                    }
                    break;
                case 'up': // TODO: FIX
                    if (i - 1 >= 0) {
                        if (level[i - 1][j] == Objects.wall && level[i - 1][j] != checkedCells[i - 1][j]) { // Если сверху стена
                            this.tempWallAdd(tempWall, i - 1, j);
                            checkedCells[i - 1][j] = Objects.wall;
                            this.follow(level, 'up', i - 1, j, tempWall, checkedCells);
                            this.follow(level, 'right', i - 1, j, tempWall, checkedCells);
                            this.follow(level, 'left', i - 1, j, tempWall, checkedCells);
                        }
                    }
                    break;
            }
        }
    }
    findObjectsAround(level, i, j, object) {
        let result = [];
        // left
        if (j - 1 >= 0)
            if (level[i][j - 1] == object)
                result.push('left');
        // right
        if (j + 1 < Params.CubeSize / Params.CellSize)
            if (level[i][j + 1] == object)
                result.push('right');
        // up
        if (i - 1 >= 0)
            if (level[i - 1][j] == object)
                result.push('up');
        // down
        if (i + 1 < Params.CubeSize / Params.CellSize)
            if (level[i + 1][j] == object)
                result.push('down');
        return result;
    }
    truncateWall(tempWall) {
        let wall = [];
        for (let i = 0; i < tempWall.length; i++) {
            let count = 0;
            let point = tempWall[i];
            let gap = Params.CellSize - Params.WallSize;
            let top = this.checkPointToSkip(tempWall, point.x, point.y + Params.WallSize) || this.checkPointToSkip(tempWall, point.x, point.y + gap);
            let bottom = this.checkPointToSkip(tempWall, point.x, point.y - Params.WallSize) || this.checkPointToSkip(tempWall, point.x, point.y - gap);
            let right = this.checkPointToSkip(tempWall, point.x + Params.WallSize, point.y) || this.checkPointToSkip(tempWall, point.x + gap, point.y);
            let left = this.checkPointToSkip(tempWall, point.x - Params.WallSize, point.y) || this.checkPointToSkip(tempWall, point.x - gap, point.y);
            let corners = this.checkPointToSkip(tempWall, point.x - gap, point.y + gap) ||
                this.checkPointToSkip(tempWall, point.x + gap, point.y + gap) ||
                this.checkPointToSkip(tempWall, point.x + gap, point.y - gap) ||
                this.checkPointToSkip(tempWall, point.x - gap, point.y - gap);
            if (top)
                count++;
            if (bottom)
                count++;
            if (right)
                count++;
            if (left)
                count++;
            if (corners)
                count++;
            if (count < 5)
                wall.push(tempWall[i]);
        }
        return wall;
    }
    checkPointToSkip(tempWall, x, y) {
        return tempWall.some(item => item.x == x && item.y == y);
    }
    drawPath(wall) {
        let head = wall[0];
        let shape = new THREE.Shape();
        shape.moveTo(head.x, head.y);
        this.checkPath(head, wall, shape);
        return shape;
    }
    checkPath(head, wall, shape) {
        let topC = this.findPointAround(head.x, head.y + (Params.CellSize - Params.WallSize), wall);
        let topW = this.findPointAround(head.x, head.y + Params.WallSize, wall);
        let rightC = this.findPointAround(head.x + (Params.CellSize - Params.WallSize), head.y, wall);
        let rightW = this.findPointAround(head.x + Params.WallSize, head.y, wall);
        let leftC = this.findPointAround(head.x - (Params.CellSize - Params.WallSize), head.y, wall);
        let leftW = this.findPointAround(head.x - Params.WallSize, head.y, wall);
        let downC = this.findPointAround(head.x, head.y - (Params.CellSize - Params.WallSize), wall);
        let downW = this.findPointAround(head.x, head.y - Params.WallSize, wall);
        let pointsAround = [rightC, rightW, downC, downW, leftC, leftW, topC, topW];
        for (let item of pointsAround) {
            if (!!item) { // Проверка на undefined
                wall.splice(wall.indexOf(item), 1);
                shape.lineTo(item.x, item.y);
                this.checkPath(item, wall, shape);
                break;
            }
        }
    }
    findPointAround(x, y, wall) {
        return wall.find(item => item.x == x && item.y == y);
    }
    // Get и Set методы
    getLevel() {
        return this.curLevel;
    }
    setLevel(level) {
        this.curLevel = level;
    }
    /*public setLevel(level: LevelType) {
        this.switchLevel(); // TODO: Переход на другой уровень
    }*/
    getLevels() {
        return this.levels;
    }
    setLevels() {
        this.levels = [];
        this.levels.push(this.map['front']);
        this.levels.push(this.map['back']);
        this.levels.push(this.map['right']);
        this.levels.push(this.map['left']);
        this.levels.push(this.map['top']);
        this.levels.push(this.map['bottom']);
    }
}
