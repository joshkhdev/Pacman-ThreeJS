import * as THREE from './lib/three.module.js';
import { Objects, Params } from './levels.js';
import { Game } from './game.js';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export abstract class Entity { // Поменять public на private, создать get/set методы
    public cell: { i: number, j: number };
    public moveDirection: Direction;
    protected face: Direction;
    protected isMoving: boolean;
    public posToMove?: THREE.Vector3;
    public static Size: number;
    public type: Objects;
    protected model: THREE.Group;
    protected constructor(i?: number, j?: number, face?: Direction) {
        this.cell = { i: (i? i : 0), j: (j? j : 0) };
        this.face = face? face : 'none';
        this.moveDirection = 'none';
    }

    protected checkCell(i: number, j: number): boolean { // TODO: Добавить дополнительные игровые условия
        let level = Game.map[Game.curLevel].grid;
        if (level[i][j] == Objects.wall) {
            return false;
        } else {
            return true;
        }   
    }

    public abstract getX(j?: number);
    public abstract getY(i?: number);

    protected calcMoveVector() {
        let x = 0, y = 0, z = 0;
        switch(Game.curLevel)
        {
            case 'front':
                switch(this.moveDirection) {
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

    public canMove(direction: Direction): boolean {
        switch(direction) {
            case 'up':
                if (this.cell.i == 0) {
                    return false;
                } else {
                    return this.checkCell(this.cell.i - 1, this.cell.j);
                }
            case 'down':
                if (this.cell.i == Params.CubeSize / Params.CellSize - 1) {
                    return false;
                } else {
                    return this.checkCell(this.cell.i + 1, this.cell.j);
                }
            case 'left':
                if (this.cell.j == 0) {
                    return false;
                } else {
                    return this.checkCell(this.cell.i, this.cell.j - 1);
                }
            case 'right':
                if (this.cell.j == Params.CubeSize / Params.CellSize - 1) {
                    return false;
                } else {
                    return this.checkCell(this.cell.i, this.cell.j + 1);
                }
        }
    }

    public rotateX(angle){
        this.model.rotateX(angle);
    }
    public rotateY(angle){
        this.model.rotateY(angle);
    }
    public rotateZ(angle){
        this.model.rotateZ(angle);
    }

    public getNextCellOrNull(direction: Direction) {
        switch(direction) {
            case 'up':
                if (this.cell.i  == 0) {
                    return null;
                } else {
                    return { i: this.cell.i - 1, j: this.cell.j };
                }
            case 'down':
                if (this.cell.i == Params.CubeSize / Params.CellSize - 1) {
                    return null;
                } else {
                    return { i: this.cell.i + 1, j: this.cell.j };
                }
            case 'left':
                if (this.cell.j == 0) {
                    return null;
                } else {
                    return { i: this.cell.i, j: this.cell.j - 1 };
                }
            case 'right':
                if (this.cell.j == Params.CubeSize / Params.CellSize - 1) {
                    return null;
                } else {
                    return { i: this.cell.i, j: this.cell.j + 1 };
                }
        }
    }
}