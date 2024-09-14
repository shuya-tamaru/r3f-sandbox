import { Box } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import PLaneWaveComponent from "./PLaneWaveComponent";
import EnvironmentSetting from "../../components/EnvironmentSetting";

export default function PlaneWaveCanvas() {
  return (
    <Box w="100%" h="100%" position={"relative"}>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#333" }}
        camera={{
          fov: 45,
          near: 0.01,
          far: 20000,
          position: [0, 0, 20],
        }}
      >
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <EnvironmentSetting />
        <PLaneWaveComponent />
        <OrbitControls makeDefault />
      </Canvas>
    </Box>
  );
}
