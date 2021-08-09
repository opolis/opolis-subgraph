import {
  MerkleRedeemContract,
  Token,
  ClaimedEvent,
  Wallet
} from "./../../generated/schema";
import { Claimed } from "./../../generated/MerkleRedeem/MerkleRedeem";
import { Address } from "@graphprotocol/graph-ts";
import { ensureToken } from "./Token";
import { toBigDecimal } from "../utils/toBigDecimal";
import { ensureWallet } from "./Wallet";

export function createClaimedEvent(event: Claimed): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbContract = MerkleRedeemContract.load(event.address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.rewardToken));
  let dbWallet: Wallet = ensureWallet(
    event.params.claimant,
    event.block.timestamp
  );

  let dbEvent: ClaimedEvent = new ClaimedEvent(eventId);
  dbEvent.wallet = dbWallet.id;
  dbEvent.rewardEpoch = event.params.rewardEpoch;
  dbEvent.claimedBalance = toBigDecimal(event.params.balance, dbToken.decimals);
  dbEvent.save();
}
