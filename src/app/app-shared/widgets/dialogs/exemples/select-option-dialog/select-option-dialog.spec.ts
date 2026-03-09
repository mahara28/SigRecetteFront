import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptionDialog } from './select-option-dialog';

describe('SelectOptionDialog', () => {
  let component: SelectOptionDialog;
  let fixture: ComponentFixture<SelectOptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOptionDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOptionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
