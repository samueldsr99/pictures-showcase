import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Color,
  Vector2,
  Clock,
  AxesHelper,
  DirectionalLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats.js";
import Item from "./item";
import Items from "./items";
import { gsap } from "gsap";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import Composer from "./postprocessing";
import Glass from "./glass";

const DEBUG = false;

const BOUND_MIN = -60;
const BOUND_MAX = 60;
const SPEED = 0.5;

export default class App {
  /** @type {WebGLRenderer} */
  _gl;

  /** @type {EffectComposer} */
  _composer;

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

    this._clock = new Clock();

    this._initScene();
    this._initState();

    const axesHelper = new AxesHelper(5);
    // this._scene.add(axesHelper);

    this._initCamera();
    this._initStats();
    this._initEvents();
    this._buildEnvironment();
    this._initLights();

    this._composer = new Composer({
      gl: this._gl,
      camera: this._camera,
      scene: this._scene,
    });

    if (DEBUG) {
      new OrbitControls(this._camera, this._gl.domElement);
    }

    this._animate();
  }

  _initState() {
    this._state = {
      isWalking: false,
      walkDirection: new Vector2(0, 0),
      distanceToMove: { x: 0, y: 0 },
    };
  }

  _initLights() {
    const directionalLight = new DirectionalLight(0xffffff, 20.5);
    directionalLight.position.set(0, 0, 1);
    directionalLight.lookAt(this._glass);
    this._scene.add(directionalLight);
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
    window.addEventListener("click", this._handleClick.bind(this));
  }

  async _buildEnvironment() {
    // Dark gray
    this._scene.background = new Color(0x000000);

    // Pictures
    const items = new Items(this._camera);
    this._items = items;
    this._scene.add(items);

    // Glass
    const glass = new Glass();
    glass.position.set(0, 0, 0);
    this._glass = glass;
    this._scene.add(glass);
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

    const chromaticOffset = 0.006 * distanceToCenter * distanceToCenter;

    if (this._state.isWalking && this._items._currentInFront == null) {
      this._composer._chromaticAberrationEffect.offset.x = chromaticOffset;
      this._composer._chromaticAberrationEffect.offset.y = chromaticOffset;
    } else {
      this._composer._chromaticAberrationEffect.offset.x = 0;
      this._composer._chromaticAberrationEffect.offset.y = 0;
    }

    if (distanceToCenter > 0.3) {
      this._state.isWalking = true;
      this._state.walkDirection = new Vector2(dx, dy);
      gsap.to(this._state.distanceToMove, {
        x: dx * SPEED,
        y: dy * SPEED,
        ease: "power2.out",
      });
    } else {
      this._state.isWalking = false;
      this._state.walkDirection.x = 0;
      this._state.walkDirection.y = 0;
    }
  }

  /**
   *
   * @param {PointerEvent} e
   */
  _handleClick(e) {
    this._items.onClick(e);
  }

  _updateModelsState() {
    const state = this._state;
    const delta = this._clock.getDelta();

    this._items.update({ walkDirection: state.walkDirection, delta });
    this._glass.update({ delta });

    // Walking thing
    if (state.isWalking && this._items._currentInFront == null) {
      const isWithin = (x, y) => {
        return x > BOUND_MIN && x < BOUND_MAX && y > BOUND_MIN && y < BOUND_MAX;
      };

      if (
        isWithin(
          this._camera.position.x + state.distanceToMove.x,
          this._camera.position.y + state.distanceToMove.y
        )
      ) {
        this._camera.position.x += state.distanceToMove.x;
        this._camera.position.y += state.distanceToMove.y;

        gsap.to(this._glass.position, {
          x: this._camera.position.x,
          y: this._camera.position.y,
          duration: 2.5,
          delay: 2.5,
        });
      }
    }
  }

  // RAF
  _animate() {
    this._stats.begin();
    this._updateModelsState();

    this._composer.render();
    this._stats.end();
    window.requestAnimationFrame(this._animate.bind(this));
  }
}
