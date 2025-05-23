import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';
import { NFTCard } from '../types/game';
import { ethers } from 'ethers';

// Contract ABI (simplified for NFT data fetching)
const NFT_ABI = [
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
];

const NFT_CONTRACT_ADDRESS = '0x2dc1886d67001d5d6a80feaa51513f7bb5a591fd';

type GameDataContextType = {
  userCards: NFTCard[];
  selectedCards: NFTCard[];
  sonicPoints: number;
  toggleCardSelection: (card: NFTCard) => void;
  isCardSelected: (tokenId: string) => boolean;
  hasMinimumCards: boolean;
  resetSelectedCards: () => void;
  addSonicPoints: (points: number) => void;
  fetchUserData: () => Promise<void>;
  isLoading: boolean;
};

const GameDataContext = createContext<GameDataContextType>({
  userCards: [],
  selectedCards: [],
  sonicPoints: 0,
  toggleCardSelection: () => {},
  isCardSelected: () => false,
  hasMinimumCards: false,
  resetSelectedCards: () => {},
  addSonicPoints: () => {},
  fetchUserData: async () => {},
  isLoading: false,
});

export const GameDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnected, address } = useWallet();
  const [userCards, setUserCards] = useState<NFTCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<NFTCard[]>([]);
  const [sonicPoints, setSonicPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    if (!isConnected || !address) return;
    
    setIsLoading(false); // Don't show loading state for NFTs
    try {
      const provider = new ethers.JsonRpcProvider('https://rpc.soniclabs.com');
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
      
      // Get user's NFT balance
      const balance = await contract.balanceOf(address);
      const tokenPromises = [];
      
      // Fetch all tokens owned by the user
      for (let i = 0; i < balance; i++) {
        const tokenIdPromise = contract.tokenOfOwnerByIndex(address, i)
          .then(async (tokenId: bigint) => {
            try {
              const uri = await contract.tokenURI(tokenId);
              if (!uri) {
                console.warn(`No URI found for token ${tokenId}`);
                return null;
              }

              // Handle both IPFS and HTTP URIs
              const formattedUri = uri.startsWith('ipfs://')
                ? `https://ipfs.io/ipfs/${uri.split('ipfs://')[1]}`
                : uri;

              const response = await fetch(formattedUri);
              if (!response.ok) {
                throw new Error(`Failed to fetch metadata: ${response.status}`);
              }

              const metadata = await response.json();
              
              if (!metadata) {
                throw new Error('Invalid metadata format');
              }

              return {
                tokenId: tokenId.toString(),
                contractAddress: NFT_CONTRACT_ADDRESS,
                name: metadata.name || `Card #${tokenId}`,
                image: metadata.image || '',
                traits: {
                  attack: metadata.attributes?.find((attr: any) => attr.trait_type === 'Attack')?.value ?? 50,
                  defense: metadata.attributes?.find((attr: any) => attr.trait_type === 'Defense')?.value ?? 50,
                  speed: metadata.attributes?.find((attr: any) => attr.trait_type === 'Speed')?.value ?? 25,
                  specialAbility: metadata.attributes?.find((attr: any) => attr.trait_type === 'Special Ability')?.value ?? 'None',
                  rarity: metadata.attributes?.find((attr: any) => attr.trait_type === 'Rarity')?.value ?? 'Common',
                },
                marketData: {
                  floorPrice: '0 S',
                  lastSale: '0 S',
                  source: 'PaintSwap.io'
                }
              };
            } catch (error) {
              console.error(`Error fetching metadata for token ${tokenId}:`, error);
              return null;
            }
          })
          .catch(error => {
            console.error('Error in token promise:', error);
            return null;
          });
        
        tokenPromises.push(tokenIdPromise);
      }
      
      const cards = (await Promise.all(tokenPromises)).filter(Boolean);
      setUserCards(cards);
      setSonicPoints(1250); // Default starting points
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load your cards. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchUserData();
    } else {
      setUserCards([]);
      setSelectedCards([]);
      setSonicPoints(0);
    }
  }, [isConnected, address]);

  const toggleCardSelection = (card: NFTCard) => {
    const isSelected = selectedCards.some(c => c.tokenId === card.tokenId);
    
    if (isSelected) {
      setSelectedCards(selectedCards.filter(c => c.tokenId !== card.tokenId));
    } else {
      if (selectedCards.length < 5) {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  const isCardSelected = (tokenId: string) => {
    return selectedCards.some(card => card.tokenId === tokenId);
  };

  const hasMinimumCards = selectedCards.length === 5;

  const resetSelectedCards = () => {
    setSelectedCards([]);
  };

  const addSonicPoints = (points: number) => {
    setSonicPoints(prev => prev + points);
  };

  return (
    <GameDataContext.Provider
      value={{
        userCards,
        selectedCards,
        sonicPoints,
        toggleCardSelection,
        isCardSelected,
        hasMinimumCards,
        resetSelectedCards,
        addSonicPoints,
        fetchUserData,
        isLoading,
      }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => useContext(GameDataContext);