import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheDetails } from './fiche-details';

describe('FicheDetails', () => {
  let component: FicheDetails;
  let fixture: ComponentFixture<FicheDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FicheDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
