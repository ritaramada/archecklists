import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';

export class ARChecklistItem {
    public mesh: THREE.Object3D;  // Now using Object3D to group multiple meshes
    private _text: string;
    private _color: number;
    private _width: number;
    private _height: number;
    private _depth: number;

    constructor(text: string, width: number, height: number, depth: number, color: number, position: THREE.Vector3) {
        this._text = text;
        this._color = color;
        this._width = width;
        this._height = height;
        this._depth = depth;
        this.mesh = new THREE.Object3D();  // Group to hold all parts
        this.mesh.position.copy(position);

        this._addButtonMesh();  // Add the main button mesh
        this._addCheckboxes();  // Add checkboxes
    }

    private _addButtonMesh(): void {
        const geometry = new THREE.BoxGeometry(this._width, this._height, this._depth);
        const material = new THREE.MeshPhongMaterial({ color: this._color });
        const buttonMesh = new THREE.Mesh(geometry, material);

        const text = createText(this._text, 0.06);
        text.position.set(0, 0, this._depth + 0.001);  // slightly forward to avoid z-fighting
        buttonMesh.add(text);

        this.mesh.add(buttonMesh);
    }

    private _addCheckboxes(): void {
        const blueBox = this._makeCheckbox(0.1, 0.1, 0.01, 0x0165a1);
        blueBox.position.set(0.31, 0, -0.01);  // Position relative to the main button
        this.mesh.add(blueBox);

        const whiteBox = this._makeCheckbox(0.08, 0.08, 0.01, 0xffffff);
        whiteBox.position.set(0.31, 0, 0);  // Slightly in front to simulate a checkmark
        this.mesh.add(whiteBox);
    }

    private _makeCheckbox(width: number, height: number, depth: number, color: number): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({ color: color });
        return new THREE.Mesh(geometry, material);
    }

    updatePosition(newPosition: THREE.Vector3): void {
        this.mesh.position.copy(newPosition);
    }
}
