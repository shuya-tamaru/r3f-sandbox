import React from "react";

export default function Teleport() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.5, 10]} />
      <meshBasicMaterial color="hotpink" wireframe />
    </mesh>
  );
}
