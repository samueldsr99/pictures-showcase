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
  Vector2,
  Clock,
  AxesHelper,
  DataTexture,
  EquirectangularReflectionMapping,
  MathUtils,
} from "three";
import { GroundedSkybox } from "three/examples/jsm/objects/GroundedSkybox";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import Stats from "stats.js";
import Item from "./item";
import { match_ } from "./utils/match";
import Items from "./items";
import { gsap } from "gsap";

const DEBUG = false;

const BOUND_MIN = -60;
const BOUND_MAX = 60;
const VELOCITY = 0.3;

export default class App {
  /** @type {WebGLRenderer} */
  _gl;

  /** @type {PerspectiveCamera} */
  _camera;

  /** @type {Scene} */
  _scene;

  /** @type {Stats} */
  _stats;

  /** @type {Clock} */
  _clock;

  /** @type {{[key: string]: any}} */
  _state;

  /** @type {Array<Item>} */
  _items;

  constructor() {
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
    this._gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

    this._state = {
      isWalking: false,
      walkDirection: null,
      distanceToMove: { x: 0, y: 0 },
    };

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
    this._camera.position.z = 40;
    this._camera.position.y = 4;
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
    window.addEventListener("mousemove", this._handleMouseMove.bind(this));
    // window.addEventListener("keydown", this._handleKeyDown.bind(this));
    // window.addEventListener("keyup", this._handleKeyUp.bind(this));
    window.addEventListener("click", this._handleClick.bind(this));
  }

  async _buildEnvironment() {
    this._models = new Map();
    this._scene.background = new Color(0x000000);

    const items = new Items(this._camera);
    this._items = items;

    this._scene.add(items);
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
    const dx = (e.clientX / window.innerWidth) * 2 - 1;
    const dy = -(e.clientY / window.innerHeight) * 2 + 1;

    const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

    if (distanceToCenter > 0.3) {
      this._state.isWalking = true;
      this._state.walkDirection = new Vector2(dx, dy);
      gsap.to(this._state.distanceToMove, {
        x: dx * VELOCITY,
        y: dy * VELOCITY,
        ease: "power2.out",
      });
    } else {
      this._state.isWalking = false;
      this._state.walkDirection = null;
    }
  }

  /**
   *
   * @param {KeyboardEvent} e
   */
  _handleKeyDown(e) {}

  /**
   *
   * @param {PointerEvent} e
   */
  _handleClick(e) {
    this._items.onClick(e);
  }

  _handleKeyUp() {}

  _updateModelsState() {
    const state = this._state;

    this._items.update();

    // Walking thing
    if (
      state.isWalking &&
      state.walkDirection != null &&
      this._items._currentInFront == null
    ) {
      const isWithin = (x, y) => {
        return x > BOUND_MIN && x < BOUND_MAX && y > BOUND_MIN && y < BOUND_MAX;
      };

      if (
        isWithin(
          this._camera.position.x + state.distanceToMove.x,
          this._camera.position.y + state.distanceToMove.y
        )
      ) {
        // Without gsap
        this._camera.position.x += state.distanceToMove.x;
        this._camera.position.y += state.distanceToMove.y;
      }
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
