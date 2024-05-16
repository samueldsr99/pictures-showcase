import {
  CircleGeometry,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from "three";

import vertexShader from "./shaders/index.vert";
import fragmentShader from "./shaders/index.frag";

/**
 * @typedef {import("../types").Model} Model
 */

/**
 * @implements {Model}
 */
export default class SeaModel extends Group {
  /** @type {import("./types").Uniforms} */
  _uniforms;

  constructor() {
    super();
    this.key = "sea";
    this._init();
  }

  _init() {
    this._uniforms = {
      uTime: { value: 0 },
    };

    const geometry = new PlaneGeometry(10, 10, 100, 100);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this._uniforms,
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.z = -5;
    mesh.position.y = 1.5;
    mesh.rotation.x = -Math.PI / 2;

    this.add(mesh);
  }

  /**
   * @param {{uTime: number}} time
   */
  update({ uTime }) {
    this._uniforms.uTime.value = uTime;
  }
}
