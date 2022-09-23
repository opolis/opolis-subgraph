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
  log.info("Inputs are correct {}", 
    [id.toHexString(), 
    token.toHexString(), 
    amount.toHexString(), 
    staker.toHexString(),
    stakeNumber.toHexString(),
    createdAt.toHexString(),
    value.toHexString(),
    txHash.toHexString(),
    contractAddress.toHexString()
  ])

  log.info("Contract Address is right address {}", [contractAddress.toHexString()])

  let dbContract = OpolisPayContract.load(
    contractAddress.toHex()
  ) as OpolisPayContract;

  if (!dbContract){
    log.critical("Contract is missing", [id.toString()])
    let dbStake = new Stake(
      id.toString() +
        "-" +
        stakeNumber.toString() +
        "-" +
        BigInt.fromI32(2).toString()
    );
    let dbToken = ensureToken(token);

    log.info("Token works", [dbToken.symbol.toString()])
  
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


  } else {

    let dbStake = new Stake(
      id.toString() +
        "-" +
        stakeNumber.toString() +
        "-" +
        dbContract.version.toString()
    );

    let dbToken = ensureToken(token);

    log.info("Token works", [dbToken.symbol.toString()])
  
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

  log.info("Contract is loaded {}", [dbContract.destination.toHexString()]);

  
  // let dbToken = ensureToken(token);

  // log.info("Token works", [dbToken.symbol.toString()])

  // dbStake.memberId = id;
  // if (token.toHex() == ethAddress.toLowerCase()) {
  //   dbStake.amount = toBigDecimal(value, dbToken.decimals);
  //   dbStake.withdrawnAt = createdAt;
  // } else {
  //   dbStake.amount = toBigDecimal(amount, dbToken.decimals);
  // }
  // dbStake.staker = staker;
  // dbStake.token = dbToken.id;
  // dbStake.stakeNumber = stakeNumber;
  // dbStake.createdAt = createdAt;
  // dbStake.txHash = txHash;
  // dbStake.contract = contractAddress.toHex();

  // dbStake.save();
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
    log.debug("Starting to create a missing stake with stakeId {}", [id.toString()]);
    createStake(
      id,
      nullAddress,
      BigInt.fromI32(2),
      nullAddress,
      stakeNumber,
      BigInt.fromI32(2),
      BigInt.fromI32(2),
      nullAddress,
      contractAddress
    );
    log.debug("Had to create a missing stake with stakeId {}", [id.toString()]);
    let dbStake = Stake.load(
      id.toString() +
        "-" +
        stakeNumber.toString() +
        "-" +
        dbContract.version.toString()
    );
    if (!dbStake){
      log.critical("withdrawStake: stake with stakeId: {} doesn't exist!", [
        id.toString()
      ]);
      return;
    } else {
      dbStake.withdrawnAt = withdrawnAt
      dbStake.save();
    }
  } else {
    dbStake.withdrawnAt = withdrawnAt;
    dbStake.save();
  }
}
