import { Group } from "three";
import { loadResource as loadResource_ } from "../loaders";

/**
 * @typedef {import("../types").ResourceModel} ResourceModel
 * @typedef {import("../types").Resource} Resource
 * @typedef {import("../types").LoaderType} LoaderType
 */

const VARIANTS = {
  palm: {
    key: "palm-tree",
    type: /** @type {LoaderType} */ ("gltf"),
    path: "app/models/tree/assets/palm.glb",
  },
};

/**
 * @implements {ResourceModel}
 */
export default class TreeModel extends Group {
  /** @type {keyof typeof VARIANTS} */
  variant;

  /** @type {LoaderType} */
  type;

  /** @type {string} */
  path;

  /** @type {Resource} */
  resource;

  /**
   * @param {keyof typeof VARIANTS} variant
   */
  constructor(variant) {
    super();
    this.variant = variant;
    this.key = VARIANTS[variant].key;
    this.type = VARIANTS[variant].type;
    this.path = VARIANTS[variant].path;
  }

  /**
   * @returns {Promise<{ scene: Group }>}
   */
  async loadResource() {
    const model = await loadResource_(this.type, this.path);
    this.add(model.scene);
    return model;
  }
}
