import * as THREE from './lib/three.module.js';
import { Entity, Objects } from './entity.js';
export class Pacman extends Entity {
    //public static Size: number;
    constructor() {
        super();
        Pacman.Size = 10;
        this.material = new THREE.MeshLambertMaterial({ color: '#FF1FF8' });
        this.animationTime = 120;
        this.type = Objects.pacman;
    }
    updateCell(grid) {
        grid[this.cell.i][this.cell.j] = Objects.blank;
        grid[this.cell.i - this.movement.y][this.cell.j + this.movement.x] = Objects.pacman;
        this.cell.i -= this.movement.y;
        this.cell.j += this.movement.x;
    }
}
