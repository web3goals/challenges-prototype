export const deployedContracts: {
  [key: string]: {
    profile?: string;
    challenge?: string;
    verifier?: string;
  };
} = {
  ftmTestnet: {
    profile: "0xFe0AeD5cBEE89869FF505e10A5eBb75e9FC819D7",
    challenge: "0x280b48e6e8786FccC337CE5e7bfEeE8c186e0F66",
    verifier: "0xd6600E32c8FA0Ba6a50807aCFb65979b0fF87e7e",
  },
};

export const contractsData: {
  [key: string]: {
    verifierContract: {
      chainlinkTokenAddress: string;
      chainlinkOracleAddress: string;
      chainlinkJobId: string;
    };
  };
} = {
  ftmTestnet: {
    verifierContract: {
      chainlinkTokenAddress: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
      chainlinkOracleAddress: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
      chainlinkJobId: "c1c5e92880894eb6b27d3cae19670aa3",
    },
  },
};
