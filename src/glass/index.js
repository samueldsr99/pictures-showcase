import {
  DodecahedronGeometry,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
} from "three";

export default class Glass extends Group {
  constructor() {
    super();

    this._init();
  }

  _init() {
    const geometry = new IcosahedronGeometry(3.2, 0);
    const material = new MeshPhysicalMaterial({
      roughness: 0.1,
      transmission: 1,
      thickness: 0.1,

      // White
      color: 0xffffff,
    });

    const outlineGeometry = new EdgesGeometry(geometry);
    // dark gray
    const outlineMaterial = new MeshBasicMaterial({ color: 0x333333 });
    const outline = new LineSegments(outlineGeometry, outlineMaterial);

    this.mesh = new Mesh(geometry, material);
    this.mesh.add(outline);
    this.position.set(0, 0, 30);
    this.scale.set(4, 4, 4);
    this.add(this.mesh);
  }

  update({ delta }) {
    this.rotateY(0.01);
    this.rotateX(0.01);
  }
}
