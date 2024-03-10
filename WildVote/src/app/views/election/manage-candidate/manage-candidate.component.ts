import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/shared/models/Candidate';


@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrl: './manage-candidate.component.scss'
})
export class ManageCandidateComponent implements OnInit{
  candidates!: Candidate[];
  public liveDemoVisible = false;

  brandData = [
    {
      imageUrl: 'https://res.cloudinary.com/de4dinse3/image/upload/v1710065500/Candidates/AUDITOR/22-2222-222.png',
      icon: '',
      values: [{ title: 'EZ Partylist ', value: 'LM Inocentes' }],
      capBg: { '--cui-card-cap-bg': '#3b5998' },
      color: 'warning',
    },
   
    {
      icon: 'cib-linkedin',
      values: [{ title: 'contacts', value: '500' }, { title: 'feeds', value: '1.292' }],
      capBg: { '--cui-card-cap-bg': '#4875b4' },

    },
    {
      icon: 'cilCalendar',
      values: [{ title: 'events', value: '12+' }, { title: 'meetings', value: '4' }],
      color: 'warning',

    }
  ];


  constructor(private candidateService: CandidatesService,) { }

  ngOnInit(): void {
    this.candidateService.getCandidates().subscribe((candidates) => {
      this.candidates = candidates;
      this.sortCandidatesByPosition();
    });
  }

  sortCandidatesByPosition(): void {
    const customOrder = [
      "PRESIDENT",
      "VICE-PRESIDENT",
      "SECRETARY",
      "TREASURER",
      "AUDITOR",
      "ARCH REPRESENTATIVE",
      "CHE REPRESENTATIVE",
      "CE REPRESENTATIVE",
      "CPE REPRESENTATIVE",
      "EE REPRESENTATIVE",
      "ECE REPRESENTATIVE",
      "IE REPRESENTATIVE",
      "ME REPRESENTATIVE",
      "EM REPRESENTATIVE",
      "CS REPRESENTATIVE",
      "IT REPRESENTATIVE",
      "CNAHS REPRESENTATIVE",
      "CMBA REPRESENTATIVE",
      "CASE REPRESENTATIVE",
      "CCJ REPRESENTATIVE",
    ];

    this.candidates.sort((a, b) => {
      const indexA = customOrder.indexOf(a.Position);
      const indexB = customOrder.indexOf(b.Position);
      return indexA - indexB;
    });
  }

  removeCandidate(id:string){
    this.candidateService.deleteCandidateByID(id).subscribe(_ => {
      this.ngOnInit();
    });
  }

  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }


}
