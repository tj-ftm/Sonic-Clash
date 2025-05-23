import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { Wallet } from 'lucide-react';

interface ConnectWalletPromptProps {
  message?: string;
}

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({ 
  message = 'Connect your wallet to access this feature' 
}) => {
  const { connectWallet } = useWallet();

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-neon-blue bg-bg-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-full bg-bg-dark flex items-center justify-center mb-4 border-2 border-neon-blue">
        <Wallet className="w-8 h-8 text-neon-blue" />
      </div>
      
      <h3 className="text-lg font-pixel text-white mb-2">Wallet Required</h3>
      <p className="text-sm text-gray-300 text-center mb-6 max-w-md">{message}</p>
      
      <button 
        onClick={connectWallet}
        className="retro-button"
      >
        Connect Wallet
      </button>
    </motion.div>
  );
};

export default ConnectWalletPrompt;