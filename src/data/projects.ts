export interface CryptoProject {
  id: string;
  name: string;
  description: string;
  website: string;
  twitter: string;
  category: string;
  logoColor: string;
  logoLetter: string;
  logo?: string;
  ecosystem?: any[];
  ecosystemLink?: string;
}

export const projects: CryptoProject[] = [
  { id: "1", name: "Base", description: "Secure and low-cost L2 by Coinbase", website: "https://www.base.org/", twitter: "https://x.com/base", category: "L2", logoColor: "220 90% 55%", logoLetter: "BS", logo: "https://pbs.twimg.com/profile_images/1945608199500910592/rnk6ixxH_400x400.jpg", ecosystemLink: "https://www.base.org/ecosystem" },
  { id: "2", name: "Polymarket", description: "Decentralized prediction market", website: "https://polymarket.com/", twitter: "https://x.com/Polymarket", category: "Pred", logoColor: "200 80% 50%", logoLetter: "PM", logo: "https://pbs.twimg.com/profile_images/2005664281002491904/bz2ZO_nU_400x400.jpg" },
  { id: "3", name: "Kalshi", description: "Regulated prediction market platform", website: "https://kalshi.com/", twitter: "https://x.com/Kalshi", category: "Pred", logoColor: "0 0% 15%", logoLetter: "KL", logo: "https://pbs.twimg.com/profile_images/2026716397598867456/cTZJLMxV_400x400.jpg" },
  { id: "4", name: "Abstract", description: "Consumer-focused Layer 2", website: "https://abs.xyz/", twitter: "https://x.com/AbstractChain", category: "L2", logoColor: "140 80% 45%", logoLetter: "AB", logo: "https://pbs.twimg.com/profile_images/1947751080705630208/0OQFUJxI_400x400.jpg" },
  { id: "5", name: "OpenSea", description: "The largest NFT marketplace", website: "https://opensea.io/", twitter: "https://x.com/opensea", category: "NFT", logoColor: "210 90% 55%", logoLetter: "OS", logo: "https://pbs.twimg.com/profile_images/2014958165050507264/dvbOLNLL_400x400.jpg" },
  { id: "6", name: "Tempo", description: "Layer 1 (L1)", website: "https://tempo.xyz/", twitter: "https://x.com/tempo", category: "L1", logoColor: "210 90% 55%", logoLetter: "TP", logo: "https://pbs.twimg.com/profile_images/2016273751566905344/0yTjFNa8_400x400.jpg", ecosystemLink: "https://tempo.xyz/ecosystem" },
  { id: "7", name: "Farcaster", description: "SocialFi", website: "https://farcaster.xyz/~/code/ERD5CB", twitter: "https://x.com/farcaster_xyz", category: "SocialFi", logoColor: "210 90% 55%", logoLetter: "FR", logo: "https://pbs.twimg.com/profile_images/1980310281558409216/DWoYcKR7_400x400.jpg" },
  { id: "8", name: "ARC", description: "ARC is an EVM-compatible Layer-1 blockchain by Circle for stablecoin", website: "https://www.arc.network/", twitter: "https://x.com/arc", category: "L1", logoColor: "210 90% 55%", logoLetter: "AR", logo: "https://pbs.twimg.com/profile_images/1955238194443849732/sHyVRItm_400x400.jpg", ecosystemLink: "https://www.arc.network/ecosystem" },
  { id: "9", name: "predict.fun", description: "Predict.fun is a decentralized prediction market platform", website: "https://predict.fun?ref=7AA7A", twitter: "https://x.com/predictdotfun", category: "Pred", logoColor: "210 90% 55%", logoLetter: "PF", logo: "https://pbs.twimg.com/profile_images/1829543621059862530/1b8ti3xF_400x400.jpg" },
  { id: "10", name: "LitVM", description: "LitVM is a trustless zkRollup serving as Litecoin's", website: "https://www.litvm.com/", twitter: "https://x.com/LitecoinVM", category: "DeFi", logoColor: "210 90% 55%", logoLetter: "LT", logo: "https://pbs.twimg.com/profile_images/1950556133376040961/HCccENRu_400x400.png", ecosystemLink: "https://testnet.litvm.com/" },
  { id: "11", name: "Pudgy Penguins", description: "Pudgy Penguins is a community token", website: "https://pengu.pudgypenguins.com/", twitter: "https://x.com/pudgypenguins", category: "GameFi", logoColor: "210 90% 55%", logoLetter: "PP", logo: "https://pbs.twimg.com/profile_images/1848765927451492364/VysuN6mu_400x400.jpg", ecosystemLink: "#" },
  { id: "12", name: "Ritual", description: "Ai", website: "https://ritual.net/", twitter: "https://x.com/ritualnet", category: "AI", logoColor: "210 90% 55%", logoLetter: "RT", logo: "https://pbs.twimg.com/profile_images/2047761933764268032/ltdZOulq_400x400.jpg", ecosystemLink: "#" },
  { id: "13", name: "DAC | Quantum Chain", description: "DAC is a Layer 1 blockchain", website: "https://www.dachain.tech/", twitter: "https://x.com/dac_chain", category: "L1", logoColor: "210 90% 55%", logoLetter: "DC", logo: "https://pbs.twimg.com/profile_images/2037482325747879936/N3hMCsla_400x400.jpg", ecosystemLink: "#" },
];