import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';
import { NFTCard } from '../types/game';
import { ethers } from 'ethers';
import axios from 'axios';
import { toast } from 'react-toastify';

const PAINTSWAP_API_URL = 'https://paintswap.io/api/v2';
const RETROCARD_COLLECTION_ADDRESS = '0x2dc1886d67001d5d6a80feaa51513f7bb5a591fd';

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
    
    setIsLoading(true);
    try {
      // Fetch NFTs owned by the user from PaintSwap API
      const response = await axios.get(`${PAINTSWAP_API_URL}/nfts`, {
        params: {
          collection: 'retrocard-clash',
          owner: address,
          includeMetadata: true,
          includeSales: true
        }
      });

      if (!response.data || !Array.isArray(response.data.nfts)) {
        throw new Error('Invalid response format from PaintSwap API');
      }

      const cards = response.data.nfts.map((nft: any) => ({
        tokenId: nft.tokenId,
        contractAddress: RETROCARD_COLLECTION_ADDRESS,
        name: nft.name || `Card #${nft.tokenId}`,
        image: nft.image.startsWith('ipfs://')
          ? `https://ipfs.io/ipfs/${nft.image.split('ipfs://')[1]}`
          : nft.image,
        traits: {
          attack: nft.attributes?.find((attr: any) => attr.trait_type === 'Attack')?.value ?? 50,
          defense: nft.attributes?.find((attr: any) => attr.trait_type === 'Defense')?.value ?? 50,
          speed: nft.attributes?.find((attr: any) => attr.trait_type === 'Speed')?.value ?? 25,
          specialAbility: nft.attributes?.find((attr: any) => attr.trait_type === 'Special Ability')?.value ?? 'None',
          rarity: nft.attributes?.find((attr: any) => attr.trait_type === 'Rarity')?.value ?? 'Common',
        },
        marketData: nft.activeListing ? {
          floorPrice: `${ethers.formatEther(nft.activeListing.price)} S`,
          lastSale: nft.lastSale ? `${ethers.formatEther(nft.lastSale.price)} S` : '0 S',
          source: 'PaintSwap.io'
        } : undefined
      }));

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