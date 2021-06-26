import * as THREE from './lib/three.module.js';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export const Params = {
    CellSize: 20,
    CubeSize: 500,
    WallSize: 18,
    Depth: 20,
    Rows: 25,
    Cols: 25
}

export enum Objects {
    blank,
    wall,
    //dynwall,
    //spawnwall,
    dot,
    cherry,
    powerup,
    pacman,
    blinky,
    pinky,
    inky,
    clyde
}

export abstract class Entity { // Поменять public на private, создать get/set методы
    public cell: { i: number, j: number };
    public movement: { x: number, y: number }; // Непонятно, почему "движение" это X и Y
    public moveDirection: Direction;
    public moveInterval?: any;
    public reqMove?: any;
    public posToMove?: THREE.Vector3;
    public material: any;
    public static Size: number;
    public animationTime: number; // Если это tween.js - рассмотреть удаление/замену
    public mesh?: THREE.Mesh;
    public type: Objects;
    protected constructor() {
        this.cell = { i: 0, j: 0 };
        this.movement = { x: 0, y: 0 };
        this.moveDirection = 'none';
    }
    public stopMovement(x: number, y: number, grid: number[][]) { // А нужны ли тут параметры?
        clearInterval(this.moveInterval);
        cancelAnimationFrame(this.reqMove);
        this.moveInterval = null;
        this.reqMove = null;
        this.movement = { x: 0, y: 0 };
        this.moveDirection = 'none';
        this.posToMove = null;
    }
    public canMove(x: number, y: number, grid: number[][]) {
        let i = this.cell.i - y; let j = this.cell.j + x;
        if ((i >= 0 && i < Params.CubeSize/Params.CellSize) && (j >= 0 && j < Params.CubeSize/Params.CellSize))
            return grid[i][j] == Objects.blank || grid[i][j] == Objects.dot
    }
    public step(x: number, y: number) {
        this.movement.x = x;
        this.movement.y = y;
        this.posToMove = this.mesh.position.clone(); // ?
        this.posToMove = new THREE.Vector3(this.posToMove.x + x * Params.CellSize, this.posToMove.y + y * Params.CellSize, this.posToMove.z);
    }
    public abstract updateCell(grid: number[][]);
}