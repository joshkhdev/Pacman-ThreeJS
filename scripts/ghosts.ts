import * as THREE from './lib/three.module.js';
import { Entity, Objects, Params, Direction } from './entity.js';
import { LevelType, MAP } from './levels.js';

export type GhostState = 'chase' | 'scatter' | 'fright';
export type GhostName = 'Blinky' | 'Pinky' | 'Inky' | 'Clyde';

export abstract class Ghost extends Entity {
    public state: GhostState;
    public lastCell: { x: number, y: number };
    public lastObject: Objects;
    public spawnCell: { i: number, j: number };
    protected constructor(i?: number, j?: number, direction?: Direction) {
        super((i? i : 0), (j? j : 0), (direction? direction : 'none'));
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

    /*public updateCell(grid: number[][]) {
        grid[this.cell.i][this.cell.j] = this.lastObject;
        let i = this.cell.i - this.movement.y; let j = this.cell.j + this.movement.x;
        this.lastObject = grid[i][j];
        this.lastCell = { x: this.cell.j, y: this.cell.i };
        grid[i][j] = this.type;
        this.cell.i -= this.movement.y;
        this.cell.j += this.movement.x;
    }*/
}

export class Blinky extends Ghost {
    constructor(i?: number, j?: number, direction?: Direction) {
        super((i? i : 0), (j? j : 0), (direction? direction : 'none'));
        this.type = Objects.blinky;
    }
}

export class Pinky extends Ghost {
    constructor(i?: number, j?: number, direction?: Direction) {
        super((i? i : 0), (j? j : 0), (direction? direction : 'none'));
        this.type = Objects.pinky;
    }
}

export class Inky extends Ghost {
    constructor(i?: number, j?: number, direction?: Direction) {
        super((i? i : 0), (j? j : 0), (direction? direction : 'none'));
        this.type = Objects.inky;
    }
}

export class Clyde extends Ghost {
    constructor(i?: number, j?: number, direction?: Direction) {
        super((i? i : 0), (j? j : 0), (direction? direction : 'none'));
        this.type = Objects.clyde;
    }
}