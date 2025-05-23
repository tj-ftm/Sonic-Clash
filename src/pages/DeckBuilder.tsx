import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useGameData } from '../context/GameDataContext';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectWalletPrompt from '../components/ConnectWalletPrompt';
import { Award, Filter, Check, X, ChevronRight } from 'lucide-react';

const DeckBuilder: React.FC = () => {
  const { isConnected } = useWallet();
  const { 
    userCards, 
    selectedCards, 
    toggleCardSelection, 
    isCardSelected,
    hasMinimumCards,
    isLoading 
  } = useGameData();
  const [filter, setFilter] = useState('all');

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <ConnectWalletPrompt message="Connect your wallet to build your deck and select cards for battle." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner message="Loading your cards..." />
      </div>
    );
  }

  const filteredCards = userCards.filter(card => {
    if (filter === 'all') return true;
    return card.traits.rarity.toLowerCase() === filter.toLowerCase();
  });

  const handleFilter = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-pixel text-white mb-2 retro-text">Deck Builder</h1>
        <p className="text-gray-300">Select 5 cards to form your battle deck</p>
      </div>
      
      {/* Selected Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-pixel text-neon-blue">
            <Award className="inline-block mr-2" />
            Your Battle Deck
          </h2>
          <span className="text-sm font-pixel text-white">
            {selectedCards.length}/5 Cards Selected
          </span>
        </div>
        
        <div className="bg-bg-card p-4 rounded-lg border-2 border-neon-blue">
          {selectedCards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {selectedCards.map(card => (
                <motion.div 
                  key={card.tokenId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    card={card} 
                    isSelected={true} 
                    onClick={() => toggleCardSelection(card)}
                    size="sm"
                  />
                </motion.div>
              ))}
              
              {/* Placeholder cards */}
              {Array.from({ length: 5 - selectedCards.length }).map((_, i) => (
                <div 
                  key={`placeholder-${i}`} 
                  className="w-32 h-44 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center"
                >
                  <span className="text-gray-500 text-xs font-pixel">Empty Slot</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-400 font-pixel">
                No cards selected yet. Choose from your collection below.
              </p>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-4 flex justify-end">
          {hasMinimumCards ? (
            <Link 
              to="/battle-arena" 
              className="retro-button flex items-center"
            >
              <span>Battle Arena</span>
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          ) : (
            <button 
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md cursor-not-allowed flex items-center text-xs font-pixel"
              disabled
            >
              <span>Select 5 Cards</span>
              <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-pixel text-white flex items-center">
          <Filter className="w-4 h-4 mr-1" /> Filter:
        </span>
        {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map(option => (
          <button
            key={option}
            onClick={() => handleFilter(option)}
            className={`px-3 py-1 rounded-md text-xs font-pixel ${
              filter === option
                ? 'bg-neon-blue text-white'
                : 'bg-bg-card text-gray-300 hover:bg-bg-card-hover'
            }`}
          >
            {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Card Collection */}
      <div className="mb-8">
        <h2 className="text-xl font-pixel text-neon-green mb-4">Your Collection</h2>
        
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCards.map(card => (
              <Card 
                key={card.tokenId} 
                card={card} 
                onClick={() => toggleCardSelection(card)}
                isSelected={isCardSelected(card.tokenId)}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-bg-card rounded-lg">
            <p className="text-gray-400 font-pixel">
              No cards found with the selected filter.
            </p>
          </div>
        )}
      </div>
      
      {/* Stats */}
      <div className="mt-8 bg-bg-card p-4 rounded-lg border border-neon-blue">
        <h3 className="text-lg font-pixel text-white mb-2">Deck Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-bg-dark p-3 rounded">
            <span className="text-xs font-pixel text-gray-400">Avg. Attack</span>
            <p className="text-lg font-pixel text-neon-pink">
              {selectedCards.length > 0
                ? Math.round(
                    selectedCards.reduce((sum, card) => sum + card.traits.attack, 0) /
                      selectedCards.length
                  )
                : '0'}
            </p>
          </div>
          <div className="bg-bg-dark p-3 rounded">
            <span className="text-xs font-pixel text-gray-400">Avg. Defense</span>
            <p className="text-lg font-pixel text-neon-blue">
              {selectedCards.length > 0
                ? Math.round(
                    selectedCards.reduce((sum, card) => sum + card.traits.defense, 0) /
                      selectedCards.length
                  )
                : '0'}
            </p>
          </div>
          <div className="bg-bg-dark p-3 rounded">
            <span className="text-xs font-pixel text-gray-400">Avg. Speed</span>
            <p className="text-lg font-pixel text-neon-green">
              {selectedCards.length > 0
                ? Math.round(
                    selectedCards.reduce((sum, card) => sum + card.traits.speed, 0) /
                      selectedCards.length
                  )
                : '0'}
            </p>
          </div>
          <div className="bg-bg-dark p-3 rounded">
            <span className="text-xs font-pixel text-gray-400">Legendary Cards</span>
            <p className="text-lg font-pixel text-neon-yellow">
              {selectedCards.filter(card => card.traits.rarity === 'Legendary').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckBuilder;