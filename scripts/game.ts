import * as THREE from './three.module.js';
import { Level, MAP, LevelType } from './levels.js';
import { Objects, Params } from './entity.js';
import { Pacman } from './pacman.js';
import { Blinky, Pinky, Inky, Clyde } from './ghosts.js';

class Dot {
    public readonly i: number;
    public readonly j: number;
    private mesh: THREE.Mesh;

    constructor(i: number, j: number, mesh?: THREE.Mesh) {
        this.i = i;
        this.j = j;
        if (!!mesh) this.mesh = mesh; // Проверка на undefined
    }
    public setMesh(mesh: THREE.Mesh) {
        this.mesh = mesh;
    }
    public getMesh() {
        return this.mesh;
    }
    public getX() {
        let delta = Params.CellSize / 2;
	    let radius = Params.CubeSize / 2;
	    let x = this.j * Params.WallSize - (radius - delta);
        return x;
    }
    public getY() {
        let delta = Params.CellSize / 2;
	    let radius = Params.CubeSize / 2;
        let y = -this.i * Params.WallSize + (radius - delta);
        return y;
    }
}

export class Game {
    private curLevel: Level;
    private readonly map: Level[];
    private dotsArray: Dot[];
    private curDot: number; // А нужен ли этот параметр?
    public geometry: any; // А нужен ли этот параметр?
    public dotMaterial: any; // А нужен ли этот параметр?
    public grid: number[][];
    public score: number;
    public scoreText: HTMLElement;

    constructor() {
        this.curLevel = MAP[0];
        this.map = MAP;
        this.dotMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
        this.score = 0;
        this.scoreText = document.getElementById('score');
    }

    public async initGame() {

    }

    public clearScene() {
        this.curDot = null;
        //this.removeDots();
        //NOP_VIEWER.impl.scene.remove(curLevel.pivot.name);
        this.curLevel.dots = [];
        this.curLevel.pivot = null;
    }

    /*public removeDots() {
        NOP_VIEWER.overlays.removeMesh(this.curLevel.pivot, "custom-scene");
        NOP_VIEWER.impl.sceneUpdated(true, false);
    }*/

    public initLevelGrid() {
        for (let i = 0; i < Params.CubeSize/Params.CellSize; i++) {
            this.grid[i] = [];
            this.curLevel.grid[i].forEach(element => {
                this.grid[i].push(element);
            });
        }
    }

    /*public async drawDots() {
        for (const level of MAP) {
            await this.drawLevelDots(level);
        }
    }*/

    /*public async drawLevelDots(level: Level) {
        this.dotsArray = [];
        let pivot = new THREE.Group();
        let side = new THREE.Object3D();
        let dots = this.findObject(Objects.dot, level.grid);
        return new Promise(function (resolve, reject) {
            for (const dot of dots) {
                this.drawDot(dot.i, dot.j);
            }
            for (const dot of this.dotsArray) {
                level.dots.push(dot);
                side.add(dot.mesh);
            }
            pivot.position.set(level.offset.x, level.offset.y, level.offset.z);
            pivot.rotation.setFromVector3(new THREE.Vector3(level.rotation.x, level.rotation.y, level.rotation.z));

            /*NOP_VIEWER.impl.scene.add(pivot);
            pivot.add(side);
            level.pivot = pivot;
            setTimeout(() => {
                NOP_VIEWER.overlays.addMesh(pivot, 'custom-scene');
                NOP_VIEWER.impl.sceneUpdated(true, false);
                resolve();
            }, 500);
        });
    }*/

    /*public drawDot(i: number, j: number) {
        this.geometry = new THREE.SphereGeometry(Params.CellSize - 15, 12, 12);
        let dot = new THREE.Mesh(this.geometry, this.dotMaterial);
        dot.position.set(j * Params.CellSize - (Params.CubeSize - Params.CellSize / 2), - (i) * Params.CellSize + (Params.CubeSize - Params.CellSize / 2), Params.CellSize - 8);
        dot.name = `dot_${this.dotsArray.length}`;
        this.dotsArray.push({
            i: i,
            j: j,
            mesh: dot,
        });
    }*/

    public findObjects(object: Objects, grid: number[][]) {
        let array = [];
        for (let i = 0; i < Params.CubeSize/Params.CellSize; i++)
            for (let j = 0; j < Params.CubeSize/Params.CellSize; j++)
                if (grid[i][j] == object)
                    array.push({ i: i, j: j });
        return array;
    }

