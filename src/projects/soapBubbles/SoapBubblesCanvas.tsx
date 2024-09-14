import { Box } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { EffectComposer, N8AO } from "@react-three/postprocessing";

import SoapBubblesComponent from "./SoapBubblesComponent";
import EnvironmentSetting from "../../components/EnvironmentSetting";
import Overlay from "./Overlay";
import Underlay from "./Underlay";

export default function SoapBubblesCanvas() {
  return (
    <>
      <Box w="100%" h="100%" position={"relative"} overflow={"hidden"}>
        <Underlay />
        <Canvas
          style={{
            width: "100%",
            height: "100vh",
            zIndex: 2,
          }}
          gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
          camera={{ position: [0, 3, 17], fov: 32.5, near: 1, far: 1000 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        >
          <EnvironmentSetting />
          <SoapBubblesComponent />
          <OrbitControls makeDefault />
          <EffectComposer enableNormalPass={false}>
            <N8AO color="red" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
        <Overlay />
      </Box>
    </>
  );
}
