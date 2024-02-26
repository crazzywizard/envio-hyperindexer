import assert = require("assert")
import { MockDb, ProtocolRewards } from "../generated/src/TestHelpers.gen";
import {
  EventsSummaryEntity,
  ProtocolRewards_DepositEntity,
} from "../generated/src/Types.gen";

import { Addresses } from "../generated/src/bindings/Ethers.bs";

import { GLOBAL_EVENTS_SUMMARY_KEY } from "../src/EventHandlers";


const MOCK_EVENTS_SUMMARY_ENTITY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  protocolRewards_DepositCount: BigInt(0),
  protocolRewards_EIP712DomainChangedCount: BigInt(0),
  protocolRewards_RewardsDepositCount: BigInt(0),
  protocolRewards_WithdrawCount: BigInt(0),
};

describe("ProtocolRewards contract Deposit event tests", () => {
  // Create mock db
  const mockDbInitial = MockDb.createMockDb();

  // Add mock EventsSummaryEntity to mock db
  const mockDbFinal = mockDbInitial.entities.EventsSummary.set(
    MOCK_EVENTS_SUMMARY_ENTITY
  );

  // Creating mock ProtocolRewards contract Deposit event
  const mockProtocolRewardsDepositEvent = ProtocolRewards.Deposit.createMockEvent({
    from: Addresses.defaultAddress,
    to: Addresses.defaultAddress,
    reason: "foo",
    amount: 0n,
    comment: "foo",
    mockEventData: {
      chainId: 1,
      blockNumber: 0,
      blockTimestamp: 0,
      blockHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      srcAddress: Addresses.defaultAddress,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      transactionIndex: 0,
      logIndex: 0,
    },
  });

  // Processing the event
  const mockDbUpdated = ProtocolRewards.Deposit.processEvent({
    event: mockProtocolRewardsDepositEvent,
    mockDb: mockDbFinal,
  });

  it("ProtocolRewards_DepositEntity is created correctly", () => {
    // Getting the actual entity from the mock database
    let actualProtocolRewardsDepositEntity = mockDbUpdated.entities.ProtocolRewards_Deposit.get(
      mockProtocolRewardsDepositEvent.transactionHash +
        mockProtocolRewardsDepositEvent.logIndex.toString()
    );

    // Creating the expected entity
    const expectedProtocolRewardsDepositEntity: ProtocolRewards_DepositEntity = {
      id:
        mockProtocolRewardsDepositEvent.transactionHash +
        mockProtocolRewardsDepositEvent.logIndex.toString(),
      from: mockProtocolRewardsDepositEvent.params.from,
      to: mockProtocolRewardsDepositEvent.params.to,
      reason: mockProtocolRewardsDepositEvent.params.reason,
      amount: mockProtocolRewardsDepositEvent.params.amount,
      comment: mockProtocolRewardsDepositEvent.params.comment,
      eventsSummary: "GlobalEventsSummary",
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualProtocolRewardsDepositEntity, expectedProtocolRewardsDepositEntity, "Actual ProtocolRewardsDepositEntity should be the same as the expectedProtocolRewardsDepositEntity");
  });

  it("EventsSummaryEntity is updated correctly", () => {
    // Getting the actual entity from the mock database
    let actualEventsSummaryEntity = mockDbUpdated.entities.EventsSummary.get(
      GLOBAL_EVENTS_SUMMARY_KEY
    );

    // Creating the expected entity
    const expectedEventsSummaryEntity: EventsSummaryEntity = {
      ...MOCK_EVENTS_SUMMARY_ENTITY,
      protocolRewards_DepositCount: MOCK_EVENTS_SUMMARY_ENTITY.protocolRewards_DepositCount + BigInt(1),
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualEventsSummaryEntity, expectedEventsSummaryEntity, "Actual ProtocolRewardsDepositEntity should be the same as the expectedProtocolRewardsDepositEntity");
  });
});
