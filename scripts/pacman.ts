import * as THREE from './lib/three.module.js';
import { Entity, Objects, Params } from './entity.js';

export class Pacman extends Entity {
    //public static Size: number;
    constructor() {
        super();
        Pacman.Size = 10;
        this.type = Objects.pacman;
    }

    /*public updateCell(grid: number[][]) { // Привязать после движения
        grid[this.cell.i][this.cell.j] = Objects.blank;
        grid[this.cell.i - this.movement.y][this.cell.j + this.movement.x] = Objects.pacman;
        this.cell.i -= this.movement.y;
        this.cell.j += this.movement.x;
    }*/

    public override getX() {
        let delta = Params.CellSize / 2;
        let radius = Params.CubeSize / 2;
	    let x = this.cell.j * Params.CellSize - (radius - delta);
        return x;
    }
    public override getY() {
        let delta = Params.CellSize / 2;
	    let radius = Params.CubeSize / 2;
        let y = -this.cell.i * Params.CellSize + (radius - delta);
        return y;
    }

}