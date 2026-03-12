import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDate } from './select-date';

describe('SelectDate', () => {
  let component: SelectDate;
  let fixture: ComponentFixture<SelectDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
