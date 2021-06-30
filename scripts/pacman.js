import { Entity, Objects, Params } from './entity.js';
export class Pacman extends Entity {
    spawnCell;
    constructor(i, j, direction) {
        super((i ? i : 0), (j ? j : 0), (direction ? direction : 'none'));
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
}
