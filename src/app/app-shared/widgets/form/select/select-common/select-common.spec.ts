import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommon } from './select-common';

describe('SelectCommon', () => {
  let component: SelectCommon;
  let fixture: ComponentFixture<SelectCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCommon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCommon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
