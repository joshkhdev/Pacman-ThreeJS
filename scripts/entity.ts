import * as THREE from './lib/three.module.js';
import { Objects, Params } from './levels.js';
import { Game } from './game.js';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const PxInterval = 8;
const StepInterval = 160;

interface Cell {
    i: number,
    j: number
}

export abstract class Entity { // Поменять public на private, создать get/set методы
    public cell: Cell;
    protected moveDirection: Direction;
    protected face: Direction;
    protected isMoving: boolean;
    public posToMove?: THREE.Vector3;
    public static Size: number;
    public type: Objects;
    private timer: any;
    private stepTimer: any;
    protected model: THREE.Group;
    protected constructor(i?: number, j?: number, face?: Direction) {
        this.cell = { i: (i? i : 0), j: (j? j : 0) };
        this.face = face? face : 'none';
        this.moveDirection = 'none';
    }

    public startMovement(direction: Direction) {
        if (this.moveDirection == direction)
            return;
        if (!this.canMove(direction))
            return;
        if (this.isMoving) {
            // TODO: Починить повороты
        } 
        console.log(`Moving ${direction}`);
        if (this.type == Objects.pacman)
            this.faceDirecton(direction);
        this.moveDirection = direction;
        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(async () => {
            await this.step();
            if (!this.canMove(direction))
                clearInterval(this.timer);
        }, StepInterval);
    }

    private async step() { // TODO: Починить повороты
        let desIndex = { i: this.cell.i, j: this.cell.j };
        
        switch(this.moveDirection) {
            case 'up':
                desIndex.i -= 1;
                break;
            case 'down':
                desIndex.i += 1;
                break;
            case 'left':
                desIndex.j -= 1;
                break;
            case 'right':
                desIndex.j += 1;
                break;
        }
        let pos = this.model.position;
        let des = this.getPointOnPlane(desIndex.i, desIndex.j);
        let delta = this.calcMoveVector();

        this.isMoving = true;

        clearTimeout(this.stepTimer);
        this.stepTimer = null;
        this.stepTimer = setTimeout(function run() {
            pos.add(delta);
            if (!pos.equals(des)) {
                clearTimeout(this.stepTimer);
                this.stepTimer = setTimeout(run, PxInterval);
            } else {
                clearTimeout(this.stepTimer);
                this.isMoving = false;
            }
                
        }, PxInterval);

        if (this.type == Objects.pacman)
            this.eatDot();

        this.cell = desIndex;
    }

    public canMove(direction: Direction): boolean {
        switch(direction) {
            case 'up':
                if (this.cell.i == 0) {
                    return false; // TODO: Телепорт на другую грань
                } else {
                    return this.checkCell(this.cell.i - 1, this.cell.j);
                }
            case 'down':
                if (this.cell.i == Params.CubeSize / Params.CellSize - 1) {
                    return false; // TODO: Телепорт на другую грань
                } else {
                    return this.checkCell(this.cell.i + 1, this.cell.j);
                }
            case 'left':
                if (this.cell.j == 0) {
                    return false; // TODO: Телепорт на другую грань
                } else {
                    return this.checkCell(this.cell.i, this.cell.j - 1);
                }
            case 'right':
                if (this.cell.j == Params.CubeSize / Params.CellSize - 1) {
                    return false; // TODO: Телепорт на другую грань
                } else {
                    return this.checkCell(this.cell.i, this.cell.j + 1);
                }
        }
    }

    protected checkCell(i: number, j: number): boolean { // TODO: Добавить дополнительные игровые условия
        let level = Game.map[Game.curLevel].grid;
        if (level[i][j] == Objects.wall) {
            return false;
        } else {
            return true;
        }   
    }

    private eatDot() {
        let predicate = dot => {
            return (dot.i == this.cell.i) && (dot.j == this.cell.j)
        };
        let dot = Game.levelDots[Game.curLevel].filter(predicate)[0];
        if (dot) {
            let index = Game.levelDots[Game.curLevel].indexOf(dot);
            Game.levelDots[Game.curLevel].splice(index, 1);
            dot.mesh.visible = false;
            dot.mesh = null;
            Game.eat(dot.type);
        }
    }

    /*public stopMovement(x: number, y: number, grid: number[][]) { // А нужны ли тут параметры?
        //clearInterval(this.moveInterval);
        //cancelAnimationFrame(this.reqMove);
        //this.moveInterval = null;
        //this.reqMove = null;
        //this.movement = { x: 0, y: 0 };
        //this.moveDirection = 'none';
        this.posToMove = null;
    }*/

    public abstract getX(j?: number);
    public abstract getY(i?: number);

    public faceDirecton(direction: Direction): void {
        let vector = this.calcMoveRotation(direction);
        vector.x ? this.model.rotateX(vector.x) : {};
        vector.y ? this.model.rotateY(vector.y) : {};
        vector.z ? this.model.rotateY(vector.z) : {};
        //this.model.rotation.set(this.model.rotation.x + vector.x, this.model.rotation.y + vector.y, this.model.rotation.z + vector.z);
    }

    private calcMoveRotation(direction: Direction) {
        let x = 0, y = 0, z = 0;
        switch(Game.curLevel)
        {
            case 'front':
                switch(direction) {
                    case 'up':
                        if (this.face == 'right')
                            x = Math.PI/2;
                        if (this.face == 'left')
                            x = -Math.PI/2;
                        if (this.face == 'down')
                            x = Math.PI;
                        break;
                    case 'down':
                        if (this.face == 'right')
                            x = -Math.PI/2;
                        if (this.face == 'left')
                            x = Math.PI/2;
                        if (this.face == 'up')
                            x = Math.PI;
                        break;
                    case 'left':
                        if (this.face == 'right')
                            x = Math.PI;
                        if (this.face == 'up')
                            x = Math.PI/2;
                        if (this.face == 'down')
                            x = -Math.PI/2;
                        break;
                    case 'right':
                        if (this.face == 'left')
                            x = Math.PI;
                        if (this.face== 'up')
                            x = -Math.PI/2;
                        if (this.face == 'down')
                            x = Math.PI/2;
                        break;
                }
                break;
            // TODO: Остальные грани
        }
        this.face = direction;
        return new THREE.Vector3(x, y, z);
    }

    private calcMoveVector() {
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

    public rotateX(angle){
        this.model.rotateX(angle);
    }
    public rotateY(angle){
        this.model.rotateY(angle);
    }
    public rotateZ(angle){
        this.model.rotateZ(angle);
    }

    private getPointOnPlane(i: number, j: number) {
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