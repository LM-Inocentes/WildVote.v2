import { Schema, model } from 'mongoose';

export interface ICandidate{
    id: string;
    Department: string;
    Year: string;
    Fullname: string;
    PartyList: string;
    Position: string;
    Profile: string;
    Votes: number;
   // ReferenceFingerPrint: string;  
}

export const CandidateSchema = new Schema<ICandidate>(
    {
        id: { type: String, required:true },
        Fullname: { type: String, required:true },
        Department: { type: String, required:true },
        PartyList: { type: String, required:true },
        Position: { type: String, required:true },
        Profile: { type: String, required:true },
        Votes: { type: Number, required:true },
    },{
        toJSON:{
            virtuals:true
        },
        toObject:{
            virtuals:true
        },
        timestamps:true
    }
)

export const CandidateModel = model<ICandidate>('WildVote-Candidates', CandidateSchema);