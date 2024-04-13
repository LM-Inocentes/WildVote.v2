import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingSystemComponent } from './voting-system.component';

describe('VotingSystemComponent', () => {
  let component: VotingSystemComponent;
  let fixture: ComponentFixture<VotingSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VotingSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
