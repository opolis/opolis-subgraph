import { Address, log } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "./../../../generated/CommonsEasyStaking/ERC20Contract";
import { ERC20NameBytes } from "./../../../generated/CommonsEasyStaking/ERC20NameBytes";

export function getName(address: Address): string {
  let contract: ERC20Contract = ERC20Contract.bind(address);

  let nameResult = contract.try_name();
  let name: string = "Unknown";

  // standard ERC20 implementation
  if (!nameResult.reverted) {
    return nameResult.value;
  }

  // non-standard ERC20 implementation
  let bytesContract: ERC20NameBytes = ERC20NameBytes.bind(address);

  let nameBytesResult = bytesContract.try_name();
  if (!nameBytesResult.reverted) {
    return nameBytesResult.value.toString();
  }

  // warning if both calls fail
  log.warning("name() call (string or bytes) reverted for {}", [
    address.toHex()
  ]);
  return name;
}
