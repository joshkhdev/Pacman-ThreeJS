import * as THREE from './lib/three.module.js';
import { Objects, Params } from './levels.js';
import { Entity } from './entity.js';
import { Game } from './game.js';
const PxInterval = 8;
const StepInterval = 160;
export class Pacman extends Entity {
    spawnCell;
    timer;
    stepTimer;
    constructor(i, j, face) {
        super((i ? i : 0), (j ? j : 0), (face ? face : 'right'));
        Pacman.Size = 10;
        this.type = Objects.pacman;
    }
    getX(j) {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let x = (j ? j : this.cell.j) * Params.CellSize - (radius - delta);
        return x;
    }
    getY(i) {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
        let y = -(i ? i : this.cell.i) * Params.CellSize + (radius - delta);
        return y;
    }
    setModel(scene) {
        this.model = scene;
    }
    getModel() {
        return this.model;
    }
    startMovement(direction) {
        if (this.moveDirection == direction)
            return;
        if (!this.canMove(direction))
            return;
        if (this.isMoving) {
            // TODO: Починить повороты
        }
        //console.log(`Moving ${direction}`);
        this.faceDirecton(direction);
        this.moveDirection = direction;
        clearInterval(this.timer);
        this.timer = null;
        this.timer = setInterval(() => {
            this.step();
            if (!this.canMove(direction))
                clearInterval(this.timer);
        }, StepInterval);
    }
    async step() {
        let desIndex = { i: this.cell.i, j: this.cell.j };
        switch (this.moveDirection) {
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
        //let des = Game.getPointOnPlane(desIndex.i, desIndex.j, Game.curLevel);
        let delta = this.calcMoveVector();
        this.isMoving = true;
        delta.multiplyScalar(Params.CellSize / 2);
        pos.add(delta);
        /*clearTimeout(this.stepTimer);
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
                
        }, PxInterval);*/
        this.eatDot();
        this.cell = desIndex;
    }
    /*public override canMove(direction: Direction): boolean { // TODO: Телепорт
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
    }*/
    eatDot() {
        let predicate = dot => {
            return (dot.i == this.cell.i) && (dot.j == this.cell.j);
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
    faceDirecton(direction) {
        let vector = this.calcModelRotation(direction);
        vector.x ? this.model.rotateX(vector.x) : {};
        vector.y ? this.model.rotateY(vector.y) : {};
        vector.z ? this.model.rotateY(vector.z) : {};
    }
    calcModelRotation(direction) {
        let x = 0, y = 0, z = 0;
        switch (Game.curLevel) {
            case 'front':
                switch (direction) {
                    case 'up':
                        if (this.face == 'right')
                            x = Math.PI / 2;
                        if (this.face == 'left')
                            x = -Math.PI / 2;
                        if (this.face == 'down')
                            x = Math.PI;
                        break;
                    case 'down':
                        if (this.face == 'right')
                            x = -Math.PI / 2;
                        if (this.face == 'left')
                            x = Math.PI / 2;
                        if (this.face == 'up')
                            x = Math.PI;
                        break;
                    case 'left':
                        if (this.face == 'right')
                            x = Math.PI;
                        if (this.face == 'up')
                            x = Math.PI / 2;
                        if (this.face == 'down')
                            x = -Math.PI / 2;
                        break;
                    case 'right':
                        if (this.face == 'left')
                            x = Math.PI;
                        if (this.face == 'up')
                            x = -Math.PI / 2;
                        if (this.face == 'down')
                            x = Math.PI / 2;
                        break;
                }
                break;
            // TODO: Остальные грани
        }
        this.face = direction;
        return new THREE.Vector3(x, y, z);
    }
}
