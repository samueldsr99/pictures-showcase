import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Mesh,
  BoxGeometry,
  ShaderMaterial,
  BufferAttribute,
  Color,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats.js";

import vertexShader from "./shaders/one/index.vert";
import fragmentShader from "./shaders/one/index.frag";

export default class App {
  constructor() {
    this._init();
  }

  _init() {
    // RENDERER
    this._gl = new WebGLRenderer({
      canvas: document.querySelector("#canvas"),
    });

    this._gl.setSize(window.innerWidth, window.innerHeight);

    // CAMERA
    const aspect = window.innerWidth / window.innerHeight;
    this._camera = new PerspectiveCamera(60, aspect, 1, 100);
    this._camera.position.z = 5;

    // SCENE
    this._scene = new Scene();

    this._initCube();
    this._initAttribute();

    // CONTROLS
    const controls = new OrbitControls(this._camera, this._gl.domElement);

    // STATS
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    this._animate();

    this._initEvents();
  }

  _initAttribute() {
    const geometry = new BoxGeometry(1, 1, 1, 30, 30, 30);
    const randomArr = [];

    const vAmount = geometry.attributes.position.count;
    for (let i = 0; i < vAmount; i++) {
      randomArr.push(Math.random());
    }
    const bufferAttribute = new BufferAttribute(new Float32Array(randomArr), 1);
    geometry.setAttribute("aRandom", bufferAttribute);
    console.log(geometry);

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColorA: { value: new Color(0xff0000) },
        uColorB: { value: new Color(0x00ff00) },
        uIntensity: { value: 0.1 },
      },
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(-1, 0, 0);
    this._scene.add(mesh);
  }

  _initCube() {
    const geometry = new BoxGeometry(1, 1, 1, 10, 10, 10);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: true,
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.set(1, 0, 0);
    this._scene.add(mesh);
  }

  _initEvents() {
    window.addEventListener("resize", this._resize.bind(this));
  }

  _resize() {
    this._gl.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  _animate() {
    this._stats.begin();
    this._gl.render(this._scene, this._camera);
    this._stats.end();
    window.requestAnimationFrame(this._animate.bind(this));
  }
}
