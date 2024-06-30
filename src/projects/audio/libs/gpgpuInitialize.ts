import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import * as THREE from "three";
import gpgpuParticlesShader from "../shader/gpgpu/particles.glsl";
import { IGpgpu } from "../types/IGpgpu";
import { IBaseGeometry } from "../types/Particles";

export const gpgpuInitialize = (
  baseGeometry: IBaseGeometry,
  gl: THREE.WebGLRenderer
) => {
  const size = Math.ceil(Math.sqrt(baseGeometry.count));
  const gpgpu: IGpgpu = {
    size,
    computation: new GPUComputationRenderer(size, size, gl),
    particlesVariable: null,
  };

  //base particles Geometryの頂点座標をテクスチャのrgbaにxyz+randomで格納
  //計算するための座標をテクスチャに渡す
  const baseParticlesTexture = gpgpu.computation.createTexture();
  for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;
    //position base on geometry
    baseParticlesTexture.image.data[i4 + 0] =
      baseGeometry.instance.attributes.position.array[i3 + 0];
    baseParticlesTexture.image.data[i4 + 1] =
      baseGeometry.instance.attributes.position.array[i3 + 1];
    baseParticlesTexture.image.data[i4 + 2] =
      baseGeometry.instance.attributes.position.array[i3 + 2];
    baseParticlesTexture.image.data[i4 + 3] = Math.random();
  }

  gpgpu.particlesVariable = gpgpu.computation.addVariable(
    "uParticles",
    gpgpuParticlesShader,
    baseParticlesTexture
  );

  gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
    gpgpu.particlesVariable,
  ]);

  gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
  gpgpu.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0);
  gpgpu.particlesVariable.material.uniforms.uBase = new THREE.Uniform(
    baseParticlesTexture
  );
  gpgpu.particlesVariable.material.uniforms.uHeight = new THREE.Uniform(0);

  //初期化
  gpgpu.computation.init();

  //debug
  gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
      map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable)
        .texture,
    })
  );
  gpgpu.debug.position.x = 3;

  return gpgpu;
};
