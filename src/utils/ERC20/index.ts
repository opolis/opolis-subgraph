import { Address, BigInt } from "@graphprotocol/graph-ts";
import { getName } from "./getName";
import { getSymbol } from "./getSymbol";
import { getDecimals } from "./getDecimals";
import { getTotalSupply } from "./getTotalSupply";

export class ERC20 {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }
  get name(): string {
    return getName(this.address);
  }
  get symbol(): string {
    return getSymbol(this.address);
  }
  get decimals(): i32 {
    return getDecimals(this.address);
  }
  get totalSupply(): BigInt {
    return getTotalSupply(this.address);
  }
}
