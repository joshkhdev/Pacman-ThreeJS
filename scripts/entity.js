import * as THREE from './lib/three.module.js';
import { Game } from './game.js';
export const Params = {
    CellSize: 20,
    CubeSize: 500,
    WallSize: 18,
    Depth: 20,
    Rows: 25,
    Cols: 25
};
export var Objects;
(function (Objects) {
    Objects[Objects["blank"] = 0] = "blank";
    Objects[Objects["wall"] = 1] = "wall";
    //dynwall,
    //spawnwall,
    Objects[Objects["dot"] = 2] = "dot";
    Objects[Objects["cherry"] = 3] = "cherry";
    Objects[Objects["powerup"] = 4] = "powerup";
    Objects[Objects["pacman"] = 5] = "pacman";
    Objects[Objects["blinky"] = 6] = "blinky";
    Objects[Objects["pinky"] = 7] = "pinky";
    Objects[Objects["inky"] = 8] = "inky";
    Objects[Objects["clyde"] = 9] = "clyde"; // 9
})(Objects || (Objects = {}));
export class Entity {
    cell;
    moveDirection;
    //public movement: { x: number, y: number }; // Непонятно, почему "движение" это X и Y
    //public moveInterval?: any;
    //public reqMove?: any;
    //public animationTime: number; // Если это tween.js - рассмотреть удаление/замену
    posToMove;
    static Size;
    type;
    timer;
    model;
    constructor(i, j, direction) {
        this.cell = { i: (i ? i : 0), j: (j ? j : 0) };
        this.moveDirection = direction ? direction : 'none';
        //this.movement = { x: 0, y: 0 };
    }
    startMovement(direction) {
        if (!this.canMove(direction)) {
            return;
        }
        else {
            console.log(`Moving ${direction}`);
            this.moveDirection = direction;
            clearInterval(this.timer);
            this.timer = null;
            this.timer = setInterval(() => {
                this.step();
                if (!this.canMove(direction))
                    clearInterval(this.timer);
            }, 100);
        }
    }
    step() {
        switch (this.moveDirection) {
            case 'up':
                this.cell.i -= 1;
                break;
            case 'down':
                this.cell.i += 1;
                break;
            case 'left':
                this.cell.j -= 1;
                break;
            case 'right':
                this.cell.j += 1;
                break;
        }
        //let pos = this.model.position;
        //this.model.position.set(pos.x, pos.y, pos.z);
        let point = this.getPointOnPlane(this.cell.i, this.cell.j); // TODO: Заменить пересчет позиции на прирост координаты в сторону движения
        this.model.position.set(point.x, point.y, point.z);
    }
    canMove(direction) {
        switch (direction) {
            case 'up':
                if (this.cell.i == 0) {
                    return false; // TODO: Телепорт на другую грань
                }
                else {
                    return this.checkCell(this.cell.i - 1, this.cell.j);
                }
            case 'down':
                if (this.cell.i == Params.CubeSize / Params.CellSize - 1) {
                    return false; // TODO: Телепорт на другую грань
                }
                else {
                    return this.checkCell(this.cell.i + 1, this.cell.j);
                }
            case 'left':
                if (this.cell.j == 0) {
                    return false; // TODO: Телепорт на другую грань
                }
                else {
                    return this.checkCell(this.cell.i, this.cell.j - 1);
                }
            case 'right':
                if (this.cell.j == Params.CubeSize / Params.CellSize - 1) {
                    return false; // TODO: Телепорт на другую грань
                }
                else {
                    return this.checkCell(this.cell.i, this.cell.j + 1);
                }
        }
    }
    checkCell(i, j) {
        let level = Game.map[Game.curLevel].grid;
        if (level[i][j] == Objects.wall) {
            return false;
        }
        else {
            return true;
        }
    }
    /*public canMove(x: number, y: number, grid: number[][]) {
        let i = this.cell.i - y; let j = this.cell.j + x;
        if ((i >= 0 && i < Params.CubeSize/Params.CellSize) && (j >= 0 && j < Params.CubeSize/Params.CellSize))
            return grid[i][j] == Objects.blank || grid[i][j] == Objects.dot
    }*/
    stopMovement(x, y, grid) {
        //clearInterval(this.moveInterval);
        //cancelAnimationFrame(this.reqMove);
        //this.moveInterval = null;
        //this.reqMove = null;
        //this.movement = { x: 0, y: 0 };
        //this.moveDirection = 'none';
        this.posToMove = null;
    }
    /*public step(x: number, y: number) {
        this.movement.x = x;
        this.movement.y = y;
        this.posToMove = this.mesh.position.clone(); // ?
        this.posToMove = new THREE.Vector3(this.posToMove.x + x * Params.CellSize, this.posToMove.y + y * Params.CellSize, this.posToMove.z);
    }*/
    //public abstract updateCell(grid: number[][]);
    rotateX(angle) {
        this.model.rotateX(angle);
    }
    rotateY(angle) {
        this.model.rotateY(angle);
    }
    rotateZ(angle) {
        this.model.rotateZ(angle);
    }
    getPointOnPlane(i, j) {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let x = j * Params.CellSize - (radius - delta);
        let y = -i * Params.CellSize + (radius - delta);
        let vector = new THREE.Vector3(x + Game.map[Game.curLevel].offset.x, y + Game.map[Game.curLevel].offset.y, Params.Depth / 2 + Game.map[Game.curLevel].offset.z);
        let euler = new THREE.Euler(Game.map[Game.curLevel].rotation.x, Game.map[Game.curLevel].rotation.y, Game.map[Game.curLevel].rotation.z);
        vector.applyEuler(euler);
        return vector;
    }
}
