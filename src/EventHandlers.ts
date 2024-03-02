/*
 *Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features*
 */
import {
  ProtocolRewardsContract_Deposit_loader,
  ProtocolRewardsContract_Deposit_handler,
  ProtocolRewardsContract_EIP712DomainChanged_loader,
  ProtocolRewardsContract_EIP712DomainChanged_handler,
  ProtocolRewardsContract_RewardsDeposit_loader,
  ProtocolRewardsContract_RewardsDeposit_handlerAsync,
  ProtocolRewardsContract_Withdraw_loader,
  ProtocolRewardsContract_Withdraw_handler
} from '../generated/src/Handlers.gen';

import {
  ProtocolRewards_DepositEntity,
  ProtocolRewards_EIP712DomainChangedEntity,
  ProtocolRewards_RewardsDepositEntity,
  ProtocolRewards_WithdrawEntity,
  EventsSummaryEntity
} from '../generated/src/Types.gen';
import { getPayerFromTransaction } from './eth_getTransactionByHash';

export const GLOBAL_EVENTS_SUMMARY_KEY = 'GlobalEventsSummary';

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  protocolRewards_DepositCount: BigInt(0),
  protocolRewards_EIP712DomainChangedCount: BigInt(0),
  protocolRewards_RewardsDepositCount: BigInt(0),
  protocolRewards_WithdrawCount: BigInt(0)
};

ProtocolRewardsContract_Deposit_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ProtocolRewardsContract_Deposit_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    protocolRewards_DepositCount: currentSummaryEntity.protocolRewards_DepositCount + BigInt(1)
  };

  const protocolRewards_DepositEntity: ProtocolRewards_DepositEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    reason: event.params.reason,
    amount: event.params.amount,
    comment: event.params.comment,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProtocolRewards_Deposit.set(protocolRewards_DepositEntity);
});
ProtocolRewardsContract_EIP712DomainChanged_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ProtocolRewardsContract_EIP712DomainChanged_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    protocolRewards_EIP712DomainChangedCount:
      currentSummaryEntity.protocolRewards_EIP712DomainChangedCount + BigInt(1)
  };

  const protocolRewards_EIP712DomainChangedEntity: ProtocolRewards_EIP712DomainChangedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProtocolRewards_EIP712DomainChanged.set(protocolRewards_EIP712DomainChangedEntity);
});
ProtocolRewardsContract_RewardsDeposit_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ProtocolRewardsContract_RewardsDeposit_handlerAsync(async ({ event, context }) => {
  const summary = await context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);
  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;
  const buyer = await getPayerFromTransaction(event.transactionHash, event.chainId);
  const nextSummaryEntity = {
    ...currentSummaryEntity,
    protocolRewards_RewardsDepositCount:
      currentSummaryEntity.protocolRewards_RewardsDepositCount + BigInt(1)
  };

  const protocolRewards_RewardsDepositEntity: ProtocolRewards_RewardsDepositEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    creator: event.params.creator,
    createReferral: event.params.createReferral,
    mintReferral: event.params.mintReferral,
    firstMinter: event.params.firstMinter,
    zora: event.params.zora,
    from: event.params.from,
    creatorReward: event.params.creatorReward,
    createReferralReward: event.params.createReferralReward,
    mintReferralReward: event.params.mintReferralReward,
    firstMinterReward: event.params.firstMinterReward,
    zoraReward: event.params.zoraReward,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY,
    chainId: event.chainId as any as bigint,
    timestamp: event.blockTimestamp as any as bigint,
    transactionHash: event.transactionHash,
    buyer: buyer
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProtocolRewards_RewardsDeposit.set(protocolRewards_RewardsDepositEntity);
});
ProtocolRewardsContract_Withdraw_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

ProtocolRewardsContract_Withdraw_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    protocolRewards_WithdrawCount: currentSummaryEntity.protocolRewards_WithdrawCount + BigInt(1)
  };

  const protocolRewards_WithdrawEntity: ProtocolRewards_WithdrawEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    from: event.params.from,
    to: event.params.to,
    amount: event.params.amount,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.ProtocolRewards_Withdraw.set(protocolRewards_WithdrawEntity);
});
