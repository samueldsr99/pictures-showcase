import { Group } from "three";

export type LoaderType = "gltf" | "texture" | "rgbe";

/**
 * Loaded resource object
 */
export interface Resource {
  scene: Group;
}

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
