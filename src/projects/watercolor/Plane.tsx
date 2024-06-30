import React, { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import { useFBO } from "@react-three/drei";

export default function Plane() {
  const { raycaster, camera, viewport, gl } = useThree();
  const pointer = new THREE.Vector2();
  const raycastPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  );
  const dummy = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  const sourceTarget = new THREE.WebGLRenderTarget(
    viewport.width,
    viewport.height
  );
  const fboScene = new THREE.Scene();
  const fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const fboMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: sourceTarget.texture },
      resolution: {
        value: new THREE.Vector4(viewport.width, viewport.height, 1, 1),
      },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  const fboQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fboMaterial);

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(raycastPlane);
      if (intersects.length > 0) {
        const position = intersects[0].point;
        dummy.position.copy(position);
      }
    });

    fboScene.add(fboQuad);
    gl.render(fboScene, fboCamera); // Render fboScene

    return () => {
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  return <primitive object={dummy} />;
}
