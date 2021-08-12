import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Token } from "../../generated/schema";
import { ERC20 } from "../utils/ERC20";

export function ensureToken(address: Address): Token {
  let dbToken = Token.load(address.toHex());
  if (dbToken) {
    return dbToken as Token;
  }
  let token: ERC20 = new ERC20(address);
  dbToken = new Token(address.toHex());
  dbToken.name = token.name;
  dbToken.symbol = token.symbol;
  dbToken.decimals = token.decimals;
  dbToken.totalSupply = token.totalSupply;

  if (
    token.decimals == -1 ||
    token.totalSupply == BigInt.fromString("-1") ||
    token.symbol == "Unknown" ||
    token.name == "Unknown"
  ) {
    dbToken.id = "Unknown";
  } else {
    dbToken.save();
  }

  return dbToken as Token;
}
