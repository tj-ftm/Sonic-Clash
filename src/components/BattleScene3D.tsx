import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { NFTCard } from '../types/game';
import Card3D from './Card3D';
import LoadingSpinner from './LoadingSpinner';

interface BattleScene3DProps {
  playerCards: NFTCard[];
  opponentCards: NFTCard[];
  selectedCardIndex: number;
  currentTurn: number;
  isAnimating: boolean;
}

const BattleScene3D: React.FC<BattleScene3DProps> = ({
  playerCards,
  opponentCards,
  selectedCardIndex,
  currentTurn,
  isAnimating
}) => {
  return (
    <div className="w-full h-[600px] bg-bg-dark rounded-lg overflow-hidden">
      <Suspense fallback={<LoadingSpinner message="Loading 3D scene..." />}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          <OrbitControls 
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} castShadow />
          
          {/* Player Cards */}
          {playerCards.map((card, index) => (
            <Card3D
              key={card.tokenId}
              card={card}
              position={[index * 1.2 - 2, 0, 1]}
              rotation={[0, 0, 0]}
              isSelected={index === selectedCardIndex}
              isAnimating={isAnimating && index === selectedCardIndex}
            />
          ))}
          
          {/* Opponent Cards */}
          {opponentCards.map((card, index) => (
            <Card3D
              key={card.tokenId}
              card={card}
              position={[index * 1.2 - 2, 0, -1]}
              rotation={[0, Math.PI, 0]}
              isSelected={index === selectedCardIndex}
              isAnimating={isAnimating && index === selectedCardIndex}
            />
          ))}
          
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          
          <Environment preset="night" />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default BattleScene3D;