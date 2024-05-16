import {
  BufferAttribute,
  EllipseCurve,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
} from "three";

import vertexShader from "./shaders/index.vert";
import fragmentShader from "./shaders/index.frag";

/**
 * @typedef {import("../types").Model} Model
 */

/**
 * @implements {Model}
 */
export default class FloorModel extends Group {
  constructor() {
    super();
    this.key = "floor";
    this._init();
  }

  _init() {
    const geometry = new PlaneGeometry(600, 600, 100, 100);
    const sandTexture = new TextureLoader().load(
      "app/models/floor/assets/sand-2.jpg"
    );

    const aRandom = new Float32Array(geometry.attributes.position.count);

    for (let i = 0; i < aRandom.length; i++) {
      aRandom[i] = Math.random();
    }

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: sandTexture },
      },
    });
    // repeat
    const floor = new Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    geometry.setAttribute("aRandom", new BufferAttribute(aRandom, 1));

    this.add(floor);
  }
}
