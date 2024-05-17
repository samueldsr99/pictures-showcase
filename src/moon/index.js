import { Group, Mesh, ShaderMaterial, SphereGeometry } from "three";

import vertexShader from "./shaders/index.vert";
import fragmentShader from "./shaders/index.frag";

export default class Moon extends Group {
  constructor() {
    super();
    this._uniforms = {};
    this._radius = 6;

    this._init();
  }

  _init() {
    this._uniforms = {
      uTime: { value: 0 },
    };

    const geometry = new SphereGeometry(1, 32, 32);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this._uniforms,
    });

    this._mesh = new Mesh(geometry, material);
    this._mesh.scale.set(this._radius, this._radius, this._radius);

    this.add(this._mesh);
  }

  update({ delta }) {}
}
