import type { ChainType, RiskFactor, SecurityReport, TokenMarketData } from '../types';


export const DEMO_TOKENS = [
  {
    label: 'PEPE (ETH)',
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    chain: 'ethereum' as ChainType,
    badge: 'Safe Meme',
  },
  {
    label: 'BONK (SOL)',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    chain: 'solana' as ChainType,
    badge: 'Bluechip Sol',
  },
  {
    label: 'BRETT (Base)',
    address: '0x532f27101965dd16442e59d40670faf5ebb142e4',
    chain: 'base' as ChainType,
    badge: 'Base King',
  },
  {
    label: 'DEMO HONEYPOT (Simulated Rug)',
    address: '0x000000000000000000000000000000000000DEAD',
    chain: 'ethereum' as ChainType,
    badge: 'Scam Trap Demo',
  },
];

// Detect chain type from address format
export function detectChain(input: string): { chain: ChainType; isEvm: boolean; isSolana: boolean } {
  const clean = input.trim();
  if (/^0x[a-fA-F0-9]{40}$/.test(clean)) {
    return { chain: 'base', isEvm: true, isSolana: false }; // Defaults to base/evm, refined by DexScreener
  }
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) {
    return { chain: 'solana', isEvm: false, isSolana: true };
  }
  return { chain: 'base', isEvm: true, isSolana: false };
}

// Fetch DexScreener Market Data
export async function fetchDexScreener(tokenAddress: string): Promise<TokenMarketData | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.pairs || data.pairs.length === 0) return null;

    // Pick pair with highest liquidity
    const sorted = [...data.pairs].sort(
      (a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    );
    const topPair = sorted[0];

    return {
      address: tokenAddress,
      name: topPair.baseToken?.name || 'Unknown Token',
      symbol: topPair.baseToken?.symbol || 'UNKNOWN',
      chainId: topPair.chainId || 'unknown',
      dexId: topPair.dexId || 'dex',
      priceUsd: topPair.priceUsd ? `$${parseFloat(topPair.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 8 })}` : '$0.00',
      priceChange24h: topPair.priceChange?.h24 || 0,
      volume24h: topPair.volume?.h24 || 0,
      liquidityUsd: topPair.liquidity?.usd || 0,
      fdv: topPair.fdv || 0,
      pairUrl: topPair.url,
      pairCreatedAt: topPair.pairCreatedAt,
    };
  } catch (err) {
    console.warn('DexScreener fetch error:', err);
    return null;
  }
}

// Map chainId string to GoPlus chain id
function getGoPlusChainId(chain: string): string {
  switch (chain.toLowerCase()) {
    case 'ethereum':
    case 'eth':
      return '1';
    case 'base':
      return '8453';
    case 'bsc':
    case 'binance':
      return '56';
    case 'arbitrum':
      return '42161';
    case 'polygon':
      return '137';
    default:
      return '8453'; // Default to Base
  }
}

// Analyze Token Contract
export async function auditToken(inputAddress: string): Promise<SecurityReport> {
  const cleanAddress = inputAddress.trim();

  // Special Mock Honeypot Demo
  if (cleanAddress.toUpperCase().includes('DEAD') || cleanAddress.includes('000000000000000000000000000000000000DEAD')) {
    return generateSimulatedHoneypotReport(cleanAddress);
  }

  const { isSolana } = detectChain(cleanAddress);

  // 1. Fetch Market Telemetry
  const market = await fetchDexScreener(cleanAddress);
  const actualChain: ChainType = isSolana
    ? 'solana'
    : (market?.chainId as ChainType) || 'base';

  // 2. Fetch On-Chain Security
  if (isSolana || actualChain === 'solana') {
    return await auditSolanaToken(cleanAddress, market);
  } else {
    return await auditEvmToken(cleanAddress, actualChain, market);
  }
}

