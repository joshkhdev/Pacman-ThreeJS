import * as THREE from './three.module.js';
import { MAP } from './levels.js';
import { Params } from './entity.js';
export class Game {
    curLevel;
    map;
    dotsArray;
    curDot;
    geometry;
    dotMaterial;
    grid;
    score;
    scoreText;
    constructor() {
        this.curLevel = MAP[0];
        this.map = MAP;
        this.dotMaterial = new THREE.MeshLambertMaterial({ color: '#FFFFFF' });
        this.score = 0;
        this.scoreText = document.getElementById('score');
    }
    async initGame() {
    }
    clearScene() {
        this.curDot = null;
        //this.removeDots();
        //NOP_VIEWER.impl.scene.remove(curLevel.pivot.name);
        this.curLevel.dots = [];
        this.curLevel.pivot = null;
    }
    /*public removeDots() {
        NOP_VIEWER.overlays.removeMesh(this.curLevel.pivot, "custom-scene");
        NOP_VIEWER.impl.sceneUpdated(true, false);
    }*/
    initLevelGrid() {
        for (let i = 0; i < Params.CubeSize / Params.CellSize; i++) {
            this.grid[i] = [];
            this.curLevel.grid[i].forEach(element => {
                this.grid[i].push(element);
            });
        }
    }
    /*public async drawDots() {
        for (const level of MAP) {
            await this.drawLevelDots(level);
        }
    }*/
    /*public async drawLevelDots(level: Level) {
        this.dotsArray = [];
        let pivot = new THREE.Group();
        let side = new THREE.Object3D();
        let dots = this.findObject(Objects.dot, level.grid);
        return new Promise(function (resolve, reject) {
            for (const dot of dots) {
                this.drawDot(dot.i, dot.j);
            }
            for (const dot of this.dotsArray) {
                level.dots.push(dot);
                side.add(dot.mesh);
            }
            pivot.position.set(level.offset.x, level.offset.y, level.offset.z);
            pivot.rotation.setFromVector3(new THREE.Vector3(level.rotation.x, level.rotation.y, level.rotation.z));

            /*NOP_VIEWER.impl.scene.add(pivot);
            pivot.add(side);
            level.pivot = pivot;
            setTimeout(() => {
                NOP_VIEWER.overlays.addMesh(pivot, 'custom-scene');
                NOP_VIEWER.impl.sceneUpdated(true, false);
                resolve();
            }, 500);
        });
    }*/
    /*public drawDot(i: number, j: number) {
        this.geometry = new THREE.SphereGeometry(Params.CellSize - 15, 12, 12);
        let dot = new THREE.Mesh(this.geometry, this.dotMaterial);
        dot.position.set(j * Params.CellSize - (Params.CubeSize - Params.CellSize / 2), - (i) * Params.CellSize + (Params.CubeSize - Params.CellSize / 2), Params.CellSize - 8);
        dot.name = `dot_${this.dotsArray.length}`;
        this.dotsArray.push({
            i: i,
            j: j,
            mesh: dot,
        });
    }*/
    findObjects(object, grid) {
        let array = [];
        for (let i = 0; i < Params.CubeSize / Params.CellSize; i++)
            for (let j = 0; j < Params.CubeSize / Params.CellSize; j++)
                if (grid[i][j] == object)
                    array.push({ i: i, j: j });
        return array;
    }
    // Get и Set методы
    getLevel() {
        return this.curLevel;
    }
    setLevel(level) {
        this.curLevel = level;
    }
}
