import { Schema, model } from 'mongoose';

// Define interface for the `Candidate` data structure
interface Candidate {
  id: string;
  Fullname: string;
  PartyList: string;
  color: string;
  Profile: string;
}

// Define interface for the `IUserVote` data structure
export interface IUserVote {
  President: Candidate;
  VicePresident: Candidate;
  Secretary: Candidate;
  Treasurer: Candidate;
  Auditor: Candidate;
  CPERepresentative: Candidate;
  id: string;
}

// Define Mongoose schema for `IUserVote`
const UserVoteSchema = new Schema<IUserVote>(
  {
    id: { type: String, required: true },
    President: { type: Object, required: true },
    VicePresident: { type: Object, required: true },
    Secretary: { type: Object, required: true },
    Treasurer: { type: Object, required: true },
    Auditor: { type: Object, required: true },
    CPERepresentative: { type: Object, required: true },
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    timestamps: true
  }
);

// Define and export UserVote model
export const UserVoteModel = model<IUserVote>('WildVote-Users-vote', UserVoteSchema);