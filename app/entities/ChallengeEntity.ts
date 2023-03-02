export default interface ChallengeEntity {
  readonly id: string;
  readonly createdTimestamp: string;
  readonly creator: string;
  readonly duration: string;
  readonly hashtag: string;
  readonly handle: string;
  readonly description: string;
  readonly prize: string;
  readonly deadline: string;
  readonly isFinalized: boolean;
  readonly participantsNumber: number;
}
