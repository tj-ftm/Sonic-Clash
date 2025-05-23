import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Shield, Gamepad2, Store, Twitter, CircleDollarSign } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isConnected, connectWallet, chainId, switchToSonicNetwork } = useWallet();
  
  // Check if on Sonic Network
  useEffect(() => {
    if (isConnected && chainId !== 146) {
      switchToSonicNetwork();
    }
  }, [isConnected, chainId, switchToSonicNetwork]);

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      {/* Hero Section */}
      <div className="relative bg-bg-dark overflow-hidden scanlines">
        <div className="bg-grid-pattern bg-grid h-full absolute inset-0 opacity-20 crt-flicker"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-pixel mb-4 retro-text">
              RetroCard Clash
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neon-blue font-pixel">
              A 5v5 NFT Card Battle Game on Sonic Network
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {isConnected ? (
                <Link 
                  to="/deck-builder" 
                  className="retro-button animate-pulse-neon"
                >
                  <Gamepad2 className="w-5 h-5 inline mr-2" />
                  Start Playing
                </Link>
              ) : (
                <button
                  onClick={connectWallet}
                  className="retro-button animate-pulse-neon"
                >
                  <Shield className="w-5 h-5 inline mr-2" />
                  Connect Wallet
                </button>
              )}
              
              <Link 
                to="/marketplace" 
                className="retro-button bg-bg-card border-neon-purple hover:bg-bg-card-hover"
              >
                <Store className="w-5 h-5 inline mr-2" />
                Browse Cards
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-pixel mb-4 text-neon-pink">Game Features</h2>
            <p className="text-gray-300">Experience the ultimate retro NFT card battle game</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <motion.div 
              className="neon-card p-6"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Gamepad2 className="w-10 h-10 text-neon-blue mb-4" />
              <h3 className="text-lg font-pixel mb-2">5v5 Battles</h3>
              <p className="text-sm text-gray-300">
                Strategic turn-based battles with unique card abilities. Use your NFT cards to defeat opponents.
              </p>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div 
              className="neon-card p-6"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Store className="w-10 h-10 text-neon-green mb-4" />
              <h3 className="text-lg font-pixel mb-2">NFT Marketplace</h3>
              <p className="text-sm text-gray-300">
                Buy, sell, and trade your cards with other players. Each card has unique traits and abilities.
              </p>
            </motion.div>
            
            {/* Card 3 */}
            <motion.div 
              className="neon-card p-6"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Twitter className="w-10 h-10 text-neon-pink mb-4" />
              <h3 className="text-lg font-pixel mb-2">Shill to Earn</h3>
              <p className="text-sm text-gray-300">
                Share on Twitter to earn Sonic Points for the $S airdrop. Engage with the community to maximize rewards.
              </p>
            </motion.div>
            
            {/* Card 4 */}
            <motion.div 
              className="neon-card p-6"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <CircleDollarSign className="w-10 h-10 text-neon-yellow mb-4" />
              <h3 className="text-lg font-pixel mb-2">$S Airdrop</h3>
              <p className="text-sm text-gray-300">
                Earn Sonic Points for the 190.5M $S airdrop coming in June 2025. Play more to earn more!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Sonic Network Section */}
      <div className="py-16 bg-bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-pixel mb-4 text-neon-blue">Powered by Sonic Network</h2>
            <p className="text-gray-300">Fast, secure, and built for gaming</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center">
              <div className="bg-bg-dark rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 border border-neon-blue">
                <span className="text-2xl font-pixel text-neon-blue">146</span>
              </div>
              <h3 className="text-lg font-pixel mb-2">Chain ID</h3>
              <p className="text-sm text-gray-300">
                Sonic Network's unique identifier in the blockchain ecosystem
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="bg-bg-dark rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 border border-neon-pink">
                <span className="text-2xl font-pixel text-neon-pink">$S</span>
              </div>
              <h3 className="text-lg font-pixel mb-2">Native Token</h3>
              <p className="text-sm text-gray-300">
                $S is used for transactions, fees, and rewards within the ecosystem
              </p>
            </div>
            
            <div className="p-6 text-center">
              <div className="bg-bg-dark rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 border border-neon-green">
                <span className="text-2xl font-pixel text-neon-green">2025</span>
              </div>
              <h3 className="text-lg font-pixel mb-2">Airdrop Year</h3>
              <p className="text-sm text-gray-300">
                June 2025 - Mark your calendar for the 190.5M $S token airdrop
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-bg-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center p-8 rounded-lg border-2 border-neon-blue bg-bg-card neon-card"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-pixel mb-4 text-white">Ready to Begin Your Journey?</h2>
            <p className="text-lg mb-6 text-gray-300">
              Connect your wallet and start collecting retro NFT cards today!
            </p>
            
            {isConnected ? (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link 
                  to="/deck-builder" 
                  className="retro-button"
                >
                  Build Your Deck
                </Link>
                <Link 
                  to="/marketplace" 
                  className="retro-button bg-bg-card border-neon-purple"
                >
                  Get Cards
                </Link>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="retro-button animate-pulse-neon"
              >
                <Shield className="w-5 h-5 inline mr-2" />
                Connect Wallet
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;