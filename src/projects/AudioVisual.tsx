import React, { useRef } from "react";
import * as THREE from "three";
import vertex from "./audio/shader/audio/vertex.glsl";
import fragment from "./audio/shader/audio/fragment.glsl";
import { useFrame } from "@react-three/fiber";
import usePlay from "../stores/usePlay";
import useGetAudio from "../hooks/useGetAudio";

export default function AudioVisual() {
  const geometry = new THREE.SphereGeometry(64, 32, 32);
  const vertexCount = geometry.attributes.position.count;
  const vertexIndices = new Float32Array(vertexCount);
  const randoms = new Float32Array(vertexCount);
  for (let i = 0; i < vertexCount; i++) {
    vertexIndices[i] = i;
    randoms[i] = Math.random();
  }
  vertexIndices.sort(() => Math.random() - 0.5);
  geometry.setAttribute(
    "aVertexIndex",
    new THREE.BufferAttribute(vertexIndices, 1)
  );
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    wireframe: true,
    uniforms: {
      uDataArray: { value: null },
      uTime: { value: 0 },
    },
  });

  return (
    <>
      <mesh geometry={geometry} material={material} />
      <Effect material={material} />
    </>
  );
}

const Effect = ({ material }: { material: THREE.ShaderMaterial }) => {
  const playState = usePlay((state) => state.playState);
  const { dataArray } = useGetAudio(playState);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uDataArray.value = dataArray;
  });

  return <></>;
};