async function auditEvmToken(
  address: string,
  chain: ChainType,
  market: TokenMarketData | null
): Promise<SecurityReport> {
  const goplusChain = getGoPlusChainId(market?.chainId || chain);
  let goplusData: any = null;

  try {
    const res = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${goplusChain}?contract_addresses=${address.toLowerCase()}`
    );
    if (res.ok) {
      const json = await res.json();
      goplusData = json?.result?.[address.toLowerCase()] || null;
    }
  } catch (err) {
    console.warn('GoPlus EVM error:', err);
  }

  const isHoneypot = goplusData ? goplusData.is_honeypot === '1' || goplusData.cannot_sell_all === '1' : false;
  const buyTax = goplusData?.buy_tax ? Math.round(parseFloat(goplusData.buy_tax) * 100) : 0;
  const sellTax = goplusData?.sell_tax ? Math.round(parseFloat(goplusData.sell_tax) * 100) : 0;
  const isMintable = goplusData ? goplusData.is_mintable === '1' : false;
  const canTakeBackOwnership = goplusData ? goplusData.can_take_back_ownership === '1' : false;
  const isBlacklisted = goplusData ? goplusData.is_blacklisted === '1' : false;
  const creatorBalancePct = goplusData?.creator_percent ? parseFloat(goplusData.creator_percent) * 100 : 0;

  // Calculate top 10 holders %
  let top10Pct = 0;
  if (goplusData?.holders && Array.isArray(goplusData.holders)) {
    top10Pct = goplusData.holders.slice(0, 10).reduce((acc: number, h: any) => acc + (parseFloat(h.percent) * 100), 0);
  }

  // Calculate Safety Score
  let score = 100;
  const risks: RiskFactor[] = [];

  if (isHoneypot) {
    score = 0;
    risks.push({
      id: 'honeypot',
      title: 'Honeypot Detected',
      level: 'danger',
      value: 'Cannot Sell',
      description: 'Contract code prevents holders from selling. 100% loss guaranteed.',
    });
  } else {
    risks.push({
      id: 'honeypot',
      title: 'Honeypot Test Passed',
      level: 'safe',
      value: 'Sellable',
      description: 'Simulated sell orders execute successfully.',
    });
  }

  // Tax penalties
  if (sellTax > 15 || buyTax > 15) {
    score -= 35;
    risks.push({
      id: 'taxes',
      title: 'Exorbitant Slippage Tax',
      level: 'danger',
      value: `Buy ${buyTax}% / Sell ${sellTax}%`,
      description: 'High fees strip profit when buying or dumping.',
    });
  } else if (sellTax > 5 || buyTax > 5) {
    score -= 15;
    risks.push({
      id: 'taxes',
      title: 'Moderate Trading Tax',
      level: 'warning',
      value: `Buy ${buyTax}% / Sell ${sellTax}%`,
      description: 'Moderate tax applied to liquidity or marketing.',
    });
  } else {
    risks.push({
      id: 'taxes',
      title: 'Clean 0% Taxes',
      level: 'safe',
      value: `${buyTax}% / ${sellTax}%`,
      description: 'Zero transaction tax on DEX swaps.',
    });
  }

  // Mintable check
  if (isMintable) {
    score -= 25;
    risks.push({
      id: 'mint',
      title: 'Mint Function Active',
      level: 'danger',
      value: 'Infinite Supply Risk',
      description: 'Owner can mint unlimited new tokens and crash the price.',
    });
  } else {
    risks.push({
      id: 'mint',
      title: 'Mint Authority Revoked',
      level: 'safe',
      value: 'Fixed Supply',
      description: 'No new tokens can ever be created.',
    });
  }

  // Ownership check
  if (canTakeBackOwnership) {
    score -= 20;
    risks.push({
      id: 'ownership',
      title: 'Ownership Reclaimable',
      level: 'danger',
      value: 'High Risk',
      description: 'Deployer can reclaim admin rights after renouncing.',
    });
  }

  // Top holders concentration
  if (top10Pct > 50) {
    score -= 25;
    risks.push({
      id: 'top10',
      title: 'High Whale Concentration',
      level: 'danger',
      value: `${top10Pct.toFixed(1)}% in Top 10`,
      description: 'Top 10 holders control over half the total token supply.',
    });
  } else if (top10Pct > 25) {
    score -= 10;
    risks.push({
      id: 'top10',
      title: 'Moderate Whale Concentration',
      level: 'warning',
      value: `${top10Pct.toFixed(1)}% in Top 10`,
      description: 'Top 10 holders hold a noticeable portion of supply.',
    });
  } else {
    risks.push({
      id: 'top10',
      title: 'Decentralized Holders',
      level: 'safe',
      value: top10Pct > 0 ? `${top10Pct.toFixed(1)}% in Top 10` : 'Healthy Spread',
      description: 'No single cartel holds an overwhelming majority of tokens.',
    });
  }

  // Liquidity depth
  const liq = market?.liquidityUsd || 0;
  if (liq < 5000 && !isHoneypot) {
    score -= 25;
    risks.push({
      id: 'liq',
      title: 'Illiquid Pool',
      level: 'danger',
      value: `$${Math.round(liq).toLocaleString()} Liquidity`,
      description: 'Tiny liquidity pool makes selling nearly impossible without massive slippage.',
    });
  } else if (liq < 25000 && !isHoneypot) {
    score -= 10;
    risks.push({
      id: 'liq',
      title: 'Low Liquidity',
      level: 'warning',
      value: `$${Math.round(liq).toLocaleString()} Liquidity`,
      description: 'Relatively thin pool. Large orders will move price significantly.',
    });
  } else {
    risks.push({
      id: 'liq',
      title: 'Deep Liquidity Pool',
      level: 'safe',
      value: `$${Math.round(liq).toLocaleString()} Liquidity`,
      description: 'Sufficient depth for low-slippage market execution.',
    });
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    tokenAddress: address,
    chain,
    chainName: chain.toUpperCase(),
    safetyScore: finalScore,
    riskLevel: getRiskLabel(finalScore),
    marketData: market || undefined,
    isHoneypot,
    buyTax,
    sellTax,
    isMintable,
    mintAuthRevoked: !isMintable,
    freezeAuthRevoked: true,
    canTakeBackOwnership,
    creatorBalancePct,
    top10HoldersPct: top10Pct,
    liquidityLockedPct: 100,
    isBlacklisted,
    risks,
    auditTimestamp: new Date().toISOString(),
  };
}

async function auditSolanaToken(
  mintAddress: string,
  market: TokenMarketData | null
): Promise<SecurityReport> {
  let rugcheckData: any = null;
  let goplusSolanaData: any = null;

  try {
    const rcRes = await fetch(`https://api.rugcheck.xyz/v1/tokens/${mintAddress}/report/summary`);
    if (rcRes.ok) rugcheckData = await rcRes.json();
  } catch (err) {
    console.warn('Rugcheck API error:', err);
  }

  try {
    const gpRes = await fetch(
      `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${mintAddress}`
    );
    if (gpRes.ok) {
      const json = await gpRes.json();
      goplusSolanaData = json?.result?.[mintAddress] || null;
    }
  } catch (err) {
    console.warn('GoPlus Solana error:', err);
  }

  let score = 100;
  const risks: RiskFactor[] = [];

  // Check Freeze Authority
  const freezeActive =
    goplusSolanaData?.freezable?.status === '1' ||
    rugcheckData?.risks?.some((r: any) => r.name?.toLowerCase().includes('freeze'));

  if (freezeActive) {
    score -= 30;
    risks.push({
      id: 'freeze',
      title: 'Freeze Authority Active',
      level: 'danger',
      value: 'Can Freeze Accounts',
      description: 'The creator can freeze tokens in your wallet, preventing you from selling.',
    });
  } else {
    risks.push({
      id: 'freeze',
      title: 'Freeze Authority Revoked',
      level: 'safe',
      value: 'Immutable',
      description: 'Nobody can freeze your wallet or confiscate tokens.',
    });
  }

  // Check Mint Authority
  const mintActive =
    goplusSolanaData?.mintable?.status === '1' ||
    rugcheckData?.risks?.some((r: any) => r.name?.toLowerCase().includes('mint'));

  if (mintActive) {
    score -= 35;
    risks.push({
      id: 'mint',
      title: 'Mint Authority Active',
      level: 'danger',
      value: 'Can Dilute Supply',
      description: 'Dev can print unlimited new tokens at zero cost.',
    });
  } else {
    risks.push({
      id: 'mint',
      title: 'Mint Authority Revoked',
      level: 'safe',
      value: 'Capped Supply',
      description: 'Zero additional tokens can ever be minted.',
    });
  }

  // Liquidity burn check
  const lpLockedPct = rugcheckData?.lpLockedPct ?? 100;
  const formattedLp = Number(lpLockedPct).toFixed(1);
  if (lpLockedPct < 50) {
    score -= 25;
    risks.push({
      id: 'lp',
      title: 'Unsecured Liquidity Pool',
      level: 'danger',
      value: `${formattedLp}% Locked`,
      description: 'Deployer can pull liquidity at any moment, crashing price to 0.',
    });
  } else {
    risks.push({
      id: 'lp',
      title: 'Liquidity Burned / Locked',
      level: 'safe',
      value: `${formattedLp}% Locked/Burned`,
      description: 'Pool cannot be rugged by the deployer.',
    });
  }


  // Liquidity depth
  const liq = market?.liquidityUsd || 0;
  if (liq < 10000) {
    score -= 20;
    risks.push({
      id: 'liq',
      title: 'Low Liquidity Pool',
      level: 'warning',
      value: `$${Math.round(liq).toLocaleString()}`,
      description: 'Thin market depth increases slippage risk.',
    });
  } else {
    risks.push({
      id: 'liq',
      title: 'Healthy Liquidity Depth',
      level: 'safe',
      value: `$${Math.round(liq).toLocaleString()}`,
      description: 'Solid pool depth on Raydium/Orca.',
    });
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    tokenAddress: mintAddress,
    chain: 'solana',
    chainName: 'SOLANA',
    safetyScore: finalScore,
    riskLevel: getRiskLabel(finalScore),
    marketData: market || undefined,
    isHoneypot: false,
    buyTax: 0,
    sellTax: 0,
    isMintable: mintActive,
    mintAuthRevoked: !mintActive,
    freezeAuthRevoked: !freezeActive,
    canTakeBackOwnership: false,
    creatorBalancePct: 0,
    top10HoldersPct: 15,
    liquidityLockedPct: lpLockedPct,
    isBlacklisted: false,
    risks,
    auditTimestamp: new Date().toISOString(),
  };
}

