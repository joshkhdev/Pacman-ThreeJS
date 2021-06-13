import * as THREE from './lib/three.module.js';
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
    Objects[Objects["dynwall"] = 2] = "dynwall";
    Objects[Objects["spawnwall"] = 3] = "spawnwall";
    Objects[Objects["dot"] = 4] = "dot";
    Objects[Objects["pacman"] = 5] = "pacman";
    Objects[Objects["blinky"] = 6] = "blinky";
    Objects[Objects["pinky"] = 7] = "pinky";
    Objects[Objects["inky"] = 8] = "inky";
    Objects[Objects["clyde"] = 9] = "clyde";
})(Objects || (Objects = {}));
export class Entity {
    cell;
    movement; // Непонятно, почему "движение" это X и Y
    moveDirection;
    moveInterval;
    reqMove;
    posToMove;
    material;
    size;
    animationTime; // Если это tween.js - рассмотреть удаление/замену
    mesh;
    type;
    constructor() {
        this.cell = { i: 0, j: 0 };
        this.movement = { x: 0, y: 0 };
        this.moveDirection = 'none';
    }
    stopMovement(x, y, grid) {
        clearInterval(this.moveInterval);
        cancelAnimationFrame(this.reqMove);
        this.moveInterval = null;
        this.reqMove = null;
        this.movement = { x: 0, y: 0 };
        this.moveDirection = 'none';
        this.posToMove = null;
    }
    canMove(x, y, grid) {
        let i = this.cell.i - y;
        let j = this.cell.j + x;
        if ((i >= 0 && i < Params.CubeSize / Params.CellSize) && (j >= 0 && j < Params.CubeSize / Params.CellSize))
            return grid[i][j] == Objects.blank || grid[i][j] == Objects.dot;
    }
    step(x, y) {
        this.movement.x = x;
        this.movement.y = y;
        this.posToMove = this.mesh.position.clone(); // ?
        this.posToMove = new THREE.Vector3(this.posToMove.x + x * Params.CellSize, this.posToMove.y + y * Params.CellSize, this.posToMove.z);
    }
}
