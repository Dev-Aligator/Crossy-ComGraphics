import { Box3 } from "three";
import { Platform } from "react-native";

export function GetHeight(mesh) {
  let box3 = new Box3();
  box3.setFromObject(mesh);
  return Math.round(box3.max.y - box3.min.y);
}

export function GetLength(mesh) {
  let box3 = new Box3();
  box3.setFromObject(mesh);
  return Math.round(box3.max.x - box3.min.x);
}

export function GetWidth(mesh) {
  let box3 = new Box3();
  box3.setFromObject(mesh);
  return Math.round(box3.max.z - box3.min.z);
}

export function ScaleMeshWidthToSize(mesh, size) {
  const {
    x: width,
    y: height,
    z: depth,
  } = new Box3().setFromObject(mesh).getSize(new THREE.Vector3());
  const scale = size / width;
  mesh.scale.set(scale, scale, scale);
}

export function generateTextShadow(width) {
  return Platform.select({
    web: {
      textShadow: `-${width}px 0px 0px #000, ${width}px 0px 0px #000, 0px -${width}px 0px #000, 0px ${width}px 0px #000`,
    },
    default: {},
  });
}
