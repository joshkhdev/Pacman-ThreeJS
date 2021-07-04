import * as THREE from './lib/three.module.js';
import { Objects, Params } from './levels.js';
import { Direction, Entity,  } from './entity.js';

export class Pacman extends Entity {
    public spawnCell: { i: number, j: number };
    constructor(i?: number, j?: number, face?: Direction) {
        super((i? i : 0), (j? j : 0), (face? face : 'right'));
        Pacman.Size = 10;
        this.type = Objects.pacman;
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