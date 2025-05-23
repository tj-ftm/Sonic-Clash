import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useGameData } from '../context/GameDataContext';
import Card from '../components/Card';
import BattleScene3D from '../components/BattleScene3D';
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectWalletPrompt from '../components/ConnectWalletPrompt';
import { BattleResult, BattleLogEntry, NFTCard } from '../types/game';
import { MOCK_OPPONENT_CARDS } from '../data/mockData';
import { Gamepad2, Swords, Trophy, CircleDollarSign, Shield, ArrowLeft } from 'lucide-react';
import Confetti from 'react-confetti';

const BattleArena: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { selectedCards, hasMinimumCards, resetSelectedCards, addSonicPoints, isLoading } = useGameData();
  
  const [battleState, setBattleState] = useState<'ready' | 'battling' | 'results'>('ready');
  const [opponentCards, setOpponentCards] = useState<NFTCard[]>([]);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isConnected && hasMinimumCards) {
      setOpponentCards(MOCK_OPPONENT_CARDS);
    }
  }, [isConnected, hasMinimumCards]);
  
  const startBattle = () => {
    setBattleState('battling');
    setBattleLog([]);
    setCurrentTurn(0);
    simulateBattle();
  };
  
  const simulateBattle = () => {
    const playerCardsCopy = [...selectedCards];
    const opponentCardsCopy = [...opponentCards];
    
    const allCards = [
      ...playerCardsCopy.map(card => ({ card, owner: 'player' })),
      ...opponentCardsCopy.map(card => ({ card, owner: 'opponent' }))
    ].sort((a, b) => b.card.traits.speed - a.card.traits.speed);
    
    let playerHealth = 500;
    let opponentHealth = 500;
    
    const log: BattleLogEntry[] = [];
    
    for (let turn = 1; turn <= 5; turn++) {
      for (const { card, owner } of allCards) {
        if (playerHealth <= 0 || opponentHealth <= 0) continue;
        
        const targetDefense = owner === 'player' 
          ? opponentCardsCopy.reduce((sum, c) => sum + c.traits.defense, 0) / 5
          : playerCardsCopy.reduce((sum, c) => sum + c.traits.defense, 0) / 5;
        
        let damage = Math.max(5, Math.round(card.traits.attack * (1 - targetDefense / 200)));
        let specialEffect = '';
        
        switch (card.traits.specialAbility) {
          case 'Double Damage':
            if (Math.random() < 0.3) {
              damage *= 2;
              specialEffect = 'Double Damage activated!';
            }
            break;
          case 'Heal':
            if (owner === 'player') {
              playerHealth = Math.min(500, playerHealth + 20);
              specialEffect = 'Healed 20 HP!';
            } else {
              opponentHealth = Math.min(500, opponentHealth + 20);
              specialEffect = 'Healed 20 HP!';
            }
            break;
          case 'Stun':
            if (Math.random() < 0.25) {
              const nextCardIndex = allCards.findIndex(c => 
                c.owner !== owner && 
                !log.some(entry => entry.turn === turn && entry.attacker === c.card.name)
              );
              
              if (nextCardIndex !== -1) {
                log.push({
                  turn,
                  attacker: allCards[nextCardIndex].card.name,
                  defender: owner === 'player' ? 'Player' : 'Opponent',
                  damage: 0,
                  specialEffect: 'Stunned! Skipped turn.',
                  remainingHealth: owner === 'player' ? opponentHealth : playerHealth
                });
                
                specialEffect = 'Stunned opponent!';
              }
            }
            break;
        }
        
        if (owner === 'player') {
          opponentHealth -= damage;
        } else {
          playerHealth -= damage;
        }
        
        log.push({
          turn,
          attacker: card.name,
          defender: owner === 'player' ? 'Opponent' : 'Player',
          damage,
          specialEffect,
          remainingHealth: owner === 'player' ? opponentHealth : playerHealth
        });
      }
    }
    
    const winner = playerHealth > opponentHealth ? 'player' : 'opponent';
    const sonicPointsEarned = winner === 'player' ? 100 : 25;
    
    const result: BattleResult = {
      winner,
      playerDamage: 500 - playerHealth,
      opponentDamage: 500 - opponentHealth,
      rewards: {
        sonicPoints: sonicPointsEarned
      },
      battleLog: log
    };
    
    let currentLogIndex = 0;
    
    const updateLog = () => {
      if (currentLogIndex < log.length) {
        setBattleLog(prev => [...prev, log[currentLogIndex]]);
        setCurrentTurn(log[currentLogIndex].turn);
        setSelectedCardIndex(currentLogIndex % selectedCards.length);
        setIsAnimating(true);
        
        setTimeout(() => {
          setIsAnimating(false);
          currentLogIndex++;
          setTimeout(updateLog, 1000);
        }, 500);
      } else {
        setBattleState('results');
        setBattleResult(result);
        addSonicPoints(sonicPointsEarned);
        
        if (winner === 'player') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }
    };
    
    setTimeout(updateLog, 1000);
  };
  
  const backToDeckBuilder = () => {
    resetSelectedCards();
    navigate('/deck-builder');
  };
  
  const newBattle = () => {
    setBattleState('ready');
    setBattleLog([]);
    setBattleResult(null);
    setSelectedCardIndex(-1);
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <ConnectWalletPrompt message="Connect your wallet to access the Battle Arena." />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner message="Loading battle data..." />
      </div>
    );
  }
  
  if (!hasMinimumCards) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[70vh]">
        <motion.div
          className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-neon-blue bg-bg-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 rounded-full bg-bg-dark flex items-center justify-center mb-4 border-2 border-neon-blue">
            <Gamepad2 className="w-8 h-8 text-neon-blue" />
          </div>
          
          <h3 className="text-lg font-pixel text-white mb-2">Deck Required</h3>
          <p className="text-sm text-gray-300 text-center mb-6 max-w-md">
            You need to select 5 cards in the Deck Builder before entering the Battle Arena.
          </p>
          
          <button 
            onClick={() => navigate('/deck-builder')}
            className="retro-button"
          >
            Go to Deck Builder
          </button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-pixel text-white mb-2 retro-text">Battle Arena</h1>
        <p className="text-gray-300">Put your cards to the test in a 5v5 battle</p>
      </div>
      
      {battleState !== 'ready' && (
        <div className="mb-8">
          <BattleScene3D
            playerCards={selectedCards}
            opponentCards={opponentCards}
            selectedCardIndex={selectedCardIndex}
            currentTurn={currentTurn}
            isAnimating={isAnimating}
          />
        </div>
      )}
      
      <div className="mb-8 flex justify-center">
        {battleState === 'ready' && (
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={backToDeckBuilder}
              className="px-4 py-2 bg-bg-card text-white rounded-md border border-neon-blue hover:bg-bg-card-hover transition flex items-center text-sm font-pixel"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Deck
            </button>
            <button
              onClick={startBattle}
              className="retro-button flex items-center"
            >
              <Swords className="w-5 h-5 mr-2" />
              Start Battle
            </button>
          </motion.div>
        )}
        
        {battleState === 'battling' && (
          <div className="text-center">
            <LoadingSpinner size="sm" message={`Turn ${currentTurn}: Battle in progress...`} />
          </div>
        )}
        
        {battleState === 'results' && (
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={backToDeckBuilder}
              className="px-4 py-2 bg-bg-card text-white rounded-md border border-neon-blue hover:bg-bg-card-hover transition flex items-center text-sm font-pixel"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Change Deck
            </button>
            <button
              onClick={newBattle}
              className="retro-button flex items-center"
            >
              <Swords className="w-5 h-5 mr-2" />
              New Battle
            </button>
          </motion.div>
        )}
      </div>
      
      {battleState === 'results' && battleResult && (
        <motion.div
          className={`mb-8 p-6 rounded-lg border-2 ${
            battleResult.winner === 'player'
              ? 'border-neon-green bg-bg-card/70'
              : 'border-neon-pink bg-bg-card/70'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-4">
            <h2 className={`text-2xl font-pixel ${
              battleResult.winner === 'player' ? 'text-neon-green' : 'text-neon-pink'
            }`}>
              {battleResult.winner === 'player' ? 'Victory!' : 'Defeat!'}
            </h2>
            <div className="flex items-center justify-center mt-2">
              <Trophy className={`w-6 h-6 ${
                battleResult.winner === 'player' ? 'text-neon-yellow' : 'text-gray-400'
              } mr-2`} />
              <span className="text-white font-pixel">
                {battleResult.winner === 'player' 
                  ? 'You won the battle!' 
                  : 'Better luck next time!'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-dark p-4 rounded-lg">
              <h3 className="text-lg font-pixel text-white mb-2">Battle Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Your Damage</p>
                  <p className="text-xl font-pixel text-neon-blue">
                    {battleResult.opponentDamage}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Opponent Damage</p>
                  <p className="text-xl font-pixel text-neon-pink">
                    {battleResult.playerDamage}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Turns</p>
                  <p className="text-xl font-pixel text-white">
                    {currentTurn}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rewards</p>
                  <p className="text-xl font-pixel text-neon-yellow flex items-center">
                    <CircleDollarSign className="w-4 h-4 mr-1" />
                    {battleResult.rewards.sonicPoints}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-bg-dark p-4 rounded-lg">
              <h3 className="text-lg font-pixel text-white mb-2">Battle Highlights</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {battleLog
                  .filter(log => log.specialEffect || log.damage > 30)
                  .slice(-5)
                  .map((log, index) => (
                    <div key={index} className="text-sm border-l-2 border-neon-blue pl-2">
                      <p className="text-white">
                        <span className="text-neon-blue">{log.attacker}</span> dealt{' '}
                        <span className="text-neon-pink">{log.damage}</span> damage
                      </p>
                      {log.specialEffect && (
                        <p className="text-neon-yellow text-xs">{log.specialEffect}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-pixel text-neon-blue mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Your Cards
          </h2>
          
          <div className="bg-bg-card p-4 rounded-lg border border-neon-blue">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {selectedCards.map(card => (
                <Card 
                  key={card.tokenId} 
                  card={card}
                  size="sm"
                  showDetails={false}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-pixel text-neon-pink mb-4 flex items-center">
            <Swords className="w-5 h-5 mr-2" />
            Opponent Cards
          </h2>
          
          <div className="bg-bg-card p-4 rounded-lg border border-neon-pink">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {opponentCards.map(card => (
                <Card 
                  key={card.tokenId} 
                  card={card}
                  size="sm"
                  showDetails={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {battleLog.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-pixel text-white mb-4">Battle Log</h2>
          
          <div className="bg-bg-dark p-4 rounded-lg border border-neon-blue">
            <div className="max-h-64 overflow-y-auto">
              <AnimatePresence>
                {battleLog.map((log, index) => (
                  <motion.div 
                    key={index}
                    className={`p-2 mb-2 rounded ${
                      log.attacker.includes('Opponent') 
                        ? 'bg-bg-card border-l-4 border-neon-pink'
                        : 'bg-bg-card border-l-4 border-neon-blue'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Turn {log.turn}</span>
                      <span className="text-xs text-gray-400">
                        HP: {log.remainingHealth >= 0 ? log.remainingHealth : 0}/500
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className={`font-pixel ${
                        log.attacker.includes('Opponent')
                          ? 'text-neon-pink'
                          : 'text-neon-blue'
                      }`}>
                        {log.attacker}
                      </span>{' '}
                      attacks{' '}
                      <span className="text-white">
                        {log.defender}
                      </span>{' '}
                      for{' '}
                      <span className="text-neon-yellow">
                        {log.damage}
                      </span>{' '}
                      damage
                    </p>
                    {log.specialEffect && (
                      <p className="text-xs text-neon-green mt-1">
                        {log.specialEffect}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena;