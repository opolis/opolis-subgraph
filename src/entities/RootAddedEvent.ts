import {
  RootAddedEvent,
  MerkleRedeemContract,
  Token
} from "./../../generated/schema";
import { RootAdded } from "./../../generated/MerkleRedeem/MerkleRedeem";
import { Address } from "@graphprotocol/graph-ts";
import { ensureToken } from "./Token";
import { toBigDecimal } from "../utils/toBigDecimal";

export function createRootAddedEvent(event: RootAdded): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbContract = MerkleRedeemContract.load(event.address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.rewardToken));

  let dbEvent: RootAddedEvent = new RootAddedEvent(eventId);
  dbEvent.depositor = event.params.depositor;
  dbEvent.rewardEpoch = event.params.rewardEpoch;
  dbEvent.totalAllocation = toBigDecimal(
    event.params.totalAllocation,
    dbToken.decimals
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
