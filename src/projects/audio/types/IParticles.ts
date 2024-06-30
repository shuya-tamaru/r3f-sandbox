import * as THREE from "three";

export type IParticles = {
  geometry: THREE.BufferGeometry | null;
  material: THREE.ShaderMaterial | null;
  points: THREE.Points | null;
};
