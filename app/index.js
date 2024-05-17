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
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import Stats from "stats.js";
import TreeModel from "./models/tree";
import FloorModel from "./models/floor";
import SeaModel from "./models/sea";
import Skybox from "./models/skybox";
import { match_ } from "./utils/match";

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

  /** @type {{[key: string]: any}} */
  _state;

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
    this._initState();

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

  _initState() {
    this._isWalking = false;
    this._walkDirection = new Vector3(0, 0, 0);
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

    const lockControls = new PointerLockControls(
      this._camera,
      document.querySelector("#canvas")
    );

    document.querySelector("#canvas")?.addEventListener("click", () => {
      lockControls.lock();
    });

    // on escape unlock
    lockControls.addEventListener("unlock", () => {
      document.querySelector("#canvas")?.requestPointerLock();
    });

    this._scene.add(lockControls.getObject());
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
    // window.addEventListener("keyup", this._handleKeyUp.bind(this));
  }

  async _buildEnvironment() {
    this._models = new Map();
    this._scene.background = new Color("skyblue");

    // Trees
    const treesAmount = 10;
    for (let i = 0; i < treesAmount; i++) {
      const tree = new TreeModel("palm");
      await tree.loadResource();
      tree.position.set(Math.random() * 100 - 10, 0, Math.random() * 100 - 10);
      tree.scale.set(0.8, 0.8, 0.8);
      this._scene.add(tree);
    }
    // const tree = new TreeModel("palm");
    // await tree.loadResource();
    // tree.position.set(0, 0, 0);
    // tree.scale.set(0.8, 0.8, 0.8);
    // this._scene.add(tree);

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
    const key = e.key.toLowerCase();

    const direction = match_({
      value: key,
      branches: [
        {
          pattern: "w",
          result: new Vector3(0, 0, -1),
        },
        {
          pattern: "s",
          result: new Vector3(0, 0, 1),
        },
        {
          pattern: "a",
          result: new Vector3(-1, 0, 0),
        },
        {
          pattern: "d",
          result: new Vector3(1, 0, 0),
        },
      ],
      fallback: () => null,
    });

    if (direction === null) {
      this._isWalking = false;
      this._walkDirection = new Vector3(0, 0, 0);
    } else {
      this._isWalking = true;
      this._walkDirection?.setX(direction.x);
      this._walkDirection?.setZ(direction.z);
    }
  }

  _handleKeyUp() {
    this._isWalking = false;
    this._walkDirection = new Vector3(0, 0, 0);
  }

  _updateModelsState() {
    const sea = this._models.get("sea");

    sea?.update?.({
      uTime: this._clock.getElapsedTime(),
    });

    // Walking thing
    if (this._isWalking && this._walkDirection != null) {
      const velocity = 0.1;
      // Keep in mind to walk ahead you're looking at
      // Moving left or right rotates the looknig direction
      const direction = this._camera.getWorldDirection(new Vector3());
      const walkDirection = this._walkDirection
        .clone()
        .applyAxisAngle(new Vector3(0, 1, 0), this.euler.y);
      const walkVector = walkDirection.multiplyScalar(velocity);
      this._camera.position.add(walkVector);
    }
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
