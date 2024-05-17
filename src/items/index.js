import { gsap } from "gsap";
import Item from "../item";
import { MathUtils, Group, Raycaster } from "three";

export default class Items extends Group {
  constructor(camera) {
    super();

    const ITEMS = [
      new Item({
        imagePath: "src/item/assets/images/cq5dam.web.hebebed.2000.2000.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-1.png",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/agatha-ruiz-de-la-prada.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath:
          "src/item/assets/images/PRADA_MENS-SS24-CAMPAIGN_06-scaled.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath:
          "src/item/assets/images/29432eea0f5ff8cf63c16da59d73a683.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-2.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-3.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-4.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-5.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-6.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-7.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-8.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-9.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-10.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-11.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
      new Item({
        imagePath: "src/item/assets/images/prada-12.jpg",
        title: "Cotton Twill Pants",
        description: "A pair of cotton twill pants",
      }),
    ];

    this._items = ITEMS;
    this._camera = camera;
    this._currentInFront = null;

    this._init();
  }

  _generatePoints(N, gap) {
    const points = [];
    const gridSize = Math.ceil(Math.sqrt(N));
    const randomRange = gap * 0.1; // Define el rango de ruido como el 10% del gap (puedes ajustar este valor)

    let count = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (count >= N) break;

        // Calcular posición de la cuadrícula
        const x = i * gap;
        const y = j * gap;

        // Agregar ruido aleatorio a los puntos
        const noiseX = x + MathUtils.randFloat(-randomRange, randomRange);
        const noiseY = y + MathUtils.randFloat(-randomRange, randomRange);

        // Trasladar para que el centro sea el origen
        const centeredX = noiseX - (gridSize * gap) / 2;
        const centeredY = noiseY - (gridSize * gap) / 2;

        points.push({ x: centeredX, y: centeredY });
        count++;
      }
    }

    return points;
  }

  _init() {
    // Organize elements in a grid-like way
    const N = this._items.length;

    const points = this._generatePoints(N, 23.2);

    for (let i = 0, n = this._items.length; i < n; i++) {
      const item = this._items[i];

      item.position.x = points[i].x;
      item.position.y = points[i].y;

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
        gsap.to(this._camera.position, {
          x: item.position.x,
          y: item.position.y,
          duration: 0.5,
        });

        if (item._isInFront) {
          item.resetPosition();
        } else {
          item.bringToFront();
          this._currentInFront = item;
        }
      }
    }
  }

  update({ walkDirection, delta }) {
    for (let i = 0, n = this._items.length; i < n; i++) {
      this._items[i].update({ walkDirection, delta });
    }
  }
}