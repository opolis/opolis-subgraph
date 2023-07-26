import { assert, clearStore, test } from "matchstick-as";
import {
  handleSetupCompleteV3,
  handleNewDestinationV3,
  handleNewTokensV3,
} from "../src/mappings/OpolisPay";
import { accounts, opolisPayMockData, usdcMockData } from "./helpers/constants";
import { mockToken } from "./helpers/mockers";
import {
  createNewDestination,
  createNewTokens,
  createSetupCompleteV3,
} from "./helpers/mockers/events/OpolisPayV3";
import { Address } from "@graphprotocol/graph-ts";

test("can handle SetupCompleteV3", () => {
  let event = createSetupCompleteV3(
    accounts[0],
    accounts[1],
    accounts[2],
    [opolisPayMockData.supportedTokens[0]],
    [accounts[0]]
  );
  opolisPayMockData.supportedTokens.forEach((token) => {
    mockToken(token);
  });

  // call event handler
  handleSetupCompleteV3(event);

  assert.fieldEquals(
    "OpolisPayContract",
    opolisPayMockData.address.toHex(),
    "version",
    "3"
  );
  assert.fieldEquals(
    "OpolisPayContract",
    opolisPayMockData.address.toHex(),
    "destination",
    accounts[2].toHex()
  );
  // check that the destinations are set
  assert.fieldEquals(
    "OpolisPayToken",
    opolisPayMockData.address.toHex() +
      "-" +
      opolisPayMockData.supportedTokens[0].address.toHex(),
    "liqDestination",
    accounts[0].toHex()
  );
});

test("can handle NewTokens", () => {
  let event = createNewTokens(
    [opolisPayMockData.supportedTokens[1]],
    [accounts[1]]
  );
  opolisPayMockData.supportedTokens.forEach((token) => {
    mockToken(token);
  });

  // call event handler
  handleNewTokensV3(event);

  // check that the destinations are set
  assert.fieldEquals(
    "OpolisPayToken",
    opolisPayMockData.address.toHex() +
      "-" +
      opolisPayMockData.supportedTokens[1].address.toHex(),
    "liqDestination",
    accounts[1].toHex()
  );
});

test("can handle NewDestination", () => {
  let event = createNewDestination(
    accounts[0],
    opolisPayMockData.supportedTokens[0].address,
    accounts[2]
  );

  opolisPayMockData.supportedTokens.forEach((token) => {
    mockToken(token);
  });

  handleNewDestinationV3(event);

  // check that the destinations are set
  assert.fieldEquals(
    "OpolisPayToken",
    opolisPayMockData.address.toHex() + "-" + usdcMockData.address.toHex(),
    "liqDestination",
    accounts[2].toHex()
  );
});

test("can handle NewDestination with nonexistant token", () => {
  clearStore();
  let badToken = Address.fromString(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  );
  let event = createNewDestination(accounts[0], badToken, accounts[2]);

  opolisPayMockData.supportedTokens.forEach((token) => {
    mockToken(token);
  });

  handleNewDestinationV3(event);

  assert.notInStore(
    "OpolisPayToken",
    opolisPayMockData.address.toHex() + "-" + badToken.toHex()
  );
  assert.notInStore(
    "NewDestinationEventV3",
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
});
