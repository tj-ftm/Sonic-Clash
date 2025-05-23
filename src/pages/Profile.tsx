import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGameData } from '../context/GameDataContext';
import ConnectWalletPrompt from '../components/ConnectWalletPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import { User, Shield, CircleDollarSign, Trophy, Clock, Twitter, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { isConnected, address, balance } = useWallet();
  const { userCards, sonicPoints, isLoading } = useGameData();
  const [activeTab, setActiveTab] = useState('overview');
  
  const totalNFTs = userCards.length;
  const rarityBreakdown = userCards.reduce((acc, card) => {
    acc[card.traits.rarity] = (acc[card.traits.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Stats for the profile
  const stats = [
    {
      name: 'NFT Cards',
      value: totalNFTs,
      icon: <Shield className="w-5 h-5 text-neon-blue" />
    },
    {
      name: 'Sonic Points',
      value: sonicPoints,
      icon: <CircleDollarSign className="w-5 h-5 text-neon-yellow" />
    },
    {
      name: 'S Balance',
      value: parseFloat(balance).toFixed(2),
      icon: <CircleDollarSign className="w-5 h-5 text-neon-green" />
    },
    {
      name: 'Battles Won',
      value: 12,
      icon: <Trophy className="w-5 h-5 text-neon-pink" />
    }
  ];
  
  // Mock achievement data
  const achievements = [
    {
      name: 'First Victory',
      description: 'Win your first battle',
      progress: 100,
      completed: true
    },
    {
      name: 'Collector',
      description: 'Own 10 different NFT cards',
      progress: Math.min(100, (totalNFTs / 10) * 100),
      completed: totalNFTs >= 10
    },
    {
      name: 'Social Butterfly',
      description: 'Share 5 tweets about RetroCard Clash',
      progress: 60,
      completed: false
    },
    {
      name: 'High Roller',
      description: 'Own a Legendary card',
      progress: rarityBreakdown['Legendary'] ? 100 : 0,
      completed: !!rarityBreakdown['Legendary']
    }
  ];
  
  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <ConnectWalletPrompt message="Connect your wallet to view your profile and statistics." />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner message="Loading profile data..." />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-pixel text-white mb-2 retro-text">Your Profile</h1>
        <p className="text-gray-300">View your stats, achievements, and NFT collection</p>
      </div>
      
      {/* Profile Header */}
      <div className="bg-bg-card p-6 rounded-lg border-2 border-neon-blue mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-bg-dark border-4 border-neon-blue flex items-center justify-center">
              <User className="w-12 h-12 text-neon-blue" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-neon-green text-black text-xs font-pixel py-1 px-2 rounded-full">
              Level 5
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-xl font-pixel text-white mb-1">Pixel Warrior</h2>
            <p className="text-sm text-neon-blue mb-4">{formatAddress(address)}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-bg-dark p-3 rounded">
                  <div className="flex items-center justify-center md:justify-start mb-1">
                    {stat.icon}
                    <span className="text-xs font-pixel text-gray-400 ml-1">{stat.name}</span>
                  </div>
                  <p className="text-lg font-pixel text-white text-center md:text-left">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Joined Date */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end text-xs text-gray-400 mb-2">
              <Clock className="w-3 h-3 mr-1" />
              Joined May 2025
            </div>
            
            <a 
              href="https://sonicscan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-neon-blue hover:text-neon-pink transition"
            >
              <span>View on SonicScan</span>
              <ChevronRight className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-neon-blue">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-pixel ${
              activeTab === 'overview'
                ? 'text-neon-blue border-b-2 border-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 text-sm font-pixel ${
              activeTab === 'cards'
                ? 'text-neon-blue border-b-2 border-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            NFT Cards
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 text-sm font-pixel ${
              activeTab === 'achievements'
                ? 'text-neon-blue border-b-2 border-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="mb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Rarity Breakdown */}
            <div className="bg-bg-card p-4 rounded-lg mb-6">
              <h3 className="text-lg font-pixel text-white mb-4">Card Rarity Breakdown</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map((rarity) => (
                  <div key={rarity} className="bg-bg-dark p-3 rounded text-center">
                    <p className={`text-sm font-pixel ${
                      rarity === 'Legendary' 
                        ? 'text-neon-yellow'
                        : rarity === 'Epic'
                          ? 'text-neon-purple'
                          : rarity === 'Rare'
                            ? 'text-neon-blue'
                            : rarity === 'Uncommon'
                              ? 'text-neon-green'
                              : 'text-gray-300'
                    }`}>
                      {rarity}
                    </p>
                    <p className="text-2xl font-pixel text-white mt-1">
                      {rarityBreakdown[rarity] || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-bg-card p-4 rounded-lg">
              <h3 className="text-lg font-pixel text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="bg-bg-dark p-3 rounded flex items-start">
                  <Trophy className="w-5 h-5 text-neon-green mr-3 mt-1" />
                  <div>
                    <p className="text-white font-pixel">Won a 5v5 Battle</p>
                    <p className="text-xs text-gray-400 mt-1">23 May 2025 • Earned 100 Sonic Points</p>
                  </div>
                </div>
                
                <div className="bg-bg-dark p-3 rounded flex items-start">
                  <Shield className="w-5 h-5 text-neon-blue mr-3 mt-1" />
                  <div>
                    <p className="text-white font-pixel">Acquired Neon Blaster Card</p>
                    <p className="text-xs text-gray-400 mt-1">22 May 2025 • Paid 10.5 S</p>
                  </div>
                </div>
                
                <div className="bg-bg-dark p-3 rounded flex items-start">
                  <Twitter className="w-5 h-5 text-neon-pink mr-3 mt-1" />
                  <div>
                    <p className="text-white font-pixel">Shared on Twitter</p>
                    <p className="text-xs text-gray-400 mt-1">21 May 2025 • Earned 75 Sonic Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div>
            <h3 className="text-lg font-pixel text-white mb-4">Your NFT Collection</h3>
            
            {userCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {userCards.map((card) => (
                  <Card 
                    key={card.tokenId} 
                    card={card} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-bg-dark rounded-lg">
                <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-pixel">
                  You don't have any NFT cards yet.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Visit the marketplace to get started!
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="text-lg font-pixel text-white mb-4">Your Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    achievement.completed ? 'bg-bg-card' : 'bg-bg-dark'
                  } border ${
                    achievement.completed ? 'border-neon-green' : 'border-gray-700'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-md font-pixel text-white">{achievement.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                    </div>
                    {achievement.completed && (
                      <div className="bg-neon-green text-black text-xs font-pixel py-1 px-2 rounded">
                        Completed
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-pixel text-gray-400">
                            Progress: {achievement.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-bg-dark">
                        <div 
                          style={{ width: `${achievement.progress}%` }} 
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            achievement.completed ? 'bg-neon-green' : 'bg-neon-blue'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Airdrop Eligibility */}
      <div className="mt-12 bg-bg-card p-6 rounded-lg border-2 border-neon-yellow">
        <h2 className="text-xl font-pixel text-neon-yellow mb-2">$S Airdrop Eligibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 mb-4">
              Based on your current Sonic Points, you're eligible for an estimated airdrop amount.
              Keep playing and shilling to increase your allocation!
            </p>
            <div className="bg-bg-dark p-3 rounded">
              <p className="text-sm text-gray-400">Estimated Airdrop:</p>
              <p className="text-2xl font-pixel text-neon-yellow">
                {(sonicPoints / 100).toFixed(2)} $S
              </p>
              <p className="text-xs text-gray-500 mt-1">
                25% liquid, 75% vested over 270 days
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-md font-pixel text-white mb-2">Improve Your Allocation</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Trophy className="w-4 h-4 text-neon-green mr-2 mt-1" />
                <span className="text-sm text-gray-300">Win more battles (+100 points per win)</span>
              </li>
              <li className="flex items-start">
                <Twitter className="w-4 h-4 text-neon-pink mr-2 mt-1" />
                <span className="text-sm text-gray-300">Share daily on Twitter (+50-200 points per day)</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 text-neon-blue mr-2 mt-1" />
                <span className="text-sm text-gray-300">Collect more NFT cards (+20 points per card)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;