import { Schema, model } from 'mongoose';

export interface IElectionStatus {
    isElectionStart: boolean;
}

export const electionStatusSchema = new Schema<IElectionStatus>({
    isElectionStart: {
      type: Boolean,
      required: true,
      default: false // Default value for isElectionStart is false
    }
  });

export const ElectionModel = model<IElectionStatus>('wildvote-election_manage', electionStatusSchema);