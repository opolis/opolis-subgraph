import { assert, test } from "matchstick-as";
import { OwnershipTransferred } from "../generated/CommonsWhitelist/CommonsWhitelist";
import {
  handleAddedToWhitelist,
  handleOwnershipTransferred,
  handleRemovedFromWhitelist,
  handleUpdatedWhitelistAddress
} from "../src/mappings/CommonsWhitelist";
import { accounts, whitelistContractMockData } from "./helpers/constants";
import {
  createMockAddedToWhitelist,
  createMockOwnershipTransferred,
  createMockRemovedFromWhitelist,
  createMockUpdatedWhitelistAddress
} from "./helpers/mockers";

test("can handle OwnershipTransferred event", () => {
  // Create mock events and functions
  let event = createMockOwnershipTransferred<OwnershipTransferred>(
    whitelistContractMockData.address,
    accounts[0],
    accounts[1]
  );

  // call event handler
  handleOwnershipTransferred(event);

  // tests
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "id",
    event.address.toHex()
  );
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "owner",
    accounts[1].toHex()
  );
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "totalUsers",
    "0"
  );
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "totalWhitelistedUsers",
    "0"
  );
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "totalWhitelistedEmployees",
    "0"
  );
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "totalEmployeeUsers",
    "0"
  );
  assert.fieldEquals(
    "WhitelistContract",
    event.address.toHex(),
    "totalCoalitionUsers",
    "0"
  );
});

test("can handle AddedToWhitelist event", () => {
  // Create mock events and functions
  let event = createMockAddedToWhitelist(accounts[0], true);

  // call event handler
  handleAddedToWhitelist(event);

  // wallet entity tests
  assert.fieldEquals("Wallet", accounts[0].toHex(), "id", accounts[0].toHex());
  assert.fieldEquals(
    "Wallet",
    accounts[0].toHex(),
    "user",
    accounts[0].toHex()
  );

  // user entity tests
  assert.fieldEquals("User", accounts[0].toHex(), "id", accounts[0].toHex());
  assert.fieldEquals(
    "User",
    accounts[0].toHex(),
    "defaultWallet",
    accounts[0].toHex()
  );
  assert.fieldEquals(
    "User",
    accounts[0].toHex(),
    "preferredWallet",
    accounts[0].toHex()
  );
  assert.fieldEquals("User", accounts[0].toHex(), "isEmployee", "true");
  assert.fieldEquals("User", accounts[0].toHex(), "isWhitelisted", "true");
  assert.fieldEquals("User", accounts[0].toHex(), "totalStakedBalance", "0");
  assert.fieldEquals("User", accounts[0].toHex(), "totalRewardClaimed", "0");

  // whitelistContract entity tests
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "id",
    whitelistContractMockData.address.toHex()
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalUsers",
    "1"
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalWhitelistedUsers",
    "1"
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalEmployeeUsers",
    "1"
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalWhitelistedEmployees",
    "1"
  );

  // AddedToWhitelistEvent entity tests
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  assert.fieldEquals("AddedToWhitelistEvent", eventId, "id", eventId);
  assert.fieldEquals(
    "AddedToWhitelistEvent",
    eventId,
    "isEmployee",
    event.params.employee ? "true" : "false"
  );
  assert.fieldEquals(
    "AddedToWhitelistEvent",
    eventId,
    "user",
    event.params.account.toHex()
  );
  assert.fieldEquals(
    "AddedToWhitelistEvent",
    eventId,
    "timestamp",
    event.block.timestamp.toString()
  );
});

test("can handle UpdatedWhitelistAddress event", () => {
  // Create mock events and functions
  let event = createMockUpdatedWhitelistAddress(accounts[0], accounts[1]);

  // call event handler
  handleUpdatedWhitelistAddress(event);

  // wallet entity tests
  assert.fieldEquals("Wallet", accounts[1].toHex(), "id", accounts[1].toHex());
  assert.fieldEquals(
    "Wallet",
    accounts[1].toHex(),
    "user",
    accounts[0].toHex()
  );

  // user entity tests
  assert.fieldEquals("User", accounts[0].toHex(), "id", accounts[0].toHex());
  assert.fieldEquals(
    "User",
    accounts[0].toHex(),
    "preferredWallet",
    accounts[1].toHex()
  );

  // UpdatedWhitelistAddressEvent entity tests
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  assert.fieldEquals("UpdatedWhitelistAddressEvent", eventId, "id", eventId);
  assert.fieldEquals(
    "UpdatedWhitelistAddressEvent",
    eventId,
    "user",
    event.params.oldAddress.toHex()
  );
  assert.fieldEquals(
    "UpdatedWhitelistAddressEvent",
    eventId,
    "updatedWallet",
    event.params.newMemberAddress.toHex()
  );
  assert.fieldEquals(
    "UpdatedWhitelistAddressEvent",
    eventId,
    "oldWallet",
    event.params.oldAddress.toHex()
  );
  assert.fieldEquals(
    "UpdatedWhitelistAddressEvent",
    eventId,
    "timestamp",
    event.block.timestamp.toString()
  );
});

test("can handle RemovedFromWhitelist event", () => {
  // Create mock events and functions
  let event = createMockRemovedFromWhitelist(accounts[0]);

  // call event handler
  handleRemovedFromWhitelist(event);

  // user entity tests
  assert.fieldEquals("User", accounts[0].toHex(), "id", accounts[0].toHex());
  assert.fieldEquals("User", accounts[0].toHex(), "isWhitelisted", "false");

  // whitelistContract entity tests
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "id",
    whitelistContractMockData.address.toHex()
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalUsers",
    "1"
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalWhitelistedUsers",
    "0"
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalEmployeeUsers",
    "1"
  );
  assert.fieldEquals(
    "WhitelistContract",
    whitelistContractMockData.address.toHex(),
    "totalWhitelistedEmployees",
    "0"
  );

  // UpdatedWhitelistAddressEvent entity tests
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  assert.fieldEquals("RemovedFromWhitelistEvent", eventId, "id", eventId);
  assert.fieldEquals(
    "RemovedFromWhitelistEvent",
    eventId,
    "user",
    event.params.account.toHex()
  );
  assert.fieldEquals(
    "RemovedFromWhitelistEvent",
    eventId,
    "timestamp",
    event.block.timestamp.toString()
  );
});
