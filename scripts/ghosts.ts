import * as THREE from './lib/three.module.js';
import { Objects, Params } from './levels.js';
import { Entity, Direction } from './entity.js';
import { Game } from './game.js';

export type GhostState = 'chase' | 'scatter' | 'fright';
export type GhostName = 'Blinky' | 'Pinky' | 'Inky' | 'Clyde';

const PxInterval = 8;
const StepInterval = 160;

export abstract class Ghost extends Entity {
    public state: GhostState;
    public lastCell: { x: number, y: number };
    public lastObject: Objects;
    public spawnCell: { i: number, j: number };
    protected constructor(i?: number, j?: number) {
        super((i? i : 0), (j? j : 0));
        this.spawnCell = { i: (i? i : 0), j: (j? j : 0) };
        Ghost.Size = 8;
    }
    
    public override getX(j?: number) {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
	    let x = (j? j : this.cell.j) * Params.CellSize - (radius - delta);
        return x;
    }

    public override getY(i?: number) {
        let delta = Params.CellSize / 2;
	    let radius = Params.CubeSize / 2;
        let y = -(i? i : this.cell.i) * Params.CellSize + (radius - delta);
        return y;
    }

    public setModel(scene: THREE.Group) {
        this.model = scene;
    }

    public getModel() {
        return this.model;
    }
}

export class Blinky extends Ghost {
    private timer: any;
    private stepTimer: any;
    constructor(i?: number, j?: number) {
        super((i? i : 0), (j? j : 0));
        this.type = Objects.blinky;
    }
    public startMovement(direction: Direction) {
        if (this.moveDirection == direction)
            return;
        if (!this.canMove(direction))
            return;
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
        let delta = this.calcMoveVector();

        this.isMoving = true;

        delta.multiplyScalar(Params.CellSize/2);
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

        this.cell = desIndex;
    }
}

export class Pinky extends Ghost {
    constructor(i?: number, j?: number) {
        super((i? i : 0), (j? j : 0));
        this.type = Objects.pinky;
    }
}

export class Inky extends Ghost {
    constructor(i?: number, j?: number) {
        super((i? i : 0), (j? j : 0));
        this.type = Objects.inky;
    }
}

export class Clyde extends Ghost {
    constructor(i?: number, j?: number) {
        super((i? i : 0), (j? j : 0));
        this.type = Objects.clyde;
    }
}