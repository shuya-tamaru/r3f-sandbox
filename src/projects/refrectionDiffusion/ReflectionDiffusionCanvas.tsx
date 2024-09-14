import { Box } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import ReflectionDiffusionComponent from "./ReflectionDiffusionComponent";
import EnvironmentSetting from "../../components/EnvironmentSetting";

export default function ReflectionDiffusionCanvas() {
  return (
    <Box w="100%" h="100%" position={"relative"}>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#fff" }}
        camera={{
          fov: 45,
          near: 0.01,
          far: 20000,
          position: [0, 0, 10],
        }}
      >
        <EnvironmentSetting />
        <ReflectionDiffusionComponent />
        <OrbitControls makeDefault />
      </Canvas>
    </Box>
  );
}
