import { NewDestination } from "../../../../generated/OpolisPay/OpolisPay";
import { NewDestination as NewDestinationV3 } from "../../../../generated/OpolisPayV3/OpolisPayV3";
import {
  NewDestinationEvent,
  NewDestinationEventV3,
} from "../../../../generated/schema";

export function createNewDestinationEvent(event: NewDestination): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let dbEvent: NewDestinationEvent = new NewDestinationEvent(eventId);
  dbEvent.oldDestination = event.params.oldDestination;
  dbEvent.destination = event.params.destination;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}

export function createNewDestinationEventV3(event: NewDestinationV3): void {
  let eventId: string =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let opolisPayTokenId =
    event.address.toHex() + "-" + event.params.token.toHex();

  let dbEvent: NewDestinationEventV3 = new NewDestinationEventV3(eventId);
  dbEvent.token = opolisPayTokenId;
  dbEvent.oldDestination = event.params.oldDestination;
  dbEvent.destination = event.params.destination;
  dbEvent.timestamp = event.block.timestamp;
  dbEvent.save();
}
