import {
  Camera,
  FloatType,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import {
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  PixelationEffect,
  RenderPass,
  SSAOEffect,
} from "postprocessing";
import { LuminosityShader } from "three/examples/jsm/Addons.js";
import { Light } from "three";
import { Mesh } from "three";

export default class PostProcessing {
  _gl;
  _camera;
  _scene;
  _composer;
  _raysParams;

  constructor({ gl, camera, scene }) {
    this._gl = gl;
    this._camera = camera;
    this._scene = scene;

    this._init();
  }

  _init() {
    const composer = new EffectComposer(this._gl, {
      frameBufferType: FloatType,
    });

    const rp = new RenderPass(this._scene, this._camera);

    const chromaticAberrationEffect = new ChromaticAberrationEffect({
      modulationOffset: new Vector2(0.01, 0.01),
    });
    this._chromaticAberrationEffect = chromaticAberrationEffect;

    const effectPass = new EffectPass(this._camera, chromaticAberrationEffect);
    effectPass.renderToScreen = true;

    composer.addPass(rp);
    composer.addPass(effectPass);

    this._composer = composer;
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setSize(width, height) {
    this._composer.setSize(width, height);
  }

  render() {
    this._composer.render();
  }
}
