import { Mesh, TextureLoader } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { match_ } from "../utils/match";

export const loaders = {
  texture: TextureLoader,
  gltf: GLTFLoader,
  rgbe: RGBELoader,
};

/**
 * @param {import("./types").LoaderType} type
 * @param {string} path
 */
export const loadResource = (type, path) =>
  match_({
    value: type,
    branches: [
      {
        pattern: "gltf",
        result: async () => {
          const loader = new GLTFLoader();
          /** @type {any} */
          return await loader.loadAsync(path);
        },
      },
      {
        pattern: "texture",
        result: async () => {
          const loader = new TextureLoader();
          /** @type {any} */
          return await loader.loadAsync(path);
        },
      },
      {
        pattern: "rgbe",
        result: async () => {
          const loader = new RGBELoader();
          /** @type {any} */
          return await loader.loadAsync(path);
        },
      },
      {
        pattern: "envmap",
        result: async () => {
          const loader = new RGBELoader();
          /** @type {any} */
          return await loader.loadAsync(path);
        },
      },
    ],
    fallback: () => {
      throw new Error(`Unknown loader type: ${type}`);
    },
  });
