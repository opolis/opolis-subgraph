import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import {
  NewDestination,
  NewTokens,
  SetupComplete,
} from "../../../../generated/OpolisPayV3/OpolisPayV3";
import { opolisPayMockData, stakingContractMockData } from "../../constants";
import { MockTokenData } from "../../token";

export function createSetupCompleteV3(
  admin: Address,
  helper: Address,
  ethLiquidation: Address,
  supportedTokens: MockTokenData[],
  liqDestinations: Address[]
): SetupComplete {
  let event: SetupComplete = changetype<SetupComplete>(newMockEvent());
  event.address = opolisPayMockData.address;
  event.parameters = new Array();

  let adminParam = new ethereum.EventParam(
    "admin",
    ethereum.Value.fromAddress(admin)
  );
  let helperParam = new ethereum.EventParam(
    "helper",
    ethereum.Value.fromAddress(helper)
  );
  let destinationParam = new ethereum.EventParam(
    "ethLiquidation",
    ethereum.Value.fromAddress(ethLiquidation)
  );
  let supportedTokensParam = new ethereum.EventParam(
    "supportedTokens",
    ethereum.Value.fromAddressArray(
      supportedTokens.map<Address>((x) => x.address)
    )
  );
  let liqDestinationsParam = new ethereum.EventParam(
    "liqDestinations",
    ethereum.Value.fromAddressArray(liqDestinations)
  );

  event.parameters.push(adminParam);
  event.parameters.push(helperParam);
  event.parameters.push(destinationParam);
  event.parameters.push(supportedTokensParam);
  event.parameters.push(liqDestinationsParam);

  return event;
}

export function createNewTokens(
  newTokens: MockTokenData[],
  newDestinations: Address[]
): NewTokens {
  let event: NewTokens = changetype<NewTokens>(newMockEvent());
  event.address = opolisPayMockData.address;
  event.parameters = new Array();

  let newTokensParam = new ethereum.EventParam(
    "newTokens",
    ethereum.Value.fromAddressArray(newTokens.map<Address>((x) => x.address))
  );
  let newDestinationsParam = new ethereum.EventParam(
    "newDestinations",
    ethereum.Value.fromAddressArray(newDestinations)
  );

  event.parameters.push(newTokensParam);
  event.parameters.push(newDestinationsParam);
  return event;
}

export function createNewDestination(
  oldDestination: Address,
  token: Address,
  destination: Address
): NewDestination {
  let event: NewDestination = changetype<NewDestination>(newMockEvent());
  event.address = opolisPayMockData.address;
  event.parameters = new Array();

  let oldDestinationParam = new ethereum.EventParam(
    "oldDestination",
    ethereum.Value.fromAddress(oldDestination)
  );
  let tokenParam = new ethereum.EventParam(
    "token",
    ethereum.Value.fromAddress(token)
  );
  let destinationParam = new ethereum.EventParam(
    "destination",
    ethereum.Value.fromAddress(destination)
  );

  event.parameters.push(oldDestinationParam);
  event.parameters.push(tokenParam);
  event.parameters.push(destinationParam);
  return event;
}
