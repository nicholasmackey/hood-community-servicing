import { writeFile } from 'node:fs/promises';
import {
  Box3,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
  Vector3,
} from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

// Node does not expose FileReader, which GLTFExporter uses to assemble a GLB.
globalThis.FileReader = class FileReader {
  result = null;
  onloadend = null;

  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.();
  }
};

const shapeFrom = (draw) => {
  const shape = new Shape();
  draw(shape);
  return shape;
};

// These four contours are the exact paths from public/hood-mark.svg. Keeping
// the source geometry here makes the small, bevelled GLB reproducible.
const shapes = [
  shapeFrom((s) => {
    s.moveTo(158.136, 179.971);
    s.bezierCurveTo(158.516, 180.351, 158.247, 181, 157.708, 181);
    s.lineTo(82.6387, 181);
    s.bezierCurveTo(82.1004, 181, 81.8307, 180.351, 82.2114, 179.971);
    s.lineTo(113.708, 148.544);
    s.bezierCurveTo(113.822, 148.431, 113.975, 148.367, 114.136, 148.367);
    s.lineTo(126.211, 148.367);
    s.bezierCurveTo(126.372, 148.367, 126.525, 148.431, 126.639, 148.544);
    s.lineTo(158.136, 179.971);
    s.closePath();
  }),
  shapeFrom((s) => {
    s.moveTo(68.2443, 90.2783);
    s.bezierCurveTo(68.5895, 90.6228, 68.4041, 91.2159, 67.9274, 91.3207);
    s.bezierCurveTo(54.8601, 94.1919, 45.0896, 105.718, 45.0896, 119.5);
    s.bezierCurveTo(45.0896, 133.041, 54.5215, 144.402, 67.2448, 147.519);
    s.bezierCurveTo(67.7122, 147.634, 67.8868, 148.218, 67.5465, 148.557);
    s.lineTo(41.7869, 174.26);
    s.bezierCurveTo(41.6037, 174.442, 41.3236, 174.488, 41.0922, 174.372);
    s.bezierCurveTo(20.8628, 164.221, 7, 143.461, 7, 119.5);
    s.bezierCurveTo(7, 95.3095, 21.1289, 74.3814, 41.6739, 64.3389);
    s.bezierCurveTo(41.9045, 64.2262, 42.1815, 64.2732, 42.3631, 64.4543);
    s.lineTo(68.2443, 90.2783);
    s.closePath();
  }),
  shapeFrom((s) => {
    s.moveTo(197.868, 64.5687);
    s.bezierCurveTo(198.05, 64.3869, 198.329, 64.3403, 198.56, 64.4544);
    s.bezierCurveTo(218.978, 74.541, 233, 95.4013, 233, 119.5);
    s.bezierCurveTo(233, 143.37, 219.242, 164.062, 199.139, 174.254);
    s.bezierCurveTo(198.907, 174.372, 198.626, 174.326, 198.442, 174.143);
    s.lineTo(172.729, 148.487);
    s.bezierCurveTo(172.39, 148.149, 172.561, 147.568, 173.024, 147.45);
    s.bezierCurveTo(185.611, 144.24, 194.91, 132.945, 194.91, 119.5);
    s.bezierCurveTo(194.91, 105.815, 185.276, 94.3557, 172.347, 91.3843);
    s.bezierCurveTo(171.874, 91.2756, 171.693, 90.6861, 172.036, 90.3436);
    s.lineTo(197.868, 64.5687);
    s.closePath();
  }),
  shapeFrom((s) => {
    s.moveTo(125.777, 90.4564);
    s.bezierCurveTo(125.664, 90.5695, 125.51, 90.633, 125.35, 90.633);
    s.lineTo(114.997, 90.633);
    s.bezierCurveTo(114.837, 90.633, 114.683, 90.5695, 114.57, 90.4564);
    s.lineTo(83.073, 59.0293);
    s.bezierCurveTo(82.6923, 58.6495, 82.9619, 58, 83.5003, 58);
    s.lineTo(156.847, 58);
    s.bezierCurveTo(157.385, 58, 157.655, 58.6495, 157.274, 59.0293);
    s.lineTo(125.777, 90.4564);
    s.closePath();
  }),
];

const material = new MeshStandardMaterial({
  color: 0xdf231c,
  metalness: 0.03,
  roughness: 0.72,
});
const mark = new Group();
mark.name = 'HOOD_mark';

for (const shape of shapes) {
  const geometry = new ExtrudeGeometry(shape, {
    depth: 30,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 1.25,
    bevelThickness: 1.75,
    curveSegments: 12,
  });
  const mesh = new Mesh(geometry, material);
  mesh.name = 'HOOD_mark_segment';
  mark.add(mesh);
}

const box = new Box3().setFromObject(mark);
const center = box.getCenter(new Vector3());
mark.position.set(-center.x, -center.y, -center.z);
mark.scale.setScalar(0.01);

const exporter = new GLTFExporter();
const binary = await exporter.parseAsync(mark, {
  binary: true,
  onlyVisible: true,
  trs: false,
});

await writeFile(new URL('../public/models/hood-mark.glb', import.meta.url), Buffer.from(binary));
