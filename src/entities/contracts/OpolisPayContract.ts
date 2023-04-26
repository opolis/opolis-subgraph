import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { OpolisPayContract } from "../../../generated/schema";
import { ensureOpolisPayToken } from "../OpolisPayToken";

export function createOpolisPayContract(
  address: Address,
  destination: Address,
  admin: Address,
  helper: Address,
  tokens: Address[],
  createdAt: BigInt,
  version: i32,
  liqDestinations: Address[] | null = null
): void {
  let dbContract = new OpolisPayContract(address.toHex());
  dbContract.destination = destination;
  dbContract.opolisAdmin = admin;
  dbContract.opolisHelper = helper;
  dbContract.createdAt = createdAt;
  dbContract.version = version;
  dbContract.save();
  addTokens(address, tokens, liqDestinations);
}

export function updateDestination(
  contractAddress: Address,
  destinationAddress: Address
): void {
  let dbContract = OpolisPayContract.load(contractAddress.toHex());
  if (!dbContract) {
    log.critical("updateDestination: contract not found at {}", [
      contractAddress.toHex(),
    ]);
    return;
  }
  dbContract.destination = destinationAddress;
  dbContract.save();
}

export function updateAdmin(
  contractAddress: Address,
  adminAddress: Address
): void {
  let dbContract = OpolisPayContract.load(contractAddress.toHex());
  if (!dbContract) {
    log.critical("updateAdmin: contract not found at {}", [
      contractAddress.toHex(),
    ]);
    return;
  }
  dbContract.opolisAdmin = adminAddress;
  dbContract.save();
}

export function updateHelper(
  contractAddress: Address,
  helperAddress: Address
): void {
  let dbContract = OpolisPayContract.load(contractAddress.toHex());
  if (!dbContract) {
    log.critical("updateDestination: contract not found at {}", [
      contractAddress.toHex(),
    ]);
    return;
  }
  dbContract.opolisHelper = helperAddress;
  dbContract.save();
}

export function addTokens(
  contractAddress: Address,
  tokens: Address[],
  liqDestinations: Address[] | null = null
): void {
  let dbContract = OpolisPayContract.load(contractAddress.toHex());
  if (!dbContract) {
    log.critical("addTokens: contract not found at {}", [
      contractAddress.toHex(),
    ]);
    return;
  }
  for (let i = 0; i < tokens.length; i++) {
    if (liqDestinations) {
      ensureOpolisPayToken(tokens[i], contractAddress, liqDestinations[i]);
    } else {
      ensureOpolisPayToken(tokens[i], contractAddress);
    }
  }
  dbContract.save();
}
