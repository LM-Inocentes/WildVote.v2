import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateComponent } from './manage-candidate.component';

describe('ManageCandidateComponent', () => {
  let component: ManageCandidateComponent;
  let fixture: ComponentFixture<ManageCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCandidateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
