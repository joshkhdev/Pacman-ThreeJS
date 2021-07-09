import * as THREE from './lib/three.module.js';
import { Objects, Params } from './levels.js';
import { Game } from './game.js';
export class Entity {
    cell;
    moveDirection;
    face;
    isMoving;
    posToMove;
    static Size;
    type;
    model;
    constructor(i, j, face) {
        this.cell = { i: (i ? i : 0), j: (j ? j : 0) };
        this.face = face ? face : 'none';
        this.moveDirection = 'none';
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
    calcMoveVector() {
        let x = 0, y = 0, z = 0;
        switch (Game.curLevel) {
            case 'front':
                switch (this.moveDirection) {
                    case 'up':
                        y = 2;
                        break;
                    case 'down':
                        y = -2;
                        break;
                    case 'left':
                        x = -2;
                        break;
                    case 'right':
                        x = 2;
                        break;
                }
                break;
            // TODO: Остальные грани
        }
        return new THREE.Vector3(x, y, z);
    }
    canMove(direction) {
        switch (direction) {
            case 'up':
                if (this.cell.i == 0) {
                    return false;
                }
                else {
                    return this.checkCell(this.cell.i - 1, this.cell.j);
                }
            case 'down':
                if (this.cell.i == Params.CubeSize / Params.CellSize - 1) {
                    return false;
                }
                else {
                    return this.checkCell(this.cell.i + 1, this.cell.j);
                }
            case 'left':
                if (this.cell.j == 0) {
                    return false;
                }
                else {
                    return this.checkCell(this.cell.i, this.cell.j - 1);
                }
            case 'right':
                if (this.cell.j == Params.CubeSize / Params.CellSize - 1) {
                    return false;
                }
                else {
                    return this.checkCell(this.cell.i, this.cell.j + 1);
                }
        }
    }
    rotateX(angle) {
        this.model.rotateX(angle);
    }
    rotateY(angle) {
        this.model.rotateY(angle);
    }
    rotateZ(angle) {
        this.model.rotateZ(angle);
    }
    getNextCellOrNull(direction) {
        switch (direction) {
            case 'up':
                if (this.cell.i == 0) {
                    return null;
                }
                else {
                    return { i: this.cell.i - 1, j: this.cell.j };
                }
            case 'down':
                if (this.cell.i == Params.CubeSize / Params.CellSize - 1) {
                    return null;
                }
                else {
                    return { i: this.cell.i + 1, j: this.cell.j };
                }
            case 'left':
                if (this.cell.j == 0) {
                    return null;
                }
                else {
                    return { i: this.cell.i, j: this.cell.j - 1 };
                }
            case 'right':
                if (this.cell.j == Params.CubeSize / Params.CellSize - 1) {
                    return null;
                }
                else {
                    return { i: this.cell.i, j: this.cell.j + 1 };
                }
        }
    }
}
