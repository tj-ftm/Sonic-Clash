import { NFTCard, Rarity, SpecialAbility } from '../types/game';

// Mock NFT card data
export const MOCK_CARDS: NFTCard[] = [
  {
    tokenId: '1',
    contractAddress: '0xabc123def456',
    name: 'Neon Blaster',
    image: 'https://images.pexels.com/photos/2694037/pexels-photo-2694037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 85,
      defense: 60,
      speed: 45,
      specialAbility: SpecialAbility.DOUBLE_DAMAGE,
      rarity: Rarity.EPIC
    },
    marketData: {
      floorPrice: '10.5 S',
      lastSale: '12.0 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '2',
    contractAddress: '0xabc123def456',
    name: 'Pixel Ninja',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 70,
      defense: 50,
      speed: 90,
      specialAbility: SpecialAbility.STUN,
      rarity: Rarity.RARE
    },
    marketData: {
      floorPrice: '5.2 S',
      lastSale: '6.0 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '3',
    contractAddress: '0xabc123def456',
    name: 'Cyber Shaman',
    image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 60,
      defense: 80,
      speed: 30,
      specialAbility: SpecialAbility.HEAL,
      rarity: Rarity.RARE
    },
    marketData: {
      floorPrice: '4.8 S',
      lastSale: '5.5 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '4',
    contractAddress: '0xabc123def456',
    name: 'Glitch Dragon',
    image: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 95,
      defense: 75,
      speed: 50,
      specialAbility: SpecialAbility.POISON,
      rarity: Rarity.LEGENDARY
    },
    marketData: {
      floorPrice: '25.0 S',
      lastSale: '27.5 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '5',
    contractAddress: '0xabc123def456',
    name: 'Synthwave Knight',
    image: 'https://images.pexels.com/photos/1353938/pexels-photo-1353938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 75,
      defense: 90,
      speed: 40,
      specialAbility: SpecialAbility.SHIELD,
      rarity: Rarity.EPIC
    },
    marketData: {
      floorPrice: '12.3 S',
      lastSale: '15.0 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '6',
    contractAddress: '0xabc123def456',
    name: 'Vaporwave Sorcerer',
    image: 'https://images.pexels.com/photos/6615036/pexels-photo-6615036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 85,
      defense: 65,
      speed: 55,
      specialAbility: SpecialAbility.STEAL,
      rarity: Rarity.EPIC
    },
    marketData: {
      floorPrice: '11.5 S',
      lastSale: '13.0 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '7',
    contractAddress: '0xabc123def456',
    name: 'Digital Brawler',
    image: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 90,
      defense: 40,
      speed: 75,
      specialAbility: SpecialAbility.DOUBLE_DAMAGE,
      rarity: Rarity.RARE
    },
    marketData: {
      floorPrice: '6.2 S',
      lastSale: '7.0 S',
      source: 'PaintSwap.io'
    }
  },
  {
    tokenId: '8',
    contractAddress: '0xabc123def456',
    name: 'Retro Golem',
    image: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 65,
      defense: 95,
      speed: 20,
      specialAbility: SpecialAbility.SHIELD,
      rarity: Rarity.RARE
    },
    marketData: {
      floorPrice: '5.9 S',
      lastSale: '6.5 S',
      source: 'PaintSwap.io'
    }
  }
];

// Mock opponent cards for battle
export const MOCK_OPPONENT_CARDS: NFTCard[] = [
  {
    tokenId: '101',
    contractAddress: '0xdef789abc123',
    name: 'Shadow Assassin',
    image: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 80,
      defense: 55,
      speed: 85,
      specialAbility: SpecialAbility.STUN,
      rarity: Rarity.EPIC
    }
  },
  {
    tokenId: '102',
    contractAddress: '0xdef789abc123',
    name: 'Laser Mech',
    image: 'https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 90,
      defense: 70,
      speed: 40,
      specialAbility: SpecialAbility.DOUBLE_DAMAGE,
      rarity: Rarity.RARE
    }
  },
  {
    tokenId: '103',
    contractAddress: '0xdef789abc123',
    name: 'Bit Crusher',
    image: 'https://images.pexels.com/photos/6498970/pexels-photo-6498970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 75,
      defense: 60,
      speed: 70,
      specialAbility: SpecialAbility.POISON,
      rarity: Rarity.RARE
    }
  },
  {
    tokenId: '104',
    contractAddress: '0xdef789abc123',
    name: 'Electro Shaman',
    image: 'https://images.pexels.com/photos/7034109/pexels-photo-7034109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 65,
      defense: 85,
      speed: 45,
      specialAbility: SpecialAbility.HEAL,
      rarity: Rarity.EPIC
    }
  },
  {
    tokenId: '105',
    contractAddress: '0xdef789abc123',
    name: 'Quantum Knight',
    image: 'https://images.pexels.com/photos/2468056/pexels-photo-2468056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    traits: {
      attack: 85,
      defense: 90,
      speed: 35,
      specialAbility: SpecialAbility.SHIELD,
      rarity: Rarity.LEGENDARY
    }
  }
];

// Mock shill history
export const MOCK_SHILL_HISTORY = [
  {
    tweetId: '123456789',
    timestamp: '2025-05-23T18:00:00Z',
    sonicPoints: 100,
    status: 'Verified',
    engagementScore: 78
  },
  {
    tweetId: '987654321',
    timestamp: '2025-05-22T15:30:00Z',
    sonicPoints: 75,
    status: 'Verified',
    engagementScore: 42
  },
  {
    tweetId: '456789123',
    timestamp: '2025-05-21T12:45:00Z',
    sonicPoints: 50,
    status: 'Verified',
    engagementScore: 31
  }
];

// Mock marketplace listings
export const MOCK_MARKETPLACE_LISTINGS = [
  {
    id: '1001',
    card: MOCK_CARDS[0],
    price: '15.5 S',
    seller: '0x123...456',
    listedAt: '2025-05-22T10:30:00Z'
  },
  {
    id: '1002',
    card: MOCK_CARDS[1],
    price: '8.2 S',
    seller: '0x789...012',
    listedAt: '2025-05-23T09:15:00Z'
  },
  {
    id: '1003',
    card: MOCK_CARDS[2],
    price: '7.5 S',
    seller: '0x345...678',
    listedAt: '2025-05-23T11:45:00Z'
  },
  {
    id: '1004',
    card: MOCK_CARDS[3],
    price: '30.0 S',
    seller: '0x901...234',
    listedAt: '2025-05-22T14:20:00Z'
  },
  {
    id: '1005',
    card: MOCK_CARDS[4],
    price: '18.5 S',
    seller: '0x567...890',
    listedAt: '2025-05-23T16:10:00Z'
  }
];