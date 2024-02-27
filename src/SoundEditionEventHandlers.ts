import {
  SoundEditionContract_Minted_loader,
  SoundEditionContract_Minted_handler
} from '../generated/src/Handlers.gen';

import { GLOBAL_EVENTS_SUMMARY_KEY } from './EventHandlers';
import { EventsSummaryEntity, SoundEdition_MintedEntity } from './src/Types.gen';

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  soundCreatorV2_SoundEditionCreatedCount: BigInt(0),
  soundEdition_MintedCount: BigInt(0),
  protocolRewards_EIP712DomainChangedCount: BigInt(0),
  protocolRewards_RewardsDepositCount: BigInt(0),
  protocolRewards_DepositCount: BigInt(0),
  protocolRewards_WithdrawCount: BigInt(0)
};
SoundEditionContract_Minted_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
});

SoundEditionContract_Minted_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    soundEdition_MintedCount: currentSummaryEntity.soundEdition_MintedCount + BigInt(1)
  };

  const soundEdition_MintedEntity: SoundEdition_MintedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    to: event.params.to,
    quantity: event.params.quantity,
    fromTokenId: event.params.fromTokenId,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SoundEdition_Minted.set(soundEdition_MintedEntity);
});
