import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Box } from "@chakra-ui/react";

import PlayButton from "../PlayButton";
import Particles from "../Particles";
import AudioVisual from "../AudioVisual";

export default function AudioCanvas() {
  return (
    <Box w="100%" h="100%" position={"relative"}>
      <Canvas
        style={{ width: "100vw", height: "100vh", background: "#333" }}
        camera={{
          fov: 45,
          near: 0.001,
          far: 20000,
          position: [64, 64, 64],
        }}
      >
        <OrbitControls makeDefault />
        {/* <axesHelper scale={200} /> */}
        {/* <Particles /> */}
        <AudioVisual />
      </Canvas>
      <PlayButton />
    </Box>
  );
}
