// import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import usePlay from "../stores/usePlay";
import useGetAudio from "../hooks/useGetAudio";
import { IGpgpu } from "./audio/types/IGpgpu";
import { gpgpuInitialize } from "./audio/libs/gpgpuInitialize";
import { IBaseGeometry } from "./audio/types/Particles";
import { useFrame, useThree } from "@react-three/fiber";
import { getParticles } from "./audio/libs/getParticles";
import vertex from "./audio/shader/particles/vertex.glsl";
import fragment from "./audio/shader/particles/fragment.glsl";
import { IParticles } from "./audio/types/IParticles";

type BaseGeometry = {
  instance: THREE.BufferGeometry | null;
  count: number;
};

export default function Particles() {
  const { viewport, gl } = useThree();

  const particleMaterial = useMemo(() => {
    const pixelRatio = window.devicePixelRatio;
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uSize: new THREE.Uniform(10.5),
        uResolution: new THREE.Uniform(
          new THREE.Vector2(
            viewport.width * pixelRatio,
            viewport.height * pixelRatio
          )
        ),
        uParticlesTexture: new THREE.Uniform(null),
      },
    });

    return material;
  }, []);

  const { base, geometry, positions } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const rotation = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    geometry.applyMatrix4(rotation);

    const base: IBaseGeometry = {
      instance: geometry,
      count: geometry.attributes.position.count,
    };

    return { base, geometry, positions: geometry.attributes.position.array };
  }, []);

  const gpgpu: IGpgpu = gpgpuInitialize(base, gl);
  const particles = getParticles(base, gpgpu, particleMaterial);

  // useParticleEffect({ gpgpu, particles });
  console.log("hi");

  return (
    <>
      <primitive object={particles.points as THREE.Points} />
      <ParticleEffect gpgpu={gpgpu} particles={particles} />
    </>
  );
}

type Props = {
  gpgpu: IGpgpu;
  particles: IParticles;
};

const ParticleEffect = ({ gpgpu, particles }: Props) => {
  const playState = usePlay((state) => state.playState);
  const { maximum } = useGetAudio(playState);

  useFrame((state, delta) => {
    gpgpu.computation.compute();
    if (particles.material) {
      particles.material.uniforms.uParticlesTexture.value =
        gpgpu.computation.getCurrentRenderTarget(
          gpgpu.particlesVariable
        ).texture;
      gpgpu.particlesVariable.material.uniforms.uTime.value =
        state.clock.elapsedTime;
      gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = delta;
      gpgpu.particlesVariable.material.uniforms.uHeight.value = maximum;
    }
  });
  return <></>;
};
