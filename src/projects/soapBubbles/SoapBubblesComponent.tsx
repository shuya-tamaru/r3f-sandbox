import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useFrame, useThree } from "@react-three/fiber";

import { useTexture } from "@react-three/drei";

import vertex from "./shader/vertexShader.glsl";
import fragment from "./shader/fragmentShader.glsl";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { useGravity } from "./store/useGravity";

function SoapBubblesComponent() {
  const gravity = useGravity((state) => state.gravity);

  const createRandomPositionScaleArray = () => {
    const positionScaleArray = [];

    for (let i = 0; i < 50; i++) {
      const position = [
        Math.random() * 100 - 5,
        Math.random() * 7 - 5,
        Math.random() * 100 - 5,
      ];

      const scale = [0.75, 0.45, 0.85, 1, 1.25][Math.floor(Math.random() * 5)];
      const uMinWavelength = Math.random() * (400 - 380) + 380;
      const uMaxWavelength = Math.random() * (780 - 640) + 640;

      positionScaleArray.push({
        position,
        scale,
        uMinWavelength,
        uMaxWavelength,
      });
    }

    return positionScaleArray;
  };

  const positionScaleArray = useMemo(
    () => createRandomPositionScaleArray(),
    []
  );

  return (
    <>
      <Physics gravity={[0, gravity ? -100 : 0, 0]}>
        {/* <Pointer /> */}
        {gravity && (
          <>
            <Floor />
            <Walls />
          </>
        )}
        {positionScaleArray.map((positionScale, index) => (
          <SoapBubbleMemo
            key={index}
            scale={positionScale.scale}
            uMinWavelength={positionScale.uMinWavelength}
            uMaxWavelength={positionScale.uMaxWavelength}
          />
        ))}
      </Physics>
    </>
  );
}
export default React.memo(SoapBubblesComponent);

const SoapBubble = ({
  scale,
  uMinWavelength,
  uMaxWavelength,
}: {
  scale: number;
  uMinWavelength: number;
  uMaxWavelength: number;
}) => {
  const { camera } = useThree();

  const api = useRef<any>(null);
  const texture = useTexture("/noiseTexture.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  useFrame(({ clock, camera }, delta) => {
    const elapsedTime = clock.getElapsedTime();
    uniforms.uTime.value = elapsedTime;
    uniforms.uCameraPosition.value = camera.position;

    if (api.current) {
      delta = Math.min(0.1, delta);
      const vec = new THREE.Vector3();
      api.current.applyImpulse(
        vec
          .copy(api.current.translation())
          .normalize()
          .multiply({
            x: -50 * delta * scale,
            y: -50 * delta * scale,
            z: -50 * delta * scale,
          })
      );
    }
  });
  const uniforms = useMemo(() => {
    return {
      uTime: new THREE.Uniform(0),
      uOctaves: new THREE.Uniform(2),
      uTimeFrequency: new THREE.Uniform(0.0016),
      uNoiseStrength: new THREE.Uniform(1.0),
      uMinWavelength: new THREE.Uniform(uMinWavelength),
      uMaxWavelength: new THREE.Uniform(uMaxWavelength),
      uAmplitude: new THREE.Uniform(0),
      uFrequency: new THREE.Uniform(0.005),
      uOpacity: new THREE.Uniform(0.3),
      uNoiseTexture: new THREE.Uniform(texture),
      uCameraPosition: new THREE.Uniform(camera.position),
    };
  }, [camera.position, texture, uMinWavelength, uMaxWavelength]);

  const customShaderMaterial = useMemo(() => {
    return new CustomShaderMaterial({
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
  }, [uniforms]);

  let sphereGeometry = useMemo(() => {
    let geo = new THREE.SphereGeometry(1, 20, 20) as THREE.BufferGeometry;
    geo = mergeVertices(geo);
    geo.computeTangents();
    return geo;
  }, []);

  const r = THREE.MathUtils.randFloatSpread;

  return (
    <RigidBody
      ref={api}
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        castShadow
        rotation={[0, 0, 0]}
        scale={new THREE.Vector3(scale, scale, scale)}
        material={customShaderMaterial}
        geometry={sphereGeometry}
      />
    </RigidBody>
  );
};

const SoapBubbleMemo = React.memo(SoapBubble);

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<any>();
  useFrame(({ mouse, viewport }) => {
    vec.lerp(
      {
        x: (mouse.x * viewport.width) / 2,
        y: (mouse.y * viewport.height) / 2,
        z: 0,
      },
      0.2
    );
    ref.current?.setNextKinematicTranslation(vec);
  });
  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

function Floor() {
  return (
    <RigidBody
      position={[0, -3, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      type="fixed"
      colliders={false}
    >
      <mesh receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
      <CuboidCollider args={[25, 0.1, 25]} rotation={[-Math.PI / 2, 0, 0]} />
    </RigidBody>
  );
}

function Walls() {
  const wallThickness = 0.5; // 壁の厚さ
  const wallHeight = 10; // 壁の高さ
  const floorSize = 20; // 床のサイズと同じにする

  return (
    <>
      {/* 左の壁 */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[-(floorSize / 2), wallHeight / 2 - 3, 0]}
      >
        <CuboidCollider args={[wallThickness, wallHeight / 2, floorSize / 2]} />
      </RigidBody>

      {/* 右の壁 */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[floorSize / 2, wallHeight / 2 - 3, 0]}
      >
        <CuboidCollider args={[wallThickness, wallHeight / 2, floorSize / 2]} />
      </RigidBody>

      {/* 前の壁 */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, wallHeight / 2 - 3, -(floorSize / 2)]}
      >
        <CuboidCollider args={[floorSize / 2, wallHeight / 2, wallThickness]} />
      </RigidBody>

      {/* 後ろの壁 */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, wallHeight / 2 - 3, floorSize / 2]}
      >
        <CuboidCollider args={[floorSize / 2, wallHeight / 2, wallThickness]} />
      </RigidBody>
    </>
  );
}
