import Item from "../item";
import { MathUtils, Group, Raycaster } from "three";

const ITEMS = [
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
  new Item({
    imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
    title: "Cotton Twill Pants",
    description: "A pair of cotton twill pants",
  }),
];

export default class Items extends Group {
  constructor(camera) {
    super();
    this._items = ITEMS;
    this._camera = camera;
    this._currentInFront = null;

    this._init();
  }

  _init() {
    for (const item of this._items) {
      item.position.set(
        MathUtils.randFloat(-20, 20),
        MathUtils.randFloat(-20, 20),
        0
      );
      this.add(item);
    }
  }

  /**
   *
   * @param {PointerEvent} e
   */
  onClick(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new Raycaster();
    raycaster.setFromCamera({ x, y }, this._camera);

    const intersections = raycaster.intersectObjects(this._items, true);

    let uuid = null;
    if (intersections.length > 0) {
      const item = intersections[0].object;
      uuid = item.uuid;
    }

    if (this._currentInFront) {
      this._currentInFront.resetPosition();
      this._currentInFront = null;
      return;
    }

    for (const item of this._items) {
      if (item.children[0].uuid === uuid) {
        this._camera.position.x = item.position.x;
        this._camera.position.y = item.position.y;

        if (item._isInFront) {
          item.resetPosition();
        } else {
          item.bringToFront();
          this._currentInFront = item;
        }
      }
    }
  }

  update() {
    const time = performance.now() * 0.001;

    for (let i = 0, n = this._items.length; i < n; i++) {
      this._items[0].update();
    }
  }
}
