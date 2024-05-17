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
} from "three";
import gsap from "gsap";

import vertexShader from "./shaders/index.vert";
import fragmentShader from "./shaders/index.frag";

export default class Item extends Mesh {
  constructor({ camera, imagePath, title, description, width = 5 }) {
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
    };

    const geometry = new PlaneGeometry(1, 1, 32, 32);
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
    this._initialPosition = mesh.position.clone();

    const meshWidth = this.width;
    const meshHeight = this.width / ratio;

    mesh.scale.set(meshWidth, meshHeight, 1);

    this.add(mesh);
  }

  /**
   * Put the element on the first plane by running an animation
   * to move it through the z-axis.
   */
  bringToFront() {
    if (this._isInFront) {
      this.resetPosition();
    }

    this._isInFront = true;
    gsap.to(this._mesh.position, {
      z: 32,
      duration: 0.5,
    });
  }

  resetPosition() {
    this._isInFront = false;
    gsap.to(this._mesh.position, {
      x: this._initialPosition.x,
      y: this._initialPosition.y,
      z: this._initialPosition.z,
      duration: 0.5,
    });
  }

  update() {}
}
