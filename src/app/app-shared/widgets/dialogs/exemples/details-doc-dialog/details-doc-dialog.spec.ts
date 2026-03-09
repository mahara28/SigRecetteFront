import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDocDialog } from './details-doc-dialog';

describe('DetailsDocDialog', () => {
  let component: DetailsDocDialog;
  let fixture: ComponentFixture<DetailsDocDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsDocDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDocDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
