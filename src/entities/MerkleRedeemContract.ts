import { MerkleRedeem } from "./../../generated/MerkleRedeem/MerkleRedeem";
import { Token } from "./../../generated/schema";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { MerkleRedeemContract } from "../../generated/schema";
import { ensureToken } from "./Token";

export function createMerkleRedeemContract(
  contractAddress: Address,
  ownerAddress: Address,
  createdAt: BigInt
): void {
  let contract: MerkleRedeem = MerkleRedeem.bind(contractAddress);
  let tokenAddressResult = contract.try_token();
  if (tokenAddressResult.reverted) {
    log.critical("token() call (Address) reverted!", []);
  }
  let dbToken: Token = ensureToken(tokenAddressResult.value);

  let dbContract = new MerkleRedeemContract(contractAddress.toHex());
  dbContract.createdAt = createdAt;
  dbContract.owner = ownerAddress;
  dbContract.rewardToken = dbToken.id;
  dbContract.totalRewardCycles = BigInt.fromString("0");

  dbContract.save();
}

export function increaseTotalRewardCycles(address: Address): void {
  let dbContract = MerkleRedeemContract.load(address.toHex());
  dbContract.totalRewardCycles = dbContract.totalRewardCycles.plus(
    BigInt.fromString("1")
  );
  dbContract.save();
}
