export interface CryptoProject {
  id: string;
  name: string;
  description: string;
  website: string;
  twitter: string;
  category: string;
  logoColor: string;
  logoLetter: string;
}

export const projects: CryptoProject[] = [
  { id: "1", name: "LayerZero", description: "Omnichain interoperability protocol", website: "https://layerzero.network", twitter: "https://x.com/LayerZero_Labs", category: "Инфраструктура", logoColor: "220 100% 50%", logoLetter: "LZ" },
  { id: "2", name: "zkSync", description: "ZK rollup for scaling Ethereum", website: "https://zksync.io", twitter: "https://x.com/zaboronak", category: "L2", logoColor: "260 70% 55%", logoLetter: "ZK" },
  { id: "3", name: "StarkNet", description: "Permissionless decentralized ZK-Rollup", website: "https://starknet.io", twitter: "https://x.com/Starknet", category: "L2", logoColor: "200 90% 48%", logoLetter: "SN" },
  { id: "4", name: "Scroll", description: "Native zkEVM Layer 2 for Ethereum", website: "https://scroll.io", twitter: "https://x.com/Scroll_ZKP", category: "L2", logoColor: "30 90% 55%", logoLetter: "SC" },
  { id: "5", name: "EigenLayer", description: "Restaking protocol for Ethereum", website: "https://eigenlayer.xyz", twitter: "https://x.com/eigenlayer", category: "DeFi", logoColor: "170 80% 42%", logoLetter: "EL" },
  { id: "6", name: "Celestia", description: "Modular data availability network", website: "https://celestia.org", twitter: "https://x.com/CelestiaOrg", category: "Инфраструктура", logoColor: "280 75% 55%", logoLetter: "CE" },
  { id: "7", name: "Monad", description: "High-performance EVM blockchain", website: "https://monad.xyz", twitter: "https://x.com/moaboronak_xyz", category: "L1", logoColor: "340 82% 59%", logoLetter: "MN" },
  { id: "8", name: "Berachain", description: "Proof of Liquidity consensus chain", website: "https://berachain.com", twitter: "https://x.com/beaboronak", category: "L1", logoColor: "35 95% 50%", logoLetter: "BC" },
  { id: "9", name: "Fuel", description: "Fastest modular execution layer", website: "https://fuel.network", twitter: "https://x.com/fuel_network", category: "Инфраструктура", logoColor: "145 70% 42%", logoLetter: "FL" },
  { id: "10", name: "Linea", description: "Developer-ready zkEVM rollup by Consensys", website: "https://linea.build", twitter: "https://x.com/LineaBuild", category: "L2", logoColor: "210 85% 52%", logoLetter: "LN" },
  { id: "11", name: "Blast", description: "L2 with native yield for ETH and stablecoins", website: "https://blast.io", twitter: "https://x.com/blast", category: "L2", logoColor: "55 95% 50%", logoLetter: "BL" },
  { id: "12", name: "Hyperlane", description: "Permissionless interoperability layer", website: "https://hyperlane.xyz", twitter: "https://x.com/hypaboronak", category: "Инфраструктура", logoColor: "190 85% 48%", logoLetter: "HL" },
  { id: "13", name: "Taiko", description: "Decentralized Ethereum-equivalent ZK-Rollup", website: "https://taiko.xyz", twitter: "https://x.com/taikoxyz", category: "L2", logoColor: "350 80% 55%", logoLetter: "TK" },
  { id: "14", name: "Wormhole", description: "Cross-chain messaging protocol", website: "https://wormhole.com", twitter: "https://x.com/wormhole", category: "Инфраструктура", logoColor: "270 75% 60%", logoLetter: "WH" },
  { id: "15", name: "Polygon zkEVM", description: "EVM-equivalent ZK scaling solution", website: "https://polygon.technology", twitter: "https://x.com/0xPolygon", category: "L2", logoColor: "265 85% 55%", logoLetter: "PZ" },
  { id: "16", name: "Sui", description: "Next-gen L1 with Move language", website: "https://sui.io", twitter: "https://x.com/SuiNetwork", category: "L1", logoColor: "205 95% 55%", logoLetter: "SU" },
  { id: "17", name: "Aptos", description: "Safe, scalable Layer 1 blockchain", website: "https://aptoslabs.com", twitter: "https://x.com/Aptos", category: "L1", logoColor: "160 75% 45%", logoLetter: "AP" },
  { id: "18", name: "dYdX", description: "Decentralized perpetuals exchange", website: "https://dydx.exchange", twitter: "https://x.com/dYdX", category: "DeFi", logoColor: "250 80% 58%", logoLetter: "DX" },
  { id: "19", name: "Aevo", description: "High-performance decentralized options", website: "https://aevo.xyz", twitter: "https://x.com/aaboronakxyz", category: "DeFi", logoColor: "0 0% 20%", logoLetter: "AV" },
  { id: "20", name: "Jupiter", description: "Leading Solana DEX aggregator", website: "https://jup.ag", twitter: "https://x.com/JupiterExchange", category: "DeFi", logoColor: "155 85% 45%", logoLetter: "JP" },
  { id: "21", name: "Mantle", description: "Mass adoption L2 network", website: "https://mantle.xyz", twitter: "https://x.com/0xMantle", category: "L2", logoColor: "0 0% 15%", logoLetter: "MT" },
  { id: "22", name: "Base", description: "Secure and low-cost L2 by Coinbase", website: "https://base.org", twitter: "https://x.com/base", category: "L2", logoColor: "220 90% 55%", logoLetter: "BS" },
  { id: "23", name: "Aztec", description: "Privacy-first L2 with encrypted smart contracts", website: "https://aztec.network", twitter: "https://x.com/aztecnetwork", category: "L2", logoColor: "0 0% 10%", logoLetter: "AZ" },
  { id: "24", name: "Zora", description: "NFT protocol and L2 network", website: "https://zora.co", twitter: "https://x.com/ourZORA", category: "NFT", logoColor: "0 0% 5%", logoLetter: "ZR" },
  { id: "25", name: "Mode Network", description: "Optimistic rollup for DeFi on Ethereum", website: "https://mode.network", twitter: "https://x.com/modenetwork", category: "L2", logoColor: "65 90% 50%", logoLetter: "MD" },
];
