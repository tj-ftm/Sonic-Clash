// Card trait types
export interface CardTraits {
  attack: number;
  defense: number;
  speed: number;
  specialAbility: SpecialAbility;
  rarity: Rarity;
}

// Special ability enum
export enum SpecialAbility {
  DOUBLE_DAMAGE = 'Double Damage',
  HEAL = 'Heal',
  STUN = 'Stun',
  SHIELD = 'Shield',
  STEAL = 'Steal Energy',
  POISON = 'Poison'
}

// Rarity enum
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

// NFT card type
export interface NFTCard {
  tokenId: string;
  contractAddress: string;
  name: string;
  image: string;
  traits: CardTraits;
  marketData?: {
    floorPrice: string;
    lastSale: string;
    source: string;
  };
}

// Battle result type
export interface BattleResult {
  winner: 'player' | 'opponent';
  playerDamage: number;
  opponentDamage: number;
  rewards: {
    sonicPoints: number;
    tokens?: string;
  };
  battleLog: BattleLogEntry[];
}

// Battle log entry
export interface BattleLogEntry {
  turn: number;
  attacker: string;
  defender: string;
  damage: number;
  specialEffect?: string;
  remainingHealth?: number;
}

// Twitter shill record
export interface ShillRecord {
  tweetId: string;
  timestamp: string;
  sonicPoints: number;
  status: 'Pending' | 'Verified' | 'Failed';
  engagementScore?: number;
}

// Player data from aggregated sources
export interface PlayerData {
  walletAddress: string;
  sBalance: string;
  nftCards: NFTCard[];
  sonicPoints: number;
  airdropEligibility?: {
    estimatedSTokens: string;
    vestingStatus: string;
    source: string;
  };
  shillHistory: ShillRecord[];
  dataSources: {
    source: string;
    status: string;
    data: string;
  }[];
  discrepancies: string[];
  timestamp: string;
}