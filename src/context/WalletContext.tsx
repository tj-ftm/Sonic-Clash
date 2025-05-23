import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Types
type WalletContextType = {
  isConnected: boolean;
  address: string | null;
  balance: string;
  nftBalance: NFTCard[];
  tokenBalances: { symbol: string; balance: string }[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: number | null;
  switchToSonicNetwork: () => Promise<void>;
};

// Default Context
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: '0',
  nftBalance: [],
  tokenBalances: [],
  connectWallet: async () => {},
  disconnectWallet: () => {},
  chainId: null,
  switchToSonicNetwork: async () => {},
});

// Sonic Network Configuration
const SONIC_CHAIN_ID = 146;
const SONIC_NETWORK_PARAMS = {
  chainId: `0x${SONIC_CHAIN_ID.toString(16)}`,
  chainName: 'Sonic Network',
  nativeCurrency: {
    name: 'Sonic',
    symbol: 'S',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.soniclabs.com'],
  blockExplorerUrls: ['https://sonicscan.org'],
};

// Provider Component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [nftBalance, setNftBalance] = useState<NFTCard[]>([]);
  const [tokenBalances, setTokenBalances] = useState<{ symbol: string; balance: string }[]>([]);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            setChainId(Number(network.chainId));
            setAddress(accounts[0]);
            setIsConnected(true);
            updateBalance(provider, accounts[0]);
            fetchNFTBalance(accounts[0]);
            fetchTokenBalances(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAddress(null);
          setBalance('0');
        } else {
          setAddress(accounts[0]);
          setIsConnected(true);
          const provider = new ethers.BrowserProvider(window.ethereum);
          updateBalance(provider, accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(Number(chainIdHex));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Update balance
  const updateBalance = async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
      setBalance('0');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet detected! Please install MetaMask or Rabby.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        updateBalance(provider, accounts[0]);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
    toast.info('Wallet disconnected');
  };

  // Switch to Sonic Network
  const switchToSonicNetwork = async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet detected!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SONIC_NETWORK_PARAMS.chainId }],
      });
      toast.success('Switched to Sonic Network');
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SONIC_NETWORK_PARAMS],
          });
          toast.success('Sonic Network added to wallet');
        } catch (addError) {
          console.error('Failed to add Sonic Network:', addError);
          toast.error('Failed to add Sonic Network to wallet');
        }
      } else {
        console.error('Failed to switch to Sonic Network:', switchError);
        toast.error('Failed to switch to Sonic Network');
      }
    }
  };

  const fetchNFTBalance = async (walletAddress: string) => {
    const retryFetch = async (url: string, retries = 3, delay = 1000): Promise<Response> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return retryFetch(url, retries - 1, delay * 2);
        }
        throw error;
      }
    };

    try {
      const response = await retryFetch(
        `https://paintswap.io/api/v2/nfts?owner=${walletAddress}&collection=retrocard-clash`
      );
      
      const data = await response.json();
      
      if (!Array.isArray(data.nfts)) {
        throw new Error('Invalid NFT data format received');
      }

      const processedNFTs = data.nfts.map((nft: any) => {
        try {
          const imageUrl = nft.image.startsWith('ipfs://')
            ? `https://ipfs.io/ipfs/${nft.image.split('ipfs://')[1]}`
            : nft.image;

          return {
            tokenId: nft.tokenId,
            contractAddress: nft.contractAddress,
            name: nft.name || 'Unnamed Card',
            image: imageUrl,
            traits: {
              attack: nft.attributes?.find((attr: any) => attr.trait_type === 'Attack')?.value || 50,
              defense: nft.attributes?.find((attr: any) => attr.trait_type === 'Defense')?.value || 50,
              speed: nft.attributes?.find((attr: any) => attr.trait_type === 'Speed')?.value || 25,
              specialAbility: nft.attributes?.find((attr: any) => attr.trait_type === 'Special Ability')?.value || 'None',
              rarity: nft.attributes?.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'Common',
            }
          };
        } catch (error) {
          console.error('Error processing individual NFT:', error);
          return null;
        }
      }).filter(Boolean);

      setNftBalance(processedNFTs);
    } catch (error) {
      console.error('Failed to fetch NFT balance:', error);
      toast.error('Failed to load NFTs. Please try again later.');
      setNftBalance([]);
    }
  };

  const fetchTokenBalances = async (walletAddress: string) => {
    try {
      const response = await fetch(`https://sonicscan.org/api/account/tokens/${walletAddress}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTokenBalances(data.tokens.map((token: any) => ({
        symbol: token.symbol,
        balance: ethers.formatUnits(token.balance, token.decimals)
      })));
    } catch (error) {
      console.error('Failed to fetch token balances:', error);
      setTokenBalances([]);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        nftBalance,
        tokenBalances,
        connectWallet,
        disconnectWallet,
        chainId,
        switchToSonicNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);