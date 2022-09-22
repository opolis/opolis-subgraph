import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Payroll } from "../../generated/schema";
import { toBigDecimal } from "../utils/toBigDecimal";
import { ensureToken } from "./Token";

export function createPayroll(
  id: BigInt,
  token: Address,
  amount: BigInt,
  payor: Address,
  createdAt: BigInt,
  txHash: Bytes,
  contractAddress: Bytes
): void {
  let dbPayroll = new Payroll(id.toString());
  let dbToken = ensureToken(token);
  dbPayroll.payrollId = id;
  dbPayroll.amount = toBigDecimal(amount, dbToken.decimals);
  dbPayroll.payor = payor;
  dbPayroll.token = dbToken.id;
  dbPayroll.createdAt = createdAt;
  dbPayroll.txHash = txHash;
  dbPayroll.contract = contractAddress.toHex();

  dbPayroll.save();
}

export function withdrawPayroll(id: BigInt, amount: BigInt, withdrawnAt: BigInt, address: Address): void {
  let dbPayroll = Payroll.load(id.toString());
  if (!dbPayroll) {
    createPayroll(
      id,
      address,
      amount,
      address,
      withdrawnAt,
      address,
      address
    );
    return;
  }

  dbPayroll.withdrawnAt = withdrawnAt;
  dbPayroll.save();
}
