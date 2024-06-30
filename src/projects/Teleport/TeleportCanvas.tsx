import { Box } from "@chakra-ui/react";
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import Teleport from "./Teleport";

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
          position: [1, 1, 1],
        }}
      >
        <XR>
          <Controllers />
          <Hands />
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </XR>
        <OrbitControls makeDefault />
      </Canvas>
    </Box>
  );
}
