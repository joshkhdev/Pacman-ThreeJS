import * as THREE from './lib/three.module.js';
import { Direction, Entity, Objects, Params } from './entity.js';
import { Game } from './game.js';

export class Pacman extends Entity {
    public spawnCell: { i: number, j: number };
    constructor(i?: number, j?: number, direction?: Direction) {
        super((i? i : 0), (j? j : 0), (direction? direction : 'none'));
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