import { DataTexture, Group } from "three";

export type LoaderType = "gltf" | "texture" | "rgbe" | "envmap";

/**
 * Loaded resource object
 */
export type Resource =
  | {
      scene: Group;
    }
  | DataTexture;

/**
 * Base model interface
 */
export interface Model {
  key: string;

  update?: (...args: any[]) => void;
}

/**
 * A model that has a resource
 */
export interface ResourceModel extends Model {
  resource: Resource;
  loadResource: () => Promise<Resource>;
}

export type IUniforms = { [key: string]: IUniform<any> };
