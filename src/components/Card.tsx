import React from 'react';
import { motion } from 'framer-motion';
import { NFTCard, Rarity } from '../types/game';
import { Shield, Sword, Zap, Sparkles } from 'lucide-react';

interface CardProps {
  card: NFTCard;
  onClick?: () => void;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  isSelected = false, 
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  // Determine styles based on rarity
  const getRarityColor = (rarity: Rarity): string => {
    switch (rarity) {
      case Rarity.COMMON:
        return 'border-gray-400 shadow-gray-400/20';
      case Rarity.UNCOMMON:
        return 'border-green-400 shadow-green-400/30';
      case Rarity.RARE:
        return 'border-blue-400 shadow-blue-400/30';
      case Rarity.EPIC:
        return 'border-neon-purple shadow-neon-purple/30';
      case Rarity.LEGENDARY:
        return 'border-neon-yellow shadow-neon-yellow/40';
      default:
        return 'border-gray-400';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'w-32 h-44';
      case 'lg':
        return 'w-64 h-88';
      case 'md':
      default:
        return 'w-48 h-64';
    }
  };

  const rarityColor = getRarityColor(card.traits.rarity);
  const sizeClasses = getSizeClasses();

  return (
    <motion.div
      className={`${sizeClasses} rounded-lg cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`relative h-full overflow-hidden rounded-lg border-4 ${rarityColor} ${
          isSelected ? 'ring-4 ring-neon-pink' : ''
        } transition-all pixelated`}
      >
        {/* Card Image */}
        <div className="relative h-3/5 overflow-hidden bg-bg-card">
          <img 
            src={card.image} 
            alt={card.name}
            className="w-full h-full object-cover pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Rarity Badge */}
          <div className="absolute top-2 right-2 bg-bg-dark px-1 py-0.5 rounded text-xs font-pixel flex items-center">
            <Sparkles className="w-3 h-3 text-neon-yellow mr-1" />
            <span 
              className={`text-${
                card.traits.rarity === Rarity.LEGENDARY 
                  ? 'neon-yellow' 
                  : card.traits.rarity === Rarity.EPIC 
                    ? 'neon-purple' 
                    : 'white'
              }`}
            >
              {card.traits.rarity}
            </span>
          </div>
        </div>
        
        {/* Card Info */}
        <div className="h-2/5 bg-bg-card p-2 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-pixel text-sm truncate">{card.name}</h3>
            
            {showDetails && (
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <Sword className="w-3 h-3 text-red-400 mr-1" />
                  <span className="text-white">{card.traits.attack}</span>
                  
                  <Shield className="w-3 h-3 text-blue-400 ml-2 mr-1" />
                  <span className="text-white">{card.traits.defense}</span>
                  
                  <Zap className="w-3 h-3 text-yellow-400 ml-2 mr-1" />
                  <span className="text-white">{card.traits.speed}</span>
                </div>
                
                <div className="text-xs font-pixel truncate">
                  <span className="text-neon-green">{card.traits.specialAbility}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Price (if available) */}
          {card.marketData && (
            <div className="text-xs text-neon-yellow font-pixel mt-1">
              {card.marketData.floorPrice}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;