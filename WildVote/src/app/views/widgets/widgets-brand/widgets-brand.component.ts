import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  styleUrls: ['./widgets-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WidgetsBrandComponent implements AfterContentInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() withCharts?: boolean;
  // @ts-ignore
 
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

  capStyle(value: string) {
    return !!value ? { '--cui-card-cap-bg': value } : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
