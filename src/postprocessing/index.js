import { FloatType, Vector2 } from "three";
import {
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";

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
