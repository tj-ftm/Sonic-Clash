import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGameData } from '../context/GameDataContext';
import ConnectWalletPrompt from '../components/ConnectWalletPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOCK_SHILL_HISTORY } from '../data/mockData';
import { ShillRecord } from '../types/game';
import { Twitter, ArrowUpRight, Copy, CheckCircle, Clock, CircleDollarSign, BarChart3 } from 'lucide-react';

const ShillDashboard: React.FC = () => {
  const { isConnected, address } = useWallet();
  const { sonicPoints, addSonicPoints } = useGameData();
  const [shillHistory, setShillHistory] = useState<ShillRecord[]>(MOCK_SHILL_HISTORY);
  const [isLoading, setIsLoading] = useState(false);
  const [tweetText, setTweetText] = useState(`Building my deck in RetroCard Clash on #SonicLabs! Check out this awesome NFT card game and earn $S tokens. #SonicNetwork #Blockchain #NFTGaming #S`);
  const [tweetUrl, setTweetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Calculate if user can submit a shill today
  const canShillToday = () => {
    if (shillHistory.length === 0) return true;
    
    const lastShillDate = new Date(shillHistory[0].timestamp);
    const today = new Date();
    
    // Check if the last shill was from a different day
    return lastShillDate.getDate() !== today.getDate() || 
           lastShillDate.getMonth() !== today.getMonth() || 
           lastShillDate.getFullYear() !== today.getFullYear();
  };
  
  // Handle tweet creation
  const handleTweetClick = () => {
    const encodedText = encodeURIComponent(tweetText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, '_blank');
  };
  
  // Copy tweet text to clipboard
  const copyTweetText = () => {
    navigator.clipboard.writeText(tweetText);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  // Submit shill for verification
  const submitShill = async () => {
    if (!tweetUrl) {
      alert('Please enter your tweet URL');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to verify tweet
    setTimeout(() => {
      const points = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
      const newShillRecord: ShillRecord = {
        tweetId: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
        sonicPoints: points,
        status: 'Verified',
        engagementScore: Math.floor(Math.random() * 100)
      };
      
      setShillHistory([newShillRecord, ...shillHistory]);
      addSonicPoints(points);
      setTweetUrl('');
      setIsSubmitting(false);
    }, 2000);
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <ConnectWalletPrompt message="Connect your wallet to participate in Shill to Earn and get Sonic Points." />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner message="Loading shill data..." />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-pixel text-white mb-2 retro-text">Shill to Earn</h1>
        <p className="text-gray-300">Share posts about RetroCard Clash to earn Sonic Points</p>
      </div>
      
      {/* Sonic Points Status */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">Total Sonic Points</h3>
          <p className="text-2xl font-pixel text-neon-yellow flex items-center">
            <CircleDollarSign className="w-5 h-5 mr-1" />
            {sonicPoints}
          </p>
        </div>
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">Estimated $S Airdrop</h3>
          <p className="text-2xl font-pixel text-neon-green">
            {(sonicPoints / 100).toFixed(2)} $S
          </p>
        </div>
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">Total Shills</h3>
          <p className="text-2xl font-pixel text-neon-pink">
            {shillHistory.length}
          </p>
        </div>
      </div>
      
      {/* Shill Creation */}
      <div className="mb-8">
        <div className="bg-bg-card p-6 rounded-lg border-2 border-neon-blue">
          <h2 className="text-xl font-pixel text-neon-blue mb-4 flex items-center">
            <Twitter className="w-5 h-5 mr-2" />
            Create Shill Post
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-pixel text-gray-400 mb-2">
              Tweet Text (Feel free to customize)
            </label>
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="w-full h-24 px-3 py-2 bg-bg-dark border border-neon-blue rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-pink resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={copyTweetText}
                className="mt-2 flex items-center text-xs font-pixel text-neon-blue hover:text-neon-pink transition"
              >
                {linkCopied ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Text
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={handleTweetClick}
              className="w-full sm:w-auto retro-button flex items-center justify-center"
              disabled={!canShillToday()}
            >
              <Twitter className="w-4 h-4 mr-2" />
              Tweet Now
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
            
            <div className="text-center text-xs font-pixel text-gray-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {canShillToday() 
                ? 'You can submit 1 shill today' 
                : 'You\'ve already submitted a shill today'}
            </div>
          </div>
          
          {/* Tweet URL Submission */}
          <div className="mt-6 pt-6 border-t border-neon-blue">
            <h3 className="text-md font-pixel text-white mb-2">Submit Your Tweet for Verification</h3>
            <p className="text-xs text-gray-400 mb-4">
              After tweeting, paste the URL of your tweet here to verify and earn Sonic Points.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                placeholder="https://twitter.com/yourusername/status/123456789"
                className="flex-grow px-3 py-2 bg-bg-dark border border-neon-blue rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
              />
              
              <button
                onClick={submitShill}
                className="px-4 py-2 bg-neon-blue text-white rounded-md text-sm font-pixel hover:bg-neon-purple transition flex items-center justify-center"
                disabled={isSubmitting || !tweetUrl || !canShillToday()}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shill History */}
      <div className="mb-8">
        <h2 className="text-xl font-pixel text-neon-pink mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Your Shill History
        </h2>
        
        {shillHistory.length > 0 ? (
          <div className="bg-bg-card p-4 rounded-lg border border-neon-pink overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neon-blue">
                  <th className="py-2 px-4 text-left text-xs font-pixel text-gray-400">Date</th>
                  <th className="py-2 px-4 text-left text-xs font-pixel text-gray-400">Tweet ID</th>
                  <th className="py-2 px-4 text-left text-xs font-pixel text-gray-400">Status</th>
                  <th className="py-2 px-4 text-left text-xs font-pixel text-gray-400">Engagement</th>
                  <th className="py-2 px-4 text-left text-xs font-pixel text-gray-400">Points</th>
                </tr>
              </thead>
              <tbody>
                {shillHistory.map((record, index) => (
                  <motion.tr 
                    key={record.tweetId}
                    className={index % 2 === 0 ? 'bg-bg-dark' : ''}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="py-2 px-4 text-white">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-neon-blue">
                      {record.tweetId}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        record.status === 'Verified' 
                          ? 'bg-green-900 text-green-300' 
                          : record.status === 'Pending'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-red-900 text-red-300'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-white">
                      {record.engagementScore ? `${record.engagementScore}/100` : 'N/A'}
                    </td>
                    <td className="py-2 px-4 text-neon-yellow font-pixel">
                      {record.sonicPoints}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center bg-bg-card rounded-lg">
            <Twitter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 font-pixel">
              You haven't created any shill posts yet.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Start sharing to earn Sonic Points!
            </p>
          </div>
        )}
      </div>
      
      {/* Airdrop Info */}
      <div className="mt-12 bg-bg-card p-6 rounded-lg border-2 border-dashed border-neon-green">
        <h2 className="text-xl font-pixel text-neon-green mb-4">$S Airdrop Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-300 mb-4">
              Earn Sonic Points for the upcoming 190.5M $S token airdrop scheduled for June 2025.
              Points earned through playing the game and shilling will determine your allocation.
            </p>
            <p className="text-gray-300">
              <span className="text-neon-yellow">Vesting Schedule:</span> 25% liquid at launch, 75% vested over 270 days
            </p>
          </div>
          <div className="bg-bg-dark p-4 rounded-lg">
            <h3 className="text-md font-pixel text-white mb-2">Sonic Points Conversion</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-400">100 Points</span>
                <span className="text-neon-yellow">≈ 1 $S Token</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">1,000 Points</span>
                <span className="text-neon-yellow">≈ 10 $S Tokens</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">10,000 Points</span>
                <span className="text-neon-yellow">≈ 100 $S Tokens</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">100,000 Points</span>
                <span className="text-neon-yellow">≈ 1,000 $S Tokens</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              * Final conversion rates may vary based on total participants
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a 
            href="https://airdrop.soniclabs.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="retro-button inline-flex items-center"
          >
            <span>Check Airdrop Status</span>
            <ArrowUpRight className="ml-1 w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShillDashboard;