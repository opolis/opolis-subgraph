import { Address, BigInt } from "@graphprotocol/graph-ts";
import { getName } from "./getName";
import { getSymbol } from "./getSymbol";
import { getDecimals } from "./getDecimals";
import { getTotalSupply } from "./getTotalSupply";
import { ethAddress } from "../../entities/Token";

const ethAddressConverted = Address.fromHexString(ethAddress);
export class ERC20 {
  address: Address;

  constructor(address: Address) {
    this.address = address;
  }
  get name(): string {
    if (this.address == ethAddressConverted) {
      return "Harmony";
    }
    return getName(this.address);
  }
  get symbol(): string {
    if (this.address == ethAddressConverted) {
      return "ONE";
    }
    return getSymbol(this.address);
  }
  get decimals(): i32 {
    if (this.address == ethAddressConverted) {
      return 18;
    }
    return getDecimals(this.address);
  }
  get totalSupply(): BigInt {
    if (this.address == ethAddressConverted) {
      return BigInt.fromString("119697200");
    }
    return getTotalSupply(this.address);
  }
}
