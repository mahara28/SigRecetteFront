import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoolean } from './select-boolean';

describe('SelectBoolean', () => {
  let component: SelectBoolean;
  let fixture: ComponentFixture<SelectBoolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBoolean]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectBoolean);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
