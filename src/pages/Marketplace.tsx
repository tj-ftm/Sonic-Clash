import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import Card from '../components/Card';
import ConnectWalletPrompt from '../components/ConnectWalletPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOCK_MARKETPLACE_LISTINGS } from '../data/mockData';
import { Rarity } from '../types/game';
import { Store, Filter, Search, CircleDollarSign, Tag } from 'lucide-react';

const Marketplace: React.FC = () => {
  const { isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [listings, setListings] = useState<any[]>([]);
  
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('https://paintswap.io/api/v2/listings?collection=retrocard-clash');
      const data = await response.json();
      
      const formattedListings = await Promise.all(data.listings.map(async (listing: any) => {
        // Fetch IPFS metadata
        const metadataResponse = await fetch(`https://ipfs.io/ipfs/${listing.tokenUri.split('ipfs://')[1]}`);
        const metadata = await metadataResponse.json();
        
        return {
          id: listing.listingId,
          card: {
            tokenId: listing.tokenId,
            contractAddress: listing.contractAddress,
            name: metadata.name,
            image: `https://ipfs.io/ipfs/${metadata.image.split('ipfs://')[1]}`,
            traits: {
              attack: metadata.attributes.find((attr: any) => attr.trait_type === 'Attack')?.value || 50,
              defense: metadata.attributes.find((attr: any) => attr.trait_type === 'Defense')?.value || 50,
              speed: metadata.attributes.find((attr: any) => attr.trait_type === 'Speed')?.value || 25,
              specialAbility: metadata.attributes.find((attr: any) => attr.trait_type === 'Special Ability')?.value || 'None',
              rarity: metadata.attributes.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'Common',
            }
          },
          price: `${ethers.formatEther(listing.price)} S`,
          seller: listing.seller,
          listedAt: new Date(listing.createdAt * 1000).toISOString()
        };
      }));
      
      setListings(formattedListings);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setIsLoading(false);
    }
  };
  
  // Apply filters
  const filteredListings = listings.filter(listing => {
    // Apply rarity filter
    if (filter !== 'all' && listing.card.traits.rarity.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    // Apply search term
    if (searchTerm && !listing.card.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    const priceA = parseFloat(a.price.split(' ')[0]);
    const priceB = parseFloat(b.price.split(' ')[0]);
    
    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'newest':
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
      case 'oldest':
        return new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime();
      default:
        return 0;
    }
  });
  
  // Handle buying a card
  const handleBuyCard = (id: string) => {
    if (!isConnected) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Card ${id} purchased successfully!`);
    }, 2000);
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <ConnectWalletPrompt message="Connect your wallet to browse and purchase cards in the marketplace." />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner message="Processing transaction..." />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-pixel text-white mb-2 retro-text">NFT Marketplace</h1>
        <p className="text-gray-300">Browse, buy, and sell RetroCard NFTs</p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 bg-bg-card p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-pixel text-gray-400 mb-2 flex items-center">
              <Search className="w-4 h-4 mr-1" /> Search Cards
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-bg-dark border border-neon-blue rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
              placeholder="Card name..."
            />
          </div>
          
          {/* Rarity Filter */}
          <div>
            <label htmlFor="filter" className="block text-sm font-pixel text-gray-400 mb-2 flex items-center">
              <Filter className="w-4 h-4 mr-1" /> Filter by Rarity
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 bg-bg-dark border border-neon-blue rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
          
          {/* Sort By */}
          <div>
            <label htmlFor="sort" className="block text-sm font-pixel text-gray-400 mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-1" /> Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-bg-dark border border-neon-blue rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Marketplace Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">Listed Cards</h3>
          <p className="text-2xl font-pixel text-white">{listings.length}</p>
        </div>
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">Avg. Price</h3>
          <p className="text-2xl font-pixel text-neon-yellow">
            {(listings.reduce((sum, item) => sum + parseFloat(item.price.split(' ')[0]), 0) / listings.length).toFixed(2)} S
          </p>
        </div>
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">Highest Card</h3>
          <p className="text-2xl font-pixel text-neon-green">
            {Math.max(...listings.map(item => parseFloat(item.price.split(' ')[0])))} S
          </p>
        </div>
        <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
          <h3 className="text-sm font-pixel text-gray-400">PaintSwap Floor</h3>
          <p className="text-2xl font-pixel text-neon-pink">4.5 S</p>
        </div>
      </div>
      
      {/* Listings */}
      <div className="mb-8">
        <h2 className="text-xl font-pixel text-neon-green mb-4 flex items-center">
          <Store className="w-5 h-5 mr-2" />
          Available Cards
        </h2>
        
        {sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedListings.map((listing) => (
              <motion.div
                key={listing.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  card={listing.card} 
                />
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm font-pixel text-neon-yellow flex items-center">
                    <CircleDollarSign className="w-4 h-4 mr-1" />
                    {listing.price}
                  </div>
                  <button
                    onClick={() => handleBuyCard(listing.id)}
                    className="px-3 py-1 bg-neon-blue text-white rounded-md text-xs font-pixel hover:bg-neon-purple transition"
                  >
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-bg-card rounded-lg">
            <Store className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 font-pixel">
              No cards found matching your filters.
            </p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 bg-bg-dark text-white rounded-md text-sm font-pixel"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Coming Soon: Sell Cards */}
      <div className="mt-12 bg-bg-card p-6 rounded-lg border-2 border-dashed border-neon-pink">
        <h2 className="text-xl font-pixel text-neon-pink mb-2">Sell Your Cards</h2>
        <p className="text-gray-300 mb-4">
          The ability to list your own cards for sale is coming soon! 
          You'll be able to set your own prices and earn $S tokens from sales.
        </p>
        <div className="flex items-center text-sm font-pixel text-neon-yellow">
          <span className="bg-neon-yellow text-bg-dark px-2 py-1 rounded mr-2">COMING SOON</span>
          Create listings directly from your collection
        </div>
      </div>
    </div>
  );
};

export default Marketplace;