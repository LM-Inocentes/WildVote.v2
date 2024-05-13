import { Schema, model } from 'mongoose';

export interface IUser{
    id: string;
    Fullname: string;
    isAdmin: boolean;
    Department: string;
    Year: string;
    password: string;
    Voted: boolean; 
    FingerprintIndex: number;
    FingerprintAuth: boolean;
    FingerprintRegistered: boolean;
   // ReferenceFingerPrint: string;  
}

export const UserSchema = new Schema<IUser>(
    {
        id: { type: String, required:true },
        Fullname: { type: String, required:true },
        isAdmin: { type: Boolean, required:true },
        Department: { type: String, required:true },
        Year: { type: String, required:true },
        password: { type: String, required:true },
        Voted: { type: Boolean, required:true },
        FingerprintIndex: { type: Number, required:true },
        FingerprintAuth: { type: Boolean, required:true },
        FingerprintRegistered: { type: Boolean, required:true },
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

export const UserModel = model<IUser>('WildVote-Users', UserSchema);