import React, { useMemo } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useFrame, useThree } from "@react-three/fiber";

import { useTexture } from "@react-three/drei";
import GUI from "lil-gui";

import vertex from "./shader/vertexShader.glsl";
import fragment from "./shader/fragmentShader.glsl";

export default function ReflectionDiffusionComponent() {
  const gui = new GUI({ width: 325 });

  const { camera } = useThree();

  const texture = useTexture("/noiseTexture.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
      uOctaves: new THREE.Uniform(2),
      uTimeFrequency: new THREE.Uniform(0.0016),
      uNoiseStrength: new THREE.Uniform(1.0),
      uMinWavelength: new THREE.Uniform(380.0),
      uMaxWavelength: new THREE.Uniform(780.0),
      uAmplitude: new THREE.Uniform(1.0),
      uFrequency: new THREE.Uniform(0.005),
      uOpacity: new THREE.Uniform(0.4),
      uNoiseTexture: new THREE.Uniform(texture),
      uCameraPosition: new THREE.Uniform(camera.position),
    };
  }, [camera.position, texture]);

  gui
    .add(uniforms.uTimeFrequency, "value", 0.001, 0.1, 0.001)
    .name("Time Frequency");
  gui
    .add(uniforms.uNoiseStrength, "value", 0, 10.0, 1.0)
    .name("Noise Strength");
  gui
    .add(uniforms.uMinWavelength, "value", 380, 780, 10)
    .name("Min Wavelength");
  gui
    .add(uniforms.uMaxWavelength, "value", 380, 780, 10)
    .name("Max Wavelength");
  gui.add(uniforms.uAmplitude, "value", 0, 2, 0.001).name("uAmplitude");
  gui.add(uniforms.uOctaves, "value", 1, 10, 1).name("Octaves");

  gui.add(uniforms.uFrequency, "value", 0, 0.05, 0.001).name("Frequency");
  gui.add(uniforms.uOpacity, "value", 0, 1.0, 0.1).name("Opacity");

  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();
    uniforms.uTime.value = elapsedTime;
    uniforms.uCameraPosition.value = camera.position;
  });

  const customShaderMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    envMapIntensity: 0.3,
    silent: true,
    metalness: 0,
    roughness: 0.5,
    ior: 1.5,
    thickness: 1.5,
    transparent: true,
    wireframe: false,
  });

  let sphereGeometry = new THREE.IcosahedronGeometry(
    2.5,
    100
  ) as THREE.BufferGeometry;

  sphereGeometry = mergeVertices(sphereGeometry);
  sphereGeometry.computeTangents();

  return (
    <>
      <mesh
        castShadow
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
        material={customShaderMaterial}
        geometry={sphereGeometry}
      />
    </>
  );
}
