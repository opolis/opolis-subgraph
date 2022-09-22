import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { OpolisPayContract, Stake } from "../../generated/schema";
import { toBigDecimal } from "../utils/toBigDecimal";
import { ensureToken, ethAddress } from "./Token";

let nullAddress = new Address (0x0000000000000000000000000000000000000000);

export function createStake(
  id: BigInt,
  token: Address,
  amount: BigInt,
  staker: Address,
  stakeNumber: BigInt,
  createdAt: BigInt,
  value: BigInt,
  txHash: Bytes,
  contractAddress: Bytes
): void {
  let dbContract = OpolisPayContract.load(
    contractAddress.toHex()
  ) as OpolisPayContract;
  let dbStake = new Stake(
    id.toString() +
      "-" +
      stakeNumber.toString() +
      "-" +
      dbContract.version.toString()
  );
  let dbToken = ensureToken(token);
  dbStake.memberId = id;
  if (token.toHex() == ethAddress.toLowerCase()) {
    dbStake.amount = toBigDecimal(value, dbToken.decimals);
    dbStake.withdrawnAt = createdAt;
  } else {
    dbStake.amount = toBigDecimal(amount, dbToken.decimals);
  }
  dbStake.staker = staker;
  dbStake.token = dbToken.id;
  dbStake.stakeNumber = stakeNumber;
  dbStake.createdAt = createdAt;
  dbStake.txHash = txHash;
  dbStake.contract = contractAddress.toHex();

  dbStake.save();
}

export function withdrawStake(
  id: BigInt,
  stakeNumber: BigInt,
  withdrawnAt: BigInt,
  contractAddress: Bytes
): void {
  let dbContract = OpolisPayContract.load(
    contractAddress.toHex()
  ) as OpolisPayContract;
  let dbStake = Stake.load(
    id.toString() +
      "-" +
      stakeNumber.toString() +
      "-" +
      dbContract.version.toString()
  );
  if (!dbStake) {
    createStake(
      id,
      nullAddress,
      new BigInt(1),
      nullAddress,
      stakeNumber,
      new BigInt(1),
      new BigInt(1),
      contractAddress,
      contractAddress
    );
    return;
  }

  dbStake.withdrawnAt = withdrawnAt;
  dbStake.save();
}
