import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutDocDialog } from './ajout-doc-dialog';

describe('AjoutDocDialog', () => {
  let component: AjoutDocDialog;
  let fixture: ComponentFixture<AjoutDocDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutDocDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutDocDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
