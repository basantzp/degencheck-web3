export type ChainType = 'solana' | 'ethereum' | 'base' | 'bsc' | 'arbitrum' | 'polygon';

export interface TokenMarketData {
  address: string;
  name: string;
  symbol: string;
  chainId: string;
  dexId: string;
  priceUsd: string;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  fdv: number;
  pairUrl?: string;
  pairCreatedAt?: number;
}

export interface RiskFactor {
  id: string;
  title: string;
  level: 'safe' | 'warning' | 'danger';
  value: string;
  description: string;
}

export interface SecurityReport {
  tokenAddress: string;
  chain: ChainType;
  chainName: string;
  safetyScore: number; // 0 to 100
  riskLevel: 'LOW RISK' | 'MODERATE' | 'HIGH RISK' | 'CRITICAL RUG';
  marketData?: TokenMarketData;
  isHoneypot: boolean;
  buyTax: number;
  sellTax: number;
  isMintable: boolean;
  mintAuthRevoked: boolean;
  freezeAuthRevoked: boolean;
  canTakeBackOwnership: boolean;
  creatorBalancePct: number;
  top10HoldersPct: number;
  liquidityLockedPct: number;
  isBlacklisted: boolean;
  risks: RiskFactor[];
  auditTimestamp: string;
}

export interface ReferralSettings {
  trojanRef: string;
  maestroRef: string;
  photonRef: string;
  bananaGunRef: string;
  bullXRef: string;
  ledgerRef: string;
}
