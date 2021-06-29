import { Entity, Objects, Params } from './entity.js';
export class Ghost extends Entity {
    state;
    lastCell;
    lastObject;
    spawnCell;
    constructor() {
        super();
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
        return this.model.clone();
    }
}
export class Blinky extends Ghost {
    constructor() {
        super();
        this.type = Objects.blinky;
    }
}
export class Pinky extends Ghost {
    constructor() {
        super();
        this.type = Objects.pinky;
    }
}
export class Inky extends Ghost {
    constructor() {
        super();
        this.type = Objects.inky;
    }
}
export class Clyde extends Ghost {
    constructor() {
        super();
        this.type = Objects.clyde;
    }
}
