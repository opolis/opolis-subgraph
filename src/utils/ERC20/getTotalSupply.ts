import { Address, log, BigInt } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "./../../../generated/CommonsEasyStaking/ERC20Contract";

export function getTotalSupply(address: Address): BigInt {
  let contract: ERC20Contract = ERC20Contract.bind(address);

  let totalSupplyResult = contract.try_totalSupply();
  let totalSupply: BigInt = BigInt.fromString("-1");

  // standard ERC20 implementation
  if (!totalSupplyResult.reverted) {
    return totalSupplyResult.value;
  }

  // warning if both calls fail
  log.warning("totalSupply() call (BigInt) reverted for {}", [address.toHex()]);
  return totalSupply;
}
