import { Objects, Params } from './levels.js';
import { Entity } from './entity.js';
const PxInterval = 8;
const StepInterval = 160;
export class Ghost extends Entity {
    state;
    lastCell;
    lastObject;
    spawnCell;
    constructor(i, j) {
        super((i ? i : 0), (j ? j : 0));
        this.spawnCell = { i: (i ? i : 0), j: (j ? j : 0) };
        Ghost.Size = 8;
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
}
export class Blinky extends Ghost {
    timer;
    stepTimer;
    constructor(i, j) {
        super((i ? i : 0), (j ? j : 0));
        this.type = Objects.blinky;
    }
    startMovement(direction) {
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
        this.cell = desIndex;
    }
}
export class Pinky extends Ghost {
    constructor(i, j) {
        super((i ? i : 0), (j ? j : 0));
        this.type = Objects.pinky;
    }
}
export class Inky extends Ghost {
    constructor(i, j) {
        super((i ? i : 0), (j ? j : 0));
        this.type = Objects.inky;
    }
}
export class Clyde extends Ghost {
    constructor(i, j) {
        super((i ? i : 0), (j ? j : 0));
        this.type = Objects.clyde;
    }
}
