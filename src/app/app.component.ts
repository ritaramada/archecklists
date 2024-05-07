import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppChecklistModel } from './models/app-checklist-model';

import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { ARChecklistItem } from './models/ARChecklistItem';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'WEBXR';

  /**
   * The checklist to display.
   */
  checklist = new AppChecklistModel().getChecklist();

  @ViewChild('attach')
  private _arDiv: ElementRef | undefined;

  /**
   * The scene that will be rendered.
   */
  private _scene: THREE.Scene | undefined;

  /**
   * The camera with perspective projection.
   */
  private _camera: THREE.PerspectiveCamera | undefined;

  /**
   * The WebGLRenderer that will render the scene.
   */
  private _renderer: THREE.WebGLRenderer | undefined;

  /**
   * The cube in the scene.
   */
  private _cube: THREE.Mesh | undefined;

  private _items: ARChecklistItem[] = [];
  private _userPosition = new THREE.Vector3();
  private _userDirection = new THREE.Vector3();

  constructor() {}

  ngAfterViewInit(): void {
    this._scene = new THREE.Scene();

    this._epOnEntityLoaded();

    // Make a camera
    this._camera = this._buildCamera();

    // Build the lights
    this._buildLights();

    //this._loadArrow();
    // Make a WebGLRenderer
    this._renderer = this._buildRenderer();

    // Listen for window resize events
    window.addEventListener('resize', () => this._onWindowResize(), false);

    this._render();
  }

  /**
   * Event handler for the entity page entity loaded event.
   */
  private async _epOnEntityLoaded() {
    // Show the entity and its items in the console
    console.log('Entity:', this.checklist);
    console.log('Items: ', this.checklist.Items);
    this._displayChecklistItem();
  }

  /**
   * Display the title of a checklist item
   */
  private async _displayChecklistItem() {
    this.checklist.Items.forEach((item, index) => {
      const position = new THREE.Vector3(0, 2 - index * 0.15, -1); // Starting position
      const checklistItem = new ARChecklistItem(
        item.Name,
        0.5,
        0.1,
        0.01,
        0x0165a1,
        position
      );
      this._scene!.add(checklistItem.mesh);
      this._items.push(checklistItem);
    });
  }

  /**
   * Make a camera with perspective projection.
   * @returns A camera with perspective projection.
   */
  private _buildCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
    camera.position.set(0, 1.6, 0);
    return camera;
  }

  /**
   * Build the lights in the scene.
   */
  private _buildLights(): void {
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 1, 1).normalize();
    this._scene!.add(light);
    this._scene!.add(new THREE.AmbientLight(0xffffff, 0.5));
  }

  /**
   * Build a WebGLRenderer that will render the scene.
   * @returns A WebGLRenderer that will render the scene.
   */
  private _buildRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // Set the size of the renderer to the size of the window
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    this._arDiv!.nativeElement.appendChild(renderer.domElement);

    // Add the AR button to the page
    this._arDiv!.nativeElement.appendChild(
      ARButton.createButton(renderer, {
        requiredFeatures: [],
      })
    );

    return renderer;
  }

  /**
   * On window resize, update the camera aspect ratio and the renderer size.
   */
  private _onWindowResize(): void {
    this._camera!.aspect = window.innerWidth / window.innerHeight;
    this._camera!.updateProjectionMatrix();
    this._renderer!.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Update the position of each checklist item based on the user's current position and orientation.
   */
  private _updateItemPositions(): void {
    const yOffsetIncrement = 0.15;
    let yOffset = 2;

    this._items.forEach((item) => {
      const newPos = new THREE.Vector3(
        this._userPosition.x,
        this._userPosition.y + yOffset,
        this._userPosition.z - 1
      );
      item.updatePosition(newPos);
      yOffset -= yOffsetIncrement;
    });
  }

  /**
   * Render the scene.
   */
  private _render(): void {
    // Request animation frame loop function
    this._renderer!.setAnimationLoop((time) => {
      if (this._renderer == null) {
        return;
      }

      if (this._renderer.xr.isPresenting) {
        const xrCamera = this._renderer.xr.getCamera();
        xrCamera.getWorldPosition(this._userPosition);
        xrCamera.getWorldDirection(this._userDirection);

        this._updateItemPositions(); // Update positions on each frame
      }

      this._renderer!.render(this._scene!, this._camera!);
    });
  }
}
