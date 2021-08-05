import {
  StakeEvent,
  StakingContract,
  Token,
  Wallet
} from "./../../generated/schema";
import { Stake } from "./../../generated/CommonsEasyStaking/CommonsEasyStaking";
import { ensureWallet } from "./Wallet";
import { ensureToken } from "./Token";
import { Address } from "@graphprotocol/graph-ts";
import { toBigDecimal } from "../utils/toBigDecimal";

export function createStakeEvent(event: Stake): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: StakeEvent = new StakeEvent(eventId);
  let dbWallet: Wallet = ensureWallet(
    event.params.staker,
    event.block.timestamp
  );
  let dbContract = StakingContract.load(event.address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));

  dbEvent.user = dbWallet.user;
  dbEvent.wallet = dbWallet.id;
  dbEvent.amount = toBigDecimal(event.params.amountStaked, dbToken.decimals);
  dbEvent.totalStaked = toBigDecimal(
    event.params.totalStaked,
    dbToken.decimals
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
