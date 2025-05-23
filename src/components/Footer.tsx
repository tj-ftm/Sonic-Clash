import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-dark border-t-2 border-neon-blue py-6 crt-flicker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-neon-pink" />
            <span className="ml-2 text-lg font-pixel text-white retro-text">
              RetroCard Clash
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a 
                href="https://soniclabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-neon-blue transition flex items-center"
              >
                <span className="text-xs font-pixel">Sonic Labs</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a 
                href="https://paintswap.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-neon-blue transition flex items-center"
              >
                <span className="text-xs font-pixel">PaintSwap</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a 
                href="https://airdrop.soniclabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-neon-blue transition flex items-center"
              >
                <span className="text-xs font-pixel">Airdrop</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
            
            <div className="flex space-x-4">
              <Link to="/" className="text-xs font-pixel text-white hover:text-neon-blue transition">
                Terms
              </Link>
              <Link to="/" className="text-xs font-pixel text-white hover:text-neon-blue transition">
                Privacy
              </Link>
              <Link to="/" className="text-xs font-pixel text-white hover:text-neon-blue transition">
                Help
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs font-pixel text-gray-400">
            Made with <Heart className="h-3 w-3 inline text-neon-pink" /> for the Sonic Network • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;