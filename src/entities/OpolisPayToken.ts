import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { OpolisPayToken } from "../../generated/schema";
import { ensureToken } from "./Token";

export function ensureOpolisPayToken(
  tokenAddress: Address,
  opolisPayAddress: Address,
  liqDestination: Address | null = null
): OpolisPayToken {
  let opolisPayTokenId = opolisPayAddress.toHex() + "-" + tokenAddress.toHex();
  let dbOpolisPayToken = OpolisPayToken.load(opolisPayTokenId);
  if (!dbOpolisPayToken) {
    let dbToken = ensureToken(tokenAddress);
    dbOpolisPayToken = new OpolisPayToken(opolisPayTokenId);
    dbOpolisPayToken.token = dbToken.id;
    dbOpolisPayToken.opolisPayContract = opolisPayAddress.toHex();
    if (liqDestination) {
      dbOpolisPayToken.liqDestination = liqDestination;
    }
    dbOpolisPayToken.save();
  }
  return dbOpolisPayToken as OpolisPayToken;
}

export function updateDestinationV3(
  opolisPayAddress: Address,
  tokenAddress: Address,
  destinationAddress: Address
): void {
  let opolisPayTokenId = opolisPayAddress.toHex() + "-" + tokenAddress.toHex();
  let dbOpolisPayToken = OpolisPayToken.load(opolisPayTokenId);

  if (!dbOpolisPayToken) {
    log.warning("updateDestinationV3: token not found at {}", [
      opolisPayTokenId,
    ]);
    return;
  }

  dbOpolisPayToken.liqDestination = destinationAddress;
  
  dbOpolisPayToken.save();
}