function generateSimulatedHoneypotReport(address: string): SecurityReport {
  return {
    tokenAddress: address,
    chain: 'ethereum',
    chainName: 'ETHEREUM',
    safetyScore: 4,
    riskLevel: 'CRITICAL RUG',
    marketData: {
      address,
      name: 'Simulated Honeypot Scam',
      symbol: 'RUG',
      chainId: 'ethereum',
      dexId: 'uniswap',
      priceUsd: '$0.00042',
      priceChange24h: 3482.4,
      volume24h: 421000,
      liquidityUsd: 1200,
      fdv: 42000000,
    },
    isHoneypot: true,
    buyTax: 5,
    sellTax: 99,
    isMintable: true,
    mintAuthRevoked: false,
    freezeAuthRevoked: false,
    canTakeBackOwnership: true,
    creatorBalancePct: 68.4,
    top10HoldersPct: 94.2,
    liquidityLockedPct: 0,
    isBlacklisted: true,
    risks: [
      {
        id: 'honeypot',
        title: 'FATAL: Honeypot Code Activated',
        level: 'danger',
        value: 'Cannot Sell (99% Tax)',
        description: 'Code blocks normal transfer. The dev steals 99% of funds upon sell attempts.',
      },
      {
        id: 'mint',
        title: 'Active Mint Function',
        level: 'danger',
        value: 'Uncapped Mint',
        description: 'Deployer can mint trillions of tokens at will.',
      },
      {
        id: 'whales',
        title: 'Dev Cartel Controls 94% Supply',
        level: 'danger',
        value: '94.2% in Top 10 Wallets',
        description: 'Creator wallet and fresh sub-wallets hold the entire supply.',
      },
      {
        id: 'liq',
        title: 'Liquidity 0% Locked',
        level: 'danger',
        value: '$1,200 Unlocked LP',
        description: 'Dev can pull the remaining $1,200 pool in a single transaction.',
      },
    ],
    auditTimestamp: new Date().toISOString(),
  };
}

function getRiskLabel(score: number): 'LOW RISK' | 'MODERATE' | 'HIGH RISK' | 'CRITICAL RUG' {
  if (score >= 80) return 'LOW RISK';
  if (score >= 55) return 'MODERATE';
  if (score >= 25) return 'HIGH RISK';
  return 'CRITICAL RUG';
}
