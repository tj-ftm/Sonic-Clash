import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletContext';
import { NFTCard } from '../types/game';
import { ethers } from 'ethers';
import axios from 'axios';

const PAINTSWAP_API_URL = 'https://api.paintswap.finance/v2';
const COLLECTION_ADDRESS = '0x2dc1886d67001d5d6a80feaa51513f7bb5a591fd'.toLowerCase();

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
      // Get all NFTs owned by the user
      const response = await axios.get(`${PAINTSWAP_API_URL}/nfts`, {
        params: {
          owner: address.toLowerCase(),
          collection: COLLECTION_ADDRESS,
          includeMetadata: true,
          includeSales: true,
          includeOrders: true,
          orderBy: 'tokenId',
          orderDirection: 'asc'
        }
      });

      if (!response.data || !response.data.nfts || !Array.isArray(response.data.nfts)) {
        throw new Error('Invalid response format from PaintSwap API');
      }

      const cards = await Promise.all(
        response.data.nfts.map(async (nft: any) => {
          // Get metadata from tokenUri if available
          let metadata = nft.metadata;
          if (!metadata && nft.tokenUri) {
            try {
              const metadataUrl = nft.tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
              const metadataResponse = await axios.get(metadataUrl);
              metadata = metadataResponse.data;
            } catch (error) {
              console.error(`Failed to fetch metadata for token ${nft.tokenId}:`, error);
            }
          }

          // Process image URL
          let imageUrl = metadata?.image || nft.image;
          if (imageUrl?.startsWith('ipfs://')) {
            imageUrl = `https://ipfs.io/ipfs/${imageUrl.split('ipfs://')[1]}`;
          }

          // Extract attributes
          const attributes = metadata?.attributes || nft.attributes || [];
          const getAttribute = (traitType: string, defaultValue: any) => {
            const attr = attributes.find((a: any) => a.trait_type === traitType);
            return attr ? attr.value : defaultValue;
          };

          return {
            tokenId: nft.tokenId.toString(),
            contractAddress: COLLECTION_ADDRESS,
            name: metadata?.name || nft.name || `Card #${nft.tokenId}`,
            image: imageUrl,
            traits: {
              attack: getAttribute('Attack', 50),
              defense: getAttribute('Defense', 50),
              speed: getAttribute('Speed', 25),
              specialAbility: getAttribute('Special Ability', 'None'),
              rarity: getAttribute('Rarity', 'Common'),
            },
            marketData: nft.activeListing ? {
              floorPrice: ethers.formatEther(nft.activeListing.price) + ' S',
              lastSale: nft.lastSale ? ethers.formatEther(nft.lastSale.price) + ' S' : '0 S',
              source: 'PaintSwap'
            } : undefined
          };
        })
      );

      setUserCards(cards);
      setSonicPoints(prev => prev || 1250); // Only set default if not already set
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Handle error without toast since it's imported in App.tsx
      setUserCards([]);
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