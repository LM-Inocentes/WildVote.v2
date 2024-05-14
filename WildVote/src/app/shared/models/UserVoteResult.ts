class Candidate {
    id?: string;
    Fullname?: string;
    PartyList?: string;
    color?: string;
    Profile?: string
  }
  
  // Define the UserVoteResult class
  export class UserVoteResult {
    President?: Candidate; 
    VicePresident?: Candidate;
    Secretary?: Candidate;
    Treasurer?: Candidate;
    Auditor?: Candidate;
    CPERepresentative?: Candidate;   
    id!: string;
  }