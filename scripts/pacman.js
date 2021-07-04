import { Objects, Params } from './levels.js';
import { Entity, } from './entity.js';
export class Pacman extends Entity {
    spawnCell;
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
}
