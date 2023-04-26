import { Address, BigInt } from "@graphprotocol/graph-ts";
import { MockTokenData } from "./token";

export const ownerAddress = Address.fromString(
  "0x51e9210d7ee7a8e7064c8a71f0cb0baa2205f298"
);
export const accounts = [
  Address.fromString("0xc0ffee254729296a45a3885639ac7e10f9d54979"),
  Address.fromString("0x999999cf1046e68e36e1aa2e0e07105eddd1f08e"),
  Address.fromString("0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5")
];

export const workTokenMockData = new MockTokenData(
  Address.fromString("0xe28d1611180320d0df6b35b83cc15cac7bb439e6"),
  18,
  "MumbaiTestWork",
  "WORKvMT",
  BigInt.fromString("325000000000000000000000000")
);

export const usdcMockData = new MockTokenData(
  Address.fromString("0x0000000000000000000000000000000000000001"),
  6,
  "USD Coin",
  "USDC",
  BigInt.fromString("10").pow(10)
);

export const daiMockData = new MockTokenData(
  Address.fromString("0x0000000000000000000000000000000000000002"),
  18,
  "Dai Stablecoin",
  "DAI",
  BigInt.fromString("10").pow(20)
);

export namespace whitelistContractMockData {
  export const address = Address.fromString(
    "0xd268969970570c5c41ffec12813da0bc73581826"
  );
}

export namespace stakingContractMockData {
  export const description = "Test Mumbai";
  export const address = Address.fromString(
    "0x4e0b295e8e24f841740ecc94cfbe3e75adcd6955"
  );
  export const minStake = BigInt.fromI32(1);
  export const totalStaked = BigInt.fromI32(0);
  export const stakeToken = workTokenMockData.address;
}

export namespace merkleRedeemMockData {
  export const address = Address.fromString(
    "0xb3f54a4c816be3baae88eb49711dc6eb63632f6c"
  );
  export const rewardToken = workTokenMockData.address;
}

export namespace opolisPayMockData {
  export const address = Address.fromString(
    "0x8AB47DdF7654029F6c4d9E11D601fc2C4C6500cd"
  );
  export const supportedTokens = [usdcMockData, daiMockData];
}
