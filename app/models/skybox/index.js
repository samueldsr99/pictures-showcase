import { Group } from "three";
import { loadResource as loadResource_ } from "../loaders";

/**
 * @typedef {import("../types").ResourceModel} ResourceModel
 * @typedef {import("../types").Resource} Resource
 * @typedef {import("../types").LoaderType} LoaderType
 */

/**
 * @implements {ResourceModel}
 */
export default class Skybox extends Group {
  /** @type {Resource} */
  resource;

  constructor() {
    super();

    this.key = "skybox";
  }

  async loadResource() {
    const texture = await loadResource_(
      "envmap",
      "app/models/skybox/assets/skybox.hdr"
    );
    this.resource = texture;

    return texture;
  }
}
