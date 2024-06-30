import { Box } from "@chakra-ui/react";
import {
  VRButton,
  ARButton,
  XR,
  Controllers,
  Hands,
  useXREvent,
} from "@react-three/xr";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import Teleport from "./Teleport";
import * as THREE from "three";
import { TransformControls as TransformControlsImpl } from "three-stdlib";

export default function TeleportCanvas() {
  return (
    <Box w="100%" h="100%" position={"relative"}>
      <VRButton />
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#000" }}
        camera={{
          fov: 45,
          near: 0.001,
          far: 200,
          position: [5, 5, 5],
        }}
      >
        <XR>
          <Controllers />
          <Hands />
          <InteractiveMesh />
          <ambientLight />
          <directionalLight position={[0, 10, 0]} intensity={1} />
        </XR>
        <OrbitControls makeDefault />
      </Canvas>
    </Box>
  );
}

function InteractiveMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<TransformControlsImpl>(null);
  const { gl, camera } = useThree();

  // Event handler for controller interaction
  useXREvent("selectstart", () => {
    if (transformRef.current && meshRef.current) {
      transformRef.current.attach(meshRef.current);
    }
  });

  useXREvent("selectend", () => {
    if (transformRef.current) {
      transformRef.current.detach();
    }
  });

  return (
    <TransformControls ref={transformRef} mode="translate">
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </TransformControls>
  );
}