    public drawWalls() {
        let levelWalls = [];
        for (let level of this.getMap())
        {
            let walls = this.findObjects(Objects.wall, level.grid); // Поиск всех блоков стен
            let checkedCells = new Array();
            this.clearCheckedCells(checkedCells);
            let tempWall = [];
            let wallMeshes = [];
            for (let block of walls) // Обход по каждому блоку стены
            {
                let i = block.i; let j = block.j;
                if (level.grid[i][j] != checkedCells[i][j]) {
                    checkedCells[i][j] = Objects.wall;
                    this.tempWallAdd(tempWall, i, j);
                    //this.follow(level.grid, 'left', i, j, tempWall, checkedCells); // Не работает
                    //this.follow(level.grid, 'right', i, j, tempWall, checkedCells); // Не работает
    
                    let wall = this.truncateWall(tempWall);
                    tempWall = [];
                    let shape = this.drawPath(wall);
                    let extrudeSettings = {
                        steps: 1,
                        depth: Params.Depth,
                        bevelEnabled: false,
                    };
                    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    let wallMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: level.color, }));
                    wallMesh.position.set(level.offset.x, level.offset.y, level.offset.z);
                    wallMesh.rotation.setFromVector3(new THREE.Vector3(level.rotation.x, level.rotation.y, level.rotation.z));
                    wallMeshes.push(wallMesh);
                }
            }
            levelWalls.push(wallMeshes);
        }
        return levelWalls;
    }
    
    public clearCheckedCells(checkedCells) {
        for (let i = 0; i < Params.Rows; i++)
            checkedCells[i] = new Array();
    }
    
    private tempWallAdd(tempWall, i, j) {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let center = { x: j * Params.WallSize - (radius - delta), y: -i * Params.WallSize + (radius - delta)}
        tempWall.push({ x: center.x - delta, y: center.y + delta }); // left top 
        tempWall.push({ x: center.x + delta, y: center.y + delta }); // right top 
        tempWall.push({ x: center.x + delta, y: center.y - delta }); // right bottom
        tempWall.push({ x: center.x - delta, y: center.y - delta }); // left bottom
    }
    
    private follow(level, direction, i, j, tempWall, checkedCells) { // Рекурсивный метод по сборке стены
        if (level[i][j] == Objects.wall) {
            switch (direction) {
                case 'right':
                    if (j + 1 < Params.CubeSize / Params.CellSize)
                    {
                        if (level[i][j + 1] == Objects.wall && level[i][j + 1] != checkedCells[i][j + 1]) { // Если справа стена
                            this.tempWallAdd(tempWall, i, j + 1);
                            checkedCells[i][j + 1] = Objects.wall;
                            this.follow(level, 'right', i, j + 1, tempWall, checkedCells);
                        } else
                            this.follow(level, 'down', i, j, tempWall, checkedCells);
                    }
                    break;
                case 'down':
                    if (i + 1 < Params.CubeSize / Params.CellSize)
                    {
                        if (level[i + 1][j] == Objects.wall && level[i + 1][j] != checkedCells[i + 1][j]) { // Если снизу стена
                            this.tempWallAdd(tempWall, i + 1, j);
                            checkedCells[i + 1][j] = Objects.wall;
                            this.follow(level, 'left', i + 1, j, tempWall, checkedCells);
                            this.follow(level, 'down', i + 1, j, tempWall, checkedCells);
                            this.follow(level, 'right', i + 1, j, tempWall, checkedCells);  
                        }
                    }
                    break;
                case 'left':
                    if (j - 1 >= 0)
                    {
                        if (level[i][j - 1] == Objects.wall && level[i][j - 1] != checkedCells[i][j - 1]) { // Если слева стена
                            this.tempWallAdd(tempWall, i, j - 1);
                            checkedCells[i][j - 1] = Objects.wall;
                            this.follow(level, 'left', i, j - 1, tempWall, checkedCells);
                        } else
                            this.follow(level, 'down', i, j, tempWall, checkedCells);
                    }
                    break;
            }
        }
    }
    
    private truncateWall(tempWall) {
        let wall = [];
        for (let i = 0; i < tempWall.length; i++) {
            let count = 0;
            let point = tempWall[i];
            if (this.checkPointToSkip(tempWall, point.x, point.y + Params.WallSize))
                count++;
            if (this.checkPointToSkip(tempWall, point.x, point.y - Params.WallSize))
                count++;
            if (this.checkPointToSkip(tempWall, point.x + Params.WallSize, point.y))
                count++;
            if (this.checkPointToSkip(tempWall, point.x - Params.WallSize, point.y))
                count++;
            if (count < 4)
                wall.push(tempWall[i]);
        }
        return wall;
    }
    
    private checkPointToSkip(tempWall, x, y) { // Пропуск точек внутри фигуры
        return tempWall.some(item => item.x == x && item.y == y);
    }
    
    public drawPath(wall) {
        let head = wall[0];
        let shape = new THREE.Shape();
        shape.moveTo(head.x, head.y);
        this.checkPath(head, wall, shape);
        return shape;
    }
    
    public checkPath(head, wall, shape) {
        let top = this.findPointAround(head.x, head.y + Params.WallSize, wall);
        let right = this.findPointAround(head.x + Params.WallSize, head.y, wall);
        let left = this.findPointAround(head.x - Params.WallSize, head.y, wall);
        let down = this.findPointAround(head.x, head.y - Params.WallSize, wall);
    
        let pointsAround = [right, down, left, top];
        for (let item of pointsAround) {
            if (!!item) { // Проверка на undefined
                wall.splice(wall.indexOf(item), 1);
                shape.lineTo(item.x, item.y);
                this.checkPath(item, wall, shape);
                break;
            }
        }
    }
    
    public findPointAround(x, y, wall) {
        return wall.find(item => item.x == x && item.y == y);
    }


    // Get и Set методы
    public getLevel() {
        return this.curLevel;
    }
    public setLevel(level: Level) {
        this.curLevel = level;
    }
    /*public setLevel(level: LevelType) { // TODO: Переход на другой уровень
        this.switchLevel();
    }*/
    public getMap() {
        return this.map;
    }
    public getDotsArray() {
        return this.dotsArray;
    }
    public setDotsArray(dots: Dot[]) {
        this.dotsArray = [];
        for (let dot of dots) {
            this.dotsArray.push(dot);
        }
    }    
}
