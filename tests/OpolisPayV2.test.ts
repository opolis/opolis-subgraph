import { BigInt } from "@graphprotocol/graph-ts";
import { assert, test } from "matchstick-as";
import {
  handleOpsStakeWithdrawV2,
  handleSetupCompleteV2,
  handleStakedV2
} from "../src/mappings/OpolisPay";
import { toBigDecimal } from "../src/utils/toBigDecimal";
import { accounts, opolisPayMockData } from "./helpers/constants";
import { createSetupComplete, mockToken } from "./helpers/mockers";
import {
  createOpsStakeWithdrawV2,
  createStakedV2
} from "./helpers/mockers/events/OpolisPayV2";

test("can handle SetupComplete event", () => {
  let event = createSetupComplete(
    accounts[0],
    accounts[1],
    accounts[0],
    opolisPayMockData.supportedTokens
  );
  opolisPayMockData.supportedTokens.forEach(token => {
    mockToken(token);
  });

  // call event handler
  handleSetupCompleteV2(event);

  assert.fieldEquals(
    "OpolisPayContract",
    opolisPayMockData.address.toHex(),
    "version",
    "2"
  );
  // no need to repeat more tests
});

test("can handle Staked event", () => {
  let event = createStakedV2(
    accounts[0],
    BigInt.fromI32(1),
    opolisPayMockData.supportedTokens[0].address,
    BigInt.fromI32(10).pow(18),
    BigInt.fromI32(1),
    opolisPayMockData.address
  );

  // call event handler
  handleStakedV2(event);

  // Stake entity tests
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "id",
    event.params.memberId.toString() + "-1-2"
  );
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "staker",
    event.params.staker.toHex()
  );
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "token",
    event.params.token.toHex()
  );
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "amount",
    toBigDecimal(
      event.params.amount,
      opolisPayMockData.supportedTokens[0].decimals
    ).toString()
  );
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "stakeNumber",
    BigInt.fromI32(1).toString()
  );
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "createdAt",
    event.block.timestamp.toString()
  );
  assert.fieldEquals(
    "Stake",
    event.params.memberId.toString() + "-1-2",
    "contract",
    event.address.toHex()
  );

  // StakedEvent entity tests
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  assert.fieldEquals("StakedEvent", eventId, "id", eventId);
  assert.fieldEquals(
    "StakedEvent",
    eventId,
    "staker",
    event.params.staker.toHex()
  );
  assert.fieldEquals(
    "StakedEvent",
    eventId,
    "memberId",
    event.params.memberId.toString()
  );
  assert.fieldEquals(
    "StakedEvent",
    eventId,
    "amount",
    toBigDecimal(
      event.params.amount,
      opolisPayMockData.supportedTokens[0].decimals
    ).toString()
  );
  assert.fieldEquals(
    "StakedEvent",
    eventId,
    "token",
    event.params.token.toHex()
  );
  assert.fieldEquals(
    "StakedEvent",
    eventId,
    "timestamp",
    event.block.timestamp.toString()
  );
});

test("can handle OpsStakeWithdrawEvent", () => {
  let event = createOpsStakeWithdrawV2(
    opolisPayMockData.supportedTokens[0].address,
    BigInt.fromI32(1),
    BigInt.fromI32(10).pow(18),
    BigInt.fromI32(1),
    opolisPayMockData.address
  );

  // call event handler
  handleOpsStakeWithdrawV2(event);

  // Stake entity tests
  assert.fieldEquals(
    "Stake",
    event.params.stakeId.toString() + "-1-2",
    "id",
    event.params.stakeId.toString() + "-1-2"
  );
  assert.fieldEquals(
    "Stake",
    event.params.stakeId.toString() + "-1-2",
    "token",
    event.params.token.toHex()
  );
  assert.fieldEquals(
    "Stake",
    event.params.stakeId.toString() + "-1-2",
    "amount",
    toBigDecimal(
      event.params.amount,
      opolisPayMockData.supportedTokens[0].decimals
    ).toString()
  );
  assert.fieldEquals(
    "Stake",
    event.params.stakeId.toString() + "-1-2",
    "stakeNumber",
    BigInt.fromI32(1).toString()
  );
  assert.fieldEquals(
    "Stake",
    event.params.stakeId.toString() + "-1-2",
    "withdrawnAt",
    event.block.timestamp.toString()
  );

  // OpsStakeWithdrawEvent entity tests
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  assert.fieldEquals("OpsStakeWithdrawEvent", eventId, "id", eventId);
  assert.fieldEquals(
    "OpsStakeWithdrawEvent",
    eventId,
    "stakeId",
    event.params.stakeId.toString()
  );
  assert.fieldEquals(
    "OpsStakeWithdrawEvent",
    eventId,
    "amount",
    toBigDecimal(
      event.params.amount,
      opolisPayMockData.supportedTokens[0].decimals
    ).toString()
  );
  assert.fieldEquals(
    "OpsStakeWithdrawEvent",
    eventId,
    "token",
    event.params.token.toHex()
  );
  assert.fieldEquals(
    "OpsStakeWithdrawEvent",
    eventId,
    "stakeNumber",
    BigInt.fromI32(1).toString()
  );
  assert.fieldEquals(
    "OpsStakeWithdrawEvent",
    eventId,
    "timestamp",
    event.block.timestamp.toString()
  );
});
