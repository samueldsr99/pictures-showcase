import {
  Mesh,
  Group,
  MeshBasicMaterial,
  PlaneGeometry,
  TextureLoader,
  SRGBColorSpace,
  RepeatWrapping,
  ShaderMaterial,
  BoxGeometry,
  Vector2,
} from "three";
import gsap from "gsap";

import vertexShader from "./shaders/index.vert";
import fragmentShader from "./shaders/index.frag";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

export default class Item extends Mesh {
  constructor({ camera, imagePath, title, description, width = 8 }) {
    super();
    this.imagePath = imagePath;
    this.title = title;
    this.description = description;
    this.width = width;
    this._camera = camera;

    this._isInFront = false;

    this._init();
  }

  async _init() {
    const texture = await new TextureLoader().loadAsync(this.imagePath);
    this._uniforms = {
      uTexture: { value: texture },
      uIsInFront: { value: this._isInFront },
      uWalkDirection: { value: new Vector2(0, 0) },
      uTime: { value: 0 },
    };

    const geometry = new PlaneGeometry(1, 1, 50, 50);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this._uniforms,
    });
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = texture.wrapT = RepeatWrapping;

    const ratio = texture.image.naturalWidth / texture.image.naturalHeight;

    const mesh = new Mesh(geometry, material);
    this._mesh = mesh;
    this._initialPosition = this.position.clone();

    const meshWidth = this.width;
    const meshHeight = this.width / ratio;

    mesh.scale.set(meshWidth, meshHeight, 1);

    this.add(mesh);

    this._initTexts();
  }

  async _initTexts() {
    // Load fonts
    const loader = new FontLoader();
    const pradaFont = await loader.loadAsync("src/fonts/prada.json");

    // Title text
    const titleGeometry = new TextGeometry(this.title, {
      font: pradaFont,
      size: 0.2,
      depth: 0.07,
    });
    const titleMaterial = new MeshBasicMaterial({
      color: 0x333333,
    });
    const titleMesh = new Mesh(titleGeometry, titleMaterial);
    this._titleMesh = titleMesh;
    titleMesh.position.set(-2, -2, 0.1);
    titleMesh.visible = false;
    this.add(titleMesh);

    // Description text
    const descriptionGeometry = new TextGeometry(this.description, {
      font: pradaFont,
      size: 0.08,
      depth: 0.01,
    });
    const descriptionMaterial = new MeshBasicMaterial({
      color: 0x333333,
    });
    const descriptionMesh = new Mesh(descriptionGeometry, descriptionMaterial);
    this._descriptionMesh = descriptionMesh;
    descriptionMesh.position.set(-2, -2.3, 0.1);
    descriptionMesh.visible = false;
    this.add(descriptionMesh);
  }

  /**
   * Put the element on the first plane by running an animation
   * to move it through the z-axis.
   */
  bringToFront() {
    if (this._isInFront) {
      this.resetPosition();
    }

    this._titleMesh.visible = true;
    this._descriptionMesh.visible = true;
    this._isInFront = true;

    gsap.to(this.position, {
      z: 28,
      duration: 0.5,
    });
  }

  resetPosition() {
    this._isInFront = false;
    this._titleMesh.visible = false;
    this._descriptionMesh.visible = false;

    gsap.to(this.position, {
      x: this._initialPosition.x,
      y: this._initialPosition.y,
      z: this._initialPosition.z,
      duration: 0.5,
    });
  }

  update({ walkDirection, delta }) {
    if (!this._uniforms) {
      return;
    }

    this._uniforms.uIsInFront.value = this._isInFront ?? false;
    this._uniforms.uTime.value = delta;
    this._uniforms.uWalkDirection.value = walkDirection;

    if (this._mesh) {
      this._mesh.material.uniforms = this._uniforms;
    }
  }
}
