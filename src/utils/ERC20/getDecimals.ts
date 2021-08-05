import { Address, log } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "./../../../generated/CommonsEasyStaking/ERC20Contract";

export function getDecimals(address: Address): i32 {
  let contract: ERC20Contract = ERC20Contract.bind(address);

  let decimalsResult = contract.try_decimals();
  let decimals: i32 = -1;

  // standard ERC20 implementation
  if (!decimalsResult.reverted) {
    return decimalsResult.value;
  }

  // warning if both calls fail
  log.warning("decimals() call (i32) reverted for {}", [address.toHex()]);
  return decimals;
}
