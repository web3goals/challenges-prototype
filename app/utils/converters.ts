import { BigNumber, ethers } from "ethers";

/**
 * Convert "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1" to "0x430...c4b1".
 */
export function addressToShortAddress(address: string): string {
  let shortAddress = address;
  if (address?.length > 10) {
    shortAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }
  return shortAddress?.toLowerCase();
}

/**
 * Convert "ipfs://bafkreicly5njual3zhcvdvqdvsyme3kcxxjguokz2taagkkvnbicm2u6ym" to "ipfs://bafk...2u6ym".
 */
export function ipfsUriToShortUri(ipfsUri: string): string {
  let shortIpfsUri = ipfsUri;
  if (ipfsUri?.length > 16) {
    shortIpfsUri = `${ipfsUri.substring(0, 11)}...${ipfsUri.substring(
      ipfsUri.length - 4
    )}`;
  }
  return shortIpfsUri?.toLowerCase();
}

/**
 * Convert error object to pretty string.
 */
export function errorToString(error: any): string {
  let errorString = JSON.stringify(error);
  if (error?.message) {
    errorString = error.message;
  }
  if (error?.error?.data?.message) {
    errorString = error.error.data.message.replace("execution reverted: ", "");
  }
  return errorString;
}

/**
 * Convert number like "1" to big number "1".
 */
export function numberToBigNumber(number?: number): BigNumber {
  if (!number) {
    return ethers.constants.Zero;
  }
  return BigNumber.from(number);
}

/**
 * Convert number like "0.01" to big number "10000000000000000".
 */
export function numberToBigNumberEthers(number?: number): BigNumber {
  if (!number) {
    return ethers.constants.Zero;
  }
  return ethers.utils.parseEther(number.toString());
}

/**
 * Convert date object to big number "1677628800".
 */
export function dateToBigNumberTimestamp(date?: Date): BigNumber {
  if (!date) {
    return ethers.constants.Zero;
  }
  return BigNumber.from(date.getTime()).div(BigNumber.from(1000));
}

/**
 * Convert date like "2023-03-01" to big number "1677628800".
 */
export function dateStringToBigNumberTimestamp(date?: string): BigNumber {
  if (!date) {
    return ethers.constants.Zero;
  }
  return BigNumber.from(new Date(date).getTime() / 1000);
}

/**
 * Convert date like "1677628800" to string "3/1/2023".
 */
export function bigNumberTimestampToLocaleDateString(
  bigNumberTimestamp?: BigNumber
): string {
  if (!bigNumberTimestamp) {
    return "Unknown";
  }
  return new Date(bigNumberTimestamp.toNumber() * 1000).toLocaleDateString();
}

/**
 * Convert string like "0x44EAe6f0C8E0714B8d8676eA803Dec04B492Ba16" to ethers address type.
 */
export function stringToAddress(string?: string): `0x${string}` | undefined {
  if (!string) {
    return undefined;
  }
  return ethers.utils.getAddress(string);
}
