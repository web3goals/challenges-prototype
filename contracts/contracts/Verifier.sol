// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "./interfaces/IVerifier.sol";

/**
 * Contract to verify challenge completion by twitter data using chainlink oracle.
 */
contract Verifier is IVerifier {
    constructor() {}
}
