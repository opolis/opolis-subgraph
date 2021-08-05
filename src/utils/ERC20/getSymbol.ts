import { Address, log } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "./../../../generated/CommonsEasyStaking/ERC20Contract";
import { ERC20SymbolBytes } from "./../../../generated/CommonsEasyStaking/ERC20SymbolBytes";

export function getSymbol(address: Address): string {
  let contract: ERC20Contract = ERC20Contract.bind(address);

  let symbolResult = contract.try_symbol();
  let symbol: string = "Unknown";

  // standard ERC20 implementation
  if (!symbolResult.reverted) {
    return symbolResult.value;
  }

  // non-standard ERC20 implementation
  let bytesContract: ERC20SymbolBytes = ERC20SymbolBytes.bind(address);

  let symbolBytesCall = bytesContract.try_symbol();
  if (!symbolBytesCall.reverted) {
    return symbolBytesCall.value.toString();
  }

  // warning if both calls fail
  log.warning("symbol() call (string or bytes) reverted for {}", [
    address.toHex()
  ]);
  return symbol;
}
