import {
  OwnershipTransferred,
  Stake,
  unStake
} from "../../generated/CommonsEasyStaking/CommonsEasyStaking";
import { StakingContract } from "../../generated/schema";
import {
  createStakingContract,
  updateTotalStake
} from "../entities/contracts/StakingContract";
import { createStakeEvent } from "../entities/events/CommonsEasyStaking/StakeEvent";
import { createUnstakeEvent } from "../entities/events/CommonsEasyStaking/UnstakeEvent";
import { decreaseUserStakeBy, increaseUserStakeBy } from "../entities/User";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let dbContract = StakingContract.load(event.address.toHex());
  if (dbContract) {
    dbContract.owner = event.params.newOwner;
    dbContract.save();
  } else {
    createStakingContract(
      event.address,
      event.params.newOwner,
      event.block.timestamp
    );
  }
}

export function handleStake(event: Stake): void {
  increaseUserStakeBy(
    event.address,
    event.params.staker,
    event.params.amountStaked,
    event.block.timestamp
  );
  updateTotalStake(event.address, event.params.totalStaked);
  createStakeEvent(event);
}

export function handleUnstake(event: unStake): void {
  decreaseUserStakeBy(
    event.address,
    event.params.unstaker,
    event.params.amountUnstaked,
    event.block.timestamp
  );
  updateTotalStake(event.address, event.params.totalStaked);
  createUnstakeEvent(event);
}
