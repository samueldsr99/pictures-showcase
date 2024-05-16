import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Mesh,
  BoxGeometry,
  ShaderMaterial,
  BufferAttribute,
  Color,
  MeshBasicMaterial,
  Group,
  AmbientLight,
  SpotLight,
  SphereGeometry,
  PlaneGeometry,
  Euler,
  Vector3,
  Clock,
  AxesHelper,
  DataTexture,
  EquirectangularReflectionMapping,
} from "three";
import { GroundedSkybox } from "three/examples/jsm/objects/GroundedSkybox";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats.js";
import TreeModel from "./models/tree";
import FloorModel from "./models/floor";
import SeaModel from "./models/sea";
import Skybox from "./models/skybox";

const DEBUG = true;

export default class App {
  /** @type {WebGLRenderer} */
  _gl;

  /** @type {PerspectiveCamera} */
  _camera;

  /** @type {Scene} */
  _scene;

  /** @type {Stats} */
  _stats;

  /** @type {Map<string, import("./models/types").Model>} */
  _models;

  /** @type {Clock} */
  _clock;

  constructor() {
    this.euler = new Euler(0, 0, 0, "YXZ");
    this.rotationSpeed = Math.PI / 2200;

    this._init();
  }

  // Initializers
  _init() {
    // WebGLRenderer
    const canvas = document.querySelector("#canvas");
    if (!canvas) {
      throw new Error("Canvas not found");
    }
    this._gl = new WebGLRenderer({ canvas });
    this._gl.setSize(window.innerWidth, window.innerHeight);
    this._gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this._clock = new Clock();

    this._initScene();

    const axesHelper = new AxesHelper(5);
    this._scene.add(axesHelper);

    this._initCamera();
    this._initLights();
    this._initStats();
    this._initEvents();
    this._buildEnvironment();

    if (DEBUG) {
      new OrbitControls(this._camera, this._gl.domElement);
    }

    this._animate();
  }

  _initLights() {
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this._scene.add(ambientLight);
  }

  _initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this._camera = new PerspectiveCamera(60, aspect, 1, 1000);
    this._camera.position.z = 5;
    this._camera.position.y = 1.7;
  }

  _initScene() {
    this._scene = new Scene();
  }

  _initStats() {
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);
  }

  _initEvents() {
    window.addEventListener("resize", this._handleResize.bind(this));
    // window.addEventListener("mousemove", this._handleMouseMove.bind(this));
    // window.addEventListener("keydown", this._handleKeyDown.bind(this));
  }

  async _buildEnvironment() {
    this._models = new Map();
    this._scene.background = new Color("skyblue");

    // Tree
    const tree = new TreeModel("palm");
    await tree.loadResource();
    tree.position.set(0, 0, 0);
    tree.scale.set(0.8, 0.8, 0.8);
    this._scene.add(tree);

    // Floor
    const floor = new FloorModel();
    floor.position.set(0, -0.1, 0);
    this._scene.add(floor);

    // Sea
    const sea = new SeaModel();
    sea.position.set(0, 0, -80);
    this._scene.add(sea);

    // Sky
    const skybox = new Skybox();
    /** @type {DataTexture} */
    const envmap = await skybox.loadResource();
    envmap.mapping = EquirectangularReflectionMapping;
    const params = {
      height: 10,
      radius: 200,
    };
    const sky = new GroundedSkybox(envmap, params.height, params.radius);
    sky.position.y = params.height - 1;
    this._scene.add(sky);
    this._scene.environment = envmap;

    this._models.set("tree", tree);
    this._models.set("floor", floor);
    this._models.set("sea", sea);
    this._models.set("skybox", skybox);
  }

  // Event handlers
  _handleResize() {
    this._gl.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  /**
   * @param {MouseEvent} e
   */
  _handleMouseMove(e) {
    // @ts-ignore
    const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    // @ts-ignore
    const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

    this.euler.y -= movementX * this.rotationSpeed;
    this.euler.x -= movementY * this.rotationSpeed;
    this.euler.x = Math.min(Math.max(this.euler.x, -1.0472), 1.0472);

    this._camera.quaternion.setFromEuler(this.euler);
  }

  /**
   *
   * @param {KeyboardEvent} e
   */
  _handleKeyDown(e) {
    if (e.code === "KeyW") {
      // Move to the front
      const direction = new Vector3();
      this._camera.getWorldDirection(direction);
      this._camera.position.addScaledVector(direction, 0.1);
    } else if (e.code === "KeyS") {
      // Move to the back
      const direction = new Vector3();
      this._camera.getWorldDirection(direction);
      this._camera.position.addScaledVector(direction, -0.1);
    } else if (e.code === "KeyA") {
      // Move to the left
      const direction = new Vector3();
      this._camera.getWorldDirection(direction);
      const side = new Vector3();
      side.crossVectors(direction, new Vector3(0, 1, 0));
      this._camera.position.addScaledVector(side, -0.1);
    } else if (e.code === "KeyD") {
      // Move to the right
      const direction = new Vector3();
      this._camera.getWorldDirection(direction);
      const side = new Vector3();
      side.crossVectors(direction, new Vector3(0, 1, 0));
      this._camera.position.addScaledVector(side, 0.1);
    }
  }

  _updateModelsState() {
    const sea = this._models.get("sea");

    sea?.update?.({
      uTime: this._clock.getElapsedTime(),
    });
  }

  // RAF
  _animate() {
    this._stats.begin();
    this._updateModelsState();
    this._gl.render(this._scene, this._camera);
    this._stats.end();
    window.requestAnimationFrame(this._animate.bind(this));
  }
}
