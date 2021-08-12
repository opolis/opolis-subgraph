import { CommonsEasyStaking } from "./../../generated/CommonsEasyStaking/CommonsEasyStaking";
import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { StakingContract, Token } from "./../../generated/schema";
import { ensureToken } from "./Token";
import { toBigDecimal } from "../utils/toBigDecimal";

export function createStakingContract(
  address: Address,
  owner: Address,
  createdAt: BigInt
): void {
  let dbContract: StakingContract = new StakingContract(address.toHex());
  dbContract.createdAt = createdAt;
  dbContract.owner = owner;
  dbContract.isPaused = false;

  let contract: CommonsEasyStaking = CommonsEasyStaking.bind(address);

  // store stakeToken
  let stakeTokenAddressResult = contract.try_stakeToken();
  if (stakeTokenAddressResult.reverted) {
    // Note: This is will pause the graph indexing process!
    log.critical("stakeTokenAddress() call (Address) reverted!", []);
  }
  let stakeToken: Token = ensureToken(stakeTokenAddressResult.value);
  if (stakeToken.id == "Unknown") {
    log.critical("stakeToken: {} isn't standard ERC20 token!", [
      stakeTokenAddressResult.value.toHex()
    ]);
  }

  dbContract.stakeToken = stakeToken.id;

  // store minStake
  let minStakeResult = contract.try_minStake();
  if (minStakeResult.reverted) {
    log.critical("minStakeResult() call (BigInt) reverted!", []);
  }
  dbContract.minStake = toBigDecimal(minStakeResult.value, stakeToken.decimals);

  // store totalStakeResult
  let totalStakeResult = contract.try_totalStaked();
  if (totalStakeResult.reverted) {
    log.critical("totalStakeResult() call (BigInt) reverted!", []);
  }
  dbContract.totalStake = toBigDecimal(
    totalStakeResult.value,
    stakeToken.decimals
  );

  // store description
  let descriptionResult = contract.try_desc();
  let decription: string = descriptionResult.reverted
    ? ""
    : descriptionResult.value;
  dbContract.description = decription;

  dbContract.save();
}

export function updateTotalStake(address: Address, value: BigInt): void {
  let dbContract = StakingContract.load(address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));
  dbContract.totalStake = toBigDecimal(value, dbToken.decimals);
  dbContract.save();
}

export function increaseTotalStakeBy(address: Address, value: BigInt): void {
  let dbContract = StakingContract.load(address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));
  dbContract.totalStake = dbContract.totalStake.plus(
    toBigDecimal(value, dbToken.decimals)
  );
  dbContract.save();
}

export function decreaseTotalStakeBy(address: Address, value: BigInt): void {
  let dbContract = StakingContract.load(address.toHex());
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));
  dbContract.totalStake = dbContract.totalStake.minus(
    toBigDecimal(value, dbToken.decimals)
  );
  dbContract.save();
}
