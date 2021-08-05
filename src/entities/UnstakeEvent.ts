import {
  UnstakeEvent,
  StakingContract,
  Wallet,
  Token
} from "./../../generated/schema";
import { unStake } from "./../../generated/CommonsEasyStaking/CommonsEasyStaking";
import { ensureWallet } from "./Wallet";
import { ensureToken } from "./Token";
import { Address } from "@graphprotocol/graph-ts";
import { toBigDecimal } from "../utils/toBigDecimal";

export function createUnstakeEvent(event: unStake): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: UnstakeEvent = new UnstakeEvent(eventId);
  let dbWallet: Wallet = ensureWallet(
    event.params.unstaker,
    event.block.timestamp
  );
  let dbContract = StakingContract.load(event.address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));

  dbEvent.user = dbWallet.user;
  dbEvent.wallet = dbWallet.id;
  dbEvent.amount = toBigDecimal(event.params.amountUnstaked, dbToken.decimals);
  dbEvent.totalStaked = toBigDecimal(
    event.params.totalStaked,
    dbToken.decimals
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
