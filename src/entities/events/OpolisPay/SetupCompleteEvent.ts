import { Bytes } from "@graphprotocol/graph-ts";
import { SetupComplete } from "../../../../generated/OpolisPay/OpolisPay";
import { SetupComplete as SetupCompleteV3 } from "../../../../generated/OpolisPayV3/OpolisPayV3";
import { SetupCompleteEvent, SetupCompleteEventV3 } from "../../../../generated/schema";

export function createSetupCompleteEvent(event: SetupComplete): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: SetupCompleteEvent = new SetupCompleteEvent(eventId);
  dbEvent.admin = event.params.admin;
  dbEvent.destination = event.params.destination;
  dbEvent.helper = event.params.helper;
  dbEvent.supportedTokens = event.params.tokens.map<Bytes>(
    token => token as Bytes
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}

export function createSetupCompleteEventV3(event: SetupCompleteV3): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: SetupCompleteEventV3 = new SetupCompleteEventV3(eventId);
  dbEvent.ethLiquidation = event.params.ethLiquidation;
  dbEvent.admin = event.params.admin;
  dbEvent.helper = event.params.helper;
  dbEvent.supportedTokens = event.params.tokens.map<Bytes>(
    token => token as Bytes
  );
  dbEvent.liqDestinations = event.params.liqDestinations.map<Bytes>(
    destination => destination as Bytes
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
