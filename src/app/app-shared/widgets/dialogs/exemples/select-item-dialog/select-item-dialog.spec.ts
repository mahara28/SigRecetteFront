import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemDialog } from './select-item-dialog';

describe('SelectItemDialog', () => {
  let component: SelectItemDialog;
  let fixture: ComponentFixture<SelectItemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectItemDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectItemDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
