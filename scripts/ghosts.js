import { Entity, Objects, Params } from './entity.js';
export class Ghost extends Entity {
    state;
    lastCell;
    lastObject;
    spawnCell;
    constructor(i, j, direction) {
        super((i ? i : 0), (j ? j : 0), (direction ? direction : 'none'));
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
    constructor(i, j, direction) {
        super((i ? i : 0), (j ? j : 0), (direction ? direction : 'none'));
        this.type = Objects.blinky;
    }
}
export class Pinky extends Ghost {
    constructor(i, j, direction) {
        super((i ? i : 0), (j ? j : 0), (direction ? direction : 'none'));
        this.type = Objects.pinky;
    }
}
export class Inky extends Ghost {
    constructor(i, j, direction) {
        super((i ? i : 0), (j ? j : 0), (direction ? direction : 'none'));
        this.type = Objects.inky;
    }
}
export class Clyde extends Ghost {
    constructor(i, j, direction) {
        super((i ? i : 0), (j ? j : 0), (direction ? direction : 'none'));
        this.type = Objects.clyde;
    }
}
