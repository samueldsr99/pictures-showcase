import { IUniform } from "three";
import type { IUniforms } from "../types";

export interface Uniforms extends IUniforms {
  uTime: IUniform<number>;
}
