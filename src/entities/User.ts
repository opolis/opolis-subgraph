import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { toBigDecimal } from "../utils/toBigDecimal";
import {
  MerkleRedeemContract,
  StakingContract,
  Token,
  User,
  Wallet
} from "../../generated/schema";
import { ensureToken } from "./Token";
import { ensureWallet } from "./Wallet";

export function createUser(
  address: Address,
  isEmployee: boolean,
  isWhitelisted: boolean,
  timestamp: BigInt
): User {
  let dbWallet: Wallet = ensureWallet(address, timestamp);

  let dbUser: User = new User(address.toHex());
  dbUser.defaultWallet = dbWallet.id;
  dbUser.preferredWallet = dbWallet.id;
  dbUser.isEmployee = isEmployee;
  dbUser.isWhitelisted = isWhitelisted;
  dbUser.createdAt = timestamp;
  dbUser.totalStakedBalance = BigDecimal.fromString("0");
  dbUser.totalRewardClaimed = BigDecimal.fromString("0");
  dbUser.save();
  return dbUser;
}

export function isEmployee(address: Address): boolean {
  let dbUser = User.load(address.toHex());

  if (!dbUser) {
    log.error("User with id: {} doesn't exist!", [address.toHex()]);
    return false;
  }
  return dbUser.isEmployee;
}

export function updatePreferredWallet(
  oldPreferredWalletAddress: Address,
  newPreferredWalletAddress: Address,
  timestamp: BigInt
): void {
  let dbOldPreferredWallet: Wallet = ensureWallet(
    oldPreferredWalletAddress,
    timestamp
  );
  let dbUser = User.load(dbOldPreferredWallet.user);

  if (!dbUser) {
    log.error("User with id: {} doesn't exist!", [dbOldPreferredWallet.user]);
    return;
  }

  let dbPreferredWallet: Wallet = ensureWallet(
    newPreferredWalletAddress,
    timestamp
  );

  dbPreferredWallet.user = dbUser.id;
  dbPreferredWallet.save();

  dbUser.preferredWallet = dbPreferredWallet.id;
  dbUser.save();
}

export function removeUserFromWhitelist(address: Address): void {
  let dbUser = User.load(address.toHex());

  if (!dbUser) {
    log.error("User with id: {} doesn't exist!", [address.toHex()]);
    return;
  }

  dbUser.isWhitelisted = false;
  dbUser.save();
}

export function increaseUserStakeBy(
  stakingContractAddress: Address,
  walletAddress: Address,
  value: BigInt,
  timestamp: BigInt
): void {
  let dbWallet: Wallet = ensureWallet(walletAddress, timestamp);
  let dbUser = User.load(dbWallet.user);
  if (!dbUser) {
    log.error("User with id: {} doesn't exist!", [dbWallet.user]);
    return;
  }
  let dbContract = StakingContract.load(stakingContractAddress.toHex());
  if (!dbContract) {
    log.error("StakingContract with id: {} doesn't exist!", [
      stakingContractAddress.toHex()
    ]);
    return;
  }
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));

  if (!dbUser) {
    dbUser = createUser(walletAddress, false, true, timestamp);
  }

  dbUser.totalStakedBalance = dbUser.totalStakedBalance.plus(
    toBigDecimal(value, dbToken.decimals)
  );
  dbUser.save();
}

export function decreaseUserStakeBy(
  stakingContractAddress: Address,
  walletAddress: Address,
  value: BigInt,
  timestamp: BigInt
): void {
  let dbWallet: Wallet = ensureWallet(walletAddress, timestamp);
  let dbUser = User.load(dbWallet.user);
  if (!dbUser) {
    log.error("User with id: {} doesn't exist!", [dbWallet.user]);
    return;
  }
  let dbContract = StakingContract.load(stakingContractAddress.toHex());
  if (!dbContract) {
    log.error("StakingContract with id: {} doesn't exist!", [
      stakingContractAddress.toHex()
    ]);
    return;
  }
  let dbToken: Token = ensureToken(Address.fromString(dbContract.stakeToken));
  dbUser.totalStakedBalance = dbUser.totalStakedBalance.minus(
    toBigDecimal(value, dbToken.decimals)
  );
  dbUser.save();
}

export function increaseRewardClaimedBy(
  merkleRedeemContractAddress: Address,
  walletAddress: Address,
  value: BigInt,
  timestamp: BigInt
): void {
  let dbWallet: Wallet = ensureWallet(walletAddress, timestamp);
  let dbUser = User.load(dbWallet.user);
  if (!dbUser) {
    dbUser = createUser(walletAddress, false, false, timestamp);
  }
  let dbContract = MerkleRedeemContract.load(
    merkleRedeemContractAddress.toHex()
  );
  if (!dbContract) {
    log.error("MerkleRedeemContract with id: {} doesn't exist!", [
      merkleRedeemContractAddress.toHex()
    ]);
    return;
  }
  let dbToken: Token = ensureToken(Address.fromString(dbContract.rewardToken));
  dbUser.totalRewardClaimed = dbUser.totalRewardClaimed.plus(
    toBigDecimal(value, dbToken.decimals)
  );
  dbUser.save();
}
