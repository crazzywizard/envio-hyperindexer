import {
  SoundCreatorV2Contract_SoundEditionCreated_loader,
  SoundCreatorV2Contract_SoundEditionCreated_handler
} from '../generated/src/Handlers.gen';
import { GLOBAL_EVENTS_SUMMARY_KEY } from './EventHandlers';
import { EventsSummaryEntity, SoundCreatorV2_SoundEditionCreatedEntity } from './src/Types.gen';

const INITIAL_EVENTS_SUMMARY: EventsSummaryEntity = {
  id: GLOBAL_EVENTS_SUMMARY_KEY,
  soundCreatorV2_SoundEditionCreatedCount: BigInt(0),
  soundEdition_MintedCount: BigInt(0),
  protocolRewards_EIP712DomainChangedCount: BigInt(0),
  protocolRewards_RewardsDepositCount: BigInt(0),
  protocolRewards_DepositCount: BigInt(0),
  protocolRewards_WithdrawCount: BigInt(0)
};
SoundCreatorV2Contract_SoundEditionCreated_loader(({ event, context }) => {
  context.EventsSummary.load(GLOBAL_EVENTS_SUMMARY_KEY);
  for (let i = 0; i < event.params.contracts.length; i++) {
    context.contractRegistration.addSoundEdition(event.params.contracts[i]);
  }
});

SoundCreatorV2Contract_SoundEditionCreated_handler(({ event, context }) => {
  const summary = context.EventsSummary.get(GLOBAL_EVENTS_SUMMARY_KEY);

  const currentSummaryEntity: EventsSummaryEntity = summary ?? INITIAL_EVENTS_SUMMARY;

  const nextSummaryEntity = {
    ...currentSummaryEntity,
    soundCreatorV2_SoundEditionCreatedCount:
      currentSummaryEntity.soundCreatorV2_SoundEditionCreatedCount + BigInt(1)
  };

  const soundCreatorV2_SoundEditionCreatedEntity: SoundCreatorV2_SoundEditionCreatedEntity = {
    id: event.transactionHash + event.logIndex.toString(),
    contracts: event.params.contracts,
    initData: event.params.initData,
    data: event.params.data,
    deployer: event.params.deployer,
    results: event.params.results,
    soundEdition: event.params.soundEdition,
    eventsSummary: GLOBAL_EVENTS_SUMMARY_KEY
  };

  context.EventsSummary.set(nextSummaryEntity);
  context.SoundCreatorV2_SoundEditionCreated.set(soundCreatorV2_SoundEditionCreatedEntity);
});
