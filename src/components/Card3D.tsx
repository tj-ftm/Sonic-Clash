import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { NFTCard } from '../types/game';

interface Card3DProps {
  card: NFTCard;
  position: [number, number, number];
  rotation?: [number, number, number];
  isSelected?: boolean;
  isAnimating?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({ 
  card, 
  position, 
  rotation = [0, 0, 0],
  isSelected = false,
  isAnimating = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(card.image);
  
  // Create material with the card texture
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x111111)
    }), // Right
    new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x111111)
    }), // Left
    new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x111111)
    }), // Top
    new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x111111)
    }), // Bottom
    new THREE.MeshStandardMaterial({ 
      map: texture,
      metalness: 0.5,
      roughness: 0.5,
      emissive: new THREE.Color(0x222222)
    }), // Front
    new THREE.MeshStandardMaterial({ 
      color: 0x000066,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x000033)
    }), // Back
  ], [texture]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isAnimating) {
      meshRef.current.rotation.y += delta * 2;
    }

    if (isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[rotation[0], rotation[1] + Math.sin(state.clock.elapsedTime) * 0.1, rotation[2]]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1.4, 0.05]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
};

export default Card3D;