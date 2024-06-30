import * as THREE from "three";
import { IGpgpu } from "../types/IGpgpu";
import { IParticles } from "../types/IParticles";
import { IBaseGeometry } from "../types/Particles";

export const getParticles = (
  baseGeometry: IBaseGeometry,
  gpgpu: IGpgpu,
  particleMaterial: THREE.ShaderMaterial
) => {
  const particles: IParticles = {
    geometry: null,
    material: null,
    points: null,
  };

  const particlesUvArray = new Float32Array(baseGeometry.count * 2);
  const sizesArray = new Float32Array(baseGeometry.count);

  for (let y = 0; y < gpgpu.size; y++) {
    for (let x = 0; x < gpgpu.size; x++) {
      const i = y * gpgpu.size + x;
      const i2 = i * 2;

      const uxX = (x + 0.5) / gpgpu.size;
      const uvY = (y + 0.5) / gpgpu.size;

      particlesUvArray[i2 + 0] = uxX;
      particlesUvArray[i2 + 1] = uvY;

      sizesArray[i] = Math.random();
    }
  }
  particles.geometry = new THREE.BufferGeometry();
  particles.geometry.setDrawRange(0, baseGeometry.count);
  particles.geometry.setAttribute(
    "aParticlesUv",
    new THREE.BufferAttribute(particlesUvArray, 2)
  );
  // particles.geometry.setAttribute(
  //   "aColor",
  //   baseGeometry.instance.attributes.color
  // );
  particles.geometry.setAttribute(
    "aSize",
    new THREE.BufferAttribute(sizesArray, 1)
  );

  particles.material = particleMaterial;

  particles.points = new THREE.Points(particles.geometry, particles.material);
  return particles;
};
