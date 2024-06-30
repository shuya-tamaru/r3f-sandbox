import { Box } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import Plane from "./Plane";

export default function WaterColorCanvas() {
  return (
    <Box w="100%" h="100%" position={"relative"}>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#000" }}
        camera={{
          fov: 45,
          near: 0.01,
          far: 20000,
          position: [0, 0, 5],
        }}
      >
        <Plane />
        <OrbitControls makeDefault />
      </Canvas>
    </Box>
  );
}
