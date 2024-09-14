import React from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import GUI from "lil-gui";

import vertex from "./shader/vertexShader.glsl";
import fragment from "./shader/fragmentShader.glsl";
import { useFrame } from "@react-three/fiber";

export default function PLaneWaveComponent() {
  const gui = new GUI({ width: 325 });

  const debugObject = {
    colorA: "#0000ff",
    colorB: "#ff0000",
  };

  const uniforms = {
    uTime: new THREE.Uniform(0),
    uPositionFrequency: new THREE.Uniform(0.5),
    uTimeFrequency: new THREE.Uniform(0.4),
    uStrength: new THREE.Uniform(0.3),
    uWarpPositionFrequency: new THREE.Uniform(0.38),
    uWarpTimeFrequency: new THREE.Uniform(0.12),
    uWarpStrength: new THREE.Uniform(0.17),
    uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),
    uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB)),
  };

  gui
    .add(uniforms.uPositionFrequency, "value", 0, 2, 0.001)
    .name("Position Frequency");
  gui.add(uniforms.uTimeFrequency, "value", 0, 2, 0.001).name("Time Frequency");
  gui.add(uniforms.uStrength, "value", 0, 2, 0.001).name("Strength");

  gui
    .add(uniforms.uWarpPositionFrequency, "value", 0, 2, 0.001)
    .name("Warp Position Frequency");
  gui
    .add(uniforms.uWarpTimeFrequency, "value", 0, 2, 0.001)
    .name("Warp Time Frequency");
  gui.add(uniforms.uWarpStrength, "value", 0, 2, 0.001).name("Warp Strength");

  gui
    .addColor(debugObject, "colorA")
    .onChange(() => {
      uniforms.uColorA.value.set(debugObject.colorA);
    })
    .name("Color A");
  gui
    .addColor(debugObject, "colorB")
    .onChange(() => {
      uniforms.uColorB.value.set(debugObject.colorB);
    })
    .name("Color B");

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    uniforms.uTime.value = elapsedTime;
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

  let planeGeometry = new THREE.PlaneGeometry(
    30,
    10,
    100,
    100
  ) as THREE.BufferGeometry;
  planeGeometry = mergeVertices(planeGeometry);
  planeGeometry.computeTangents();

  // let sphereGeometry = new THREE.IcosahedronGeometry(
  //   2.5,
  //   100
  // ) as THREE.BufferGeometry;
  let sphereGeometry = new THREE.TorusGeometry(
    10,
    3,
    200,
    100
  ) as THREE.BufferGeometry;
  sphereGeometry = mergeVertices(sphereGeometry);
  sphereGeometry.computeTangents();

  return (
    <mesh
      rotation={[0, 0, 0]}
      material={customShaderMaterial}
      geometry={sphereGeometry}
    />
  );
}
