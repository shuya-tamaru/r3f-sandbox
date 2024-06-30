import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";
import * as THREE from "three";

export type IGpgpu = {
  size: number;
  computation: GPUComputationRenderer;
  particlesVariable: any;
  debug?: THREE.Mesh;
};
