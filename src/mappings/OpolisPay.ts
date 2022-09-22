import { BigInt } from "@graphprotocol/graph-ts";
import {
  NewAdmin,
  NewDestination,
  NewHelper,
  NewTokens,
  OpsPayrollWithdraw,
  OpsStakeWithdraw,
  Paid,
  SetupComplete,
  Staked,
  Sweep
} from "../../generated/OpolisPay/OpolisPay";
import {
  Staked as StakedV2,
  OpsStakeWithdraw as OpsStakeWithdrawV2
} from "../../generated/OpolisPayV2/OpolisPayV2";
import {
  addTokens,
  createOpolisPayContract,
  updateAdmin,
  updateDestination,
  updateHelper
} from "../entities/contracts/OpolisPayContract";
import { createNewAdminEvent } from "../entities/events/OpolisPay/NewAdminEvent";
import { createNewDestinationEvent } from "../entities/events/OpolisPay/NewDestinationEvent";
import { createNewHelperEvent } from "../entities/events/OpolisPay/NewHelperEvent";
import { createNewTokensEvent } from "../entities/events/OpolisPay/NewTokensEvent";
import { createOpsPayrollWithdrawEvent } from "../entities/events/OpolisPay/OpsPayrollWithdrawEvent";
import {
  createOpsStakeWithdrawEvent,
  createOpsStakeWithdrawEventV2
} from "../entities/events/OpolisPay/OpsStakeWithdrawEvent";
import { createPaidEvent } from "../entities/events/OpolisPay/PaidEvent";
import { createSetupCompleteEvent } from "../entities/events/OpolisPay/SetupCompleteEvent";
import {
  createStakedEvent,
  createStakedEventV2
} from "../entities/events/OpolisPay/StakedEvent";
import { createSweepEvent } from "../entities/events/OpolisPay/SweepEvent";
import { createStake, withdrawStake } from "../entities/OpolisPayStake";
import { createPayroll, withdrawPayroll } from "../entities/Payroll";

export function handleSetupCompleteV1(event: SetupComplete): void {
  createOpolisPayContract(
    event.address,
    event.params.destination,
    event.params.admin,
    event.params.helper,
    event.params.tokens,
    event.block.timestamp,
    1
  );

  createSetupCompleteEvent(event);
}

export function handleSetupCompleteV2(event: SetupComplete): void {
  createOpolisPayContract(
    event.address,
    event.params.destination,
    event.params.admin,
    event.params.helper,
    event.params.tokens,
    event.block.timestamp,
    2
  );

  createSetupCompleteEvent(event);
}

export function handleStaked(event: Staked): void {
  createStake(
    event.params.memberId,
    event.params.token,
    event.params.amount,
    event.params.staker,
    BigInt.fromI32(1),
    event.block.timestamp,
    event.transaction.value,
    event.transaction.hash,
    event.address
  );
  createStakedEvent(event);
}

export function handleStakedV2(event: StakedV2): void {
  createStake(
    event.params.memberId,
    event.params.token,
    event.params.amount,
    event.params.staker,
    event.params.stakeNumber,
    event.block.timestamp,
    event.transaction.value,
    event.transaction.hash,
    event.address
  );
  createStakedEventV2(event);
}

export function handlePaid(event: Paid): void {
  createPayroll(
    event.params.payrollId,
    event.params.token,
    event.params.amount,
    event.params.payor,
    event.block.timestamp,
    event.transaction.hash,
    event.address
  );
  createPaidEvent(event);
}

export function handleOpsPayrollWithdraw(event: OpsPayrollWithdraw): void {
  withdrawPayroll(event.params.payrollId, event.params.amount, event.block.timestamp, event.address);
  createOpsPayrollWithdrawEvent(event);
}

export function handleOpsStakeWithdraw(event: OpsStakeWithdraw): void {
  withdrawStake(
    event.params.stakeId,
    BigInt.fromI32(1),
    event.block.timestamp,
    event.address
  );
  createOpsStakeWithdrawEvent(event);
}

export function handleOpsStakeWithdrawV2(event: OpsStakeWithdrawV2): void {
  withdrawStake(
    event.params.stakeId,
    event.params.stakeNumber,
    event.block.timestamp,
    event.address
  );
  createOpsStakeWithdrawEventV2(event);
}

export function handleSweep(event: Sweep): void {
  createSweepEvent(event);
}

export function handleNewDestination(event: NewDestination): void {
  updateDestination(event.address, event.params.destination);
  createNewDestinationEvent(event);
}

export function handleNewAdmin(event: NewAdmin): void {
  updateAdmin(event.address, event.params.opolisAdmin);
  createNewAdminEvent(event);
}

export function handleNewHelper(event: NewHelper): void {
  updateHelper(event.address, event.params.newHelper);
  createNewHelperEvent(event);
}

export function handleNewTokens(event: NewTokens): void {
  addTokens(event.address, event.params.newTokens);
  createNewTokensEvent(event);
}
