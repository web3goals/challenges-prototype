import { Chain, fantomTestnet } from "wagmi/chains";
import { stringToAddress } from "./converters";

/**
 * Help variables
 */
const fantomTestnetProfileContractAddress =
  process.env.NEXT_PUBLIC_FANTOM_TESTNET_PROFILE_CONTRACT_ADDRESS;
const fantomTestnetChallengeContractAddress =
  process.env.NEXT_PUBLIC_FANTOM_TESTNET_CHALLENGE_CONTRACT_ADDRESS;
const fantomTestnetSubgraphApiUrl =
  process.env.NEXT_PUBLIC_FANTOM_TESTNET_SUBGRAPH_API_URL;

/**
 * Get the first chain from supported chains.
 */
export function getDefaultChain(): Chain | undefined {
  const chains = getSupportedChains();
  if (chains.length !== 0) {
    return chains[0];
  } else {
    return undefined;
  }
}

/**
 * Get chains that defined in environment variables.
 */
export function getSupportedChains(): Array<Chain> {
  const chains: Array<Chain> = [];
  if (
    fantomTestnetChallengeContractAddress &&
    fantomTestnetProfileContractAddress
  ) {
    chains.push(fantomTestnet);
  }
  if (chains.length === 0) {
    console.error("Not found supported chains");
  }
  return chains;
}

/**
 * Get id of specified or default chain.
 */
export function getChainId(chain: Chain | undefined): number | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  return chain?.id;
}

/**
 * Get native currency symbol of specified or default chain.
 */
export function getChainNativeCurrencySymbol(
  chain: Chain | undefined
): string | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  return chain?.nativeCurrency?.symbol;
}

/**
 * Get address that defined in environment variables.
 */
export function getProfileContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  if (chain?.id === fantomTestnet.id && fantomTestnetProfileContractAddress) {
    return stringToAddress(fantomTestnetProfileContractAddress);
  }
  console.error(`Not found profile contract address for chain: ${chain?.name}`);
  return undefined;
}

/**
 * Get address that defined in environment variables.
 */
export function getChallengeContractAddress(
  chain: Chain | undefined
): `0x${string}` | undefined {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  if (chain?.id === fantomTestnet.id && fantomTestnetChallengeContractAddress) {
    return stringToAddress(fantomTestnetChallengeContractAddress);
  }
  console.error(
    `Not found challenge contract address for chain: ${chain?.name}`
  );
  return undefined;
}

/**
 * Get subgraph api url defined in environment variables.
 */
export function getSubgraphApiUrl(chain: Chain | undefined) {
  if (chain === undefined) {
    chain = getDefaultChain();
  }
  if (chain?.id === fantomTestnet.id && fantomTestnetSubgraphApiUrl) {
    return fantomTestnetSubgraphApiUrl;
  }
  console.error(`Not found subgraph api url for chain: ${chain?.name}`);
  return undefined;
}
