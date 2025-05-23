import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Types
type WalletContextType = {
  isConnected: boolean;
  address: string | null;
  balance: string;
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

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
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