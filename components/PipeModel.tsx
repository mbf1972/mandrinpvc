import React, { useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { PipeState } from '../types';
import { generateGrooveTexture } from '../services/textureGenerator';

interface PipeModelProps {
  config: PipeState;
}

// We use forwardRef to allow wrapping components (like TransformControls) 
// to access the underlying mesh
const PipeModel = forwardRef<THREE.Mesh, PipeModelProps>(({ config }, ref) => {
  
  // Convert mm to meters for Three.js scene (1 unit = 1 meter)
  // This keeps lighting calculations realistic
  const outerRadius = (config.outerDiameter / 2) / 1000;
  const wallThickness = config.wallThickness / 1000;
  const length = config.length / 1000;
  const innerRadius = outerRadius - wallThickness;

  // Generate Geometry: Extruded Ring
  // We use ExtrudeGeometry because standard CylinderGeometry is solid.
  // To show wall thickness properly, we define a shape with a hole.
  const geometry = useMemo(() => {
    // 1. Create the outer circle shape
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    // 2. Create the inner hole path
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // 3. Extrude settings
    const extrudeSettings = {
      depth: length,
      bevelEnabled: true,
      bevelThickness: 0.002, // Slight bevel for realism
      bevelSize: 0.002,
      bevelSegments: 2,
      curveSegments: 64, // Smoothness of the circle
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center the geometry so rotation happens around the center
    geo.center(); 
    
    return geo;
  }, [outerRadius, innerRadius, length]);

  // Generate Procedural Texture for "Grooves"
  const bumpMap = useMemo(() => {
    const dataUrl = generateGrooveTexture();
    const loader = new THREE.TextureLoader();
    const tex = loader.load(dataUrl);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, length * 10); // Stretch based on length
    return tex;
  }, [length]);

  return (
    <mesh 
      ref={ref} 
      geometry={geometry} 
      castShadow 
      receiveShadow
      rotation={[Math.PI / 2, 0, 0]} // Rotate to lay flat initially
    >
      <meshStandardMaterial
        color={config.color}
        roughness={0.3}
        metalness={0.1}
        bumpMap={bumpMap}
        bumpScale={0.005}
      />
    </mesh>
  );
});

export default PipeModel;