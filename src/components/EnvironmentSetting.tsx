import React from "react";
import { Environment } from "@react-three/drei";

export default function EnvironmentSetting() {
  return (
    <>
      <fog attach="fog" args={["#fff", 0.1, 1000]} />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={3} position={[0.25, 2, -2.25]} />
      <Environment files="/hdr.hdr" background />
    </>
  );
}
