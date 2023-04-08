import { Bytes } from "@graphprotocol/graph-ts";
import { NewTokens } from "../../../../generated/OpolisPay/OpolisPay";
import { NewTokens as NewTokensV3 } from "../../../../generated/OpolisPayV3/OpolisPayV3";
import { NewTokensEvent } from "../../../../generated/schema";

export function createNewTokensEvent(event: NewTokens): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: NewTokensEvent = new NewTokensEvent(eventId);
  dbEvent.newTokens = event.params.newTokens.map<Bytes>(
    token => token as Bytes
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}

export function createNewTokensEventV3(event: NewTokensV3): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: NewTokensEvent = new NewTokensEvent(eventId);
  dbEvent.newTokens = event.params.newTokens.map<Bytes>(
    token => token as Bytes
  );
  dbEvent.newDestinations = event.params.newDestinations.map<Bytes>(
    destination => destination as Bytes
  );
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
