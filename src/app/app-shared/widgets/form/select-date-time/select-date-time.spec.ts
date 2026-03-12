import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDateTime } from './select-date-time';

describe('SelectDateTime', () => {
  let component: SelectDateTime;
  let fixture: ComponentFixture<SelectDateTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDateTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDateTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
