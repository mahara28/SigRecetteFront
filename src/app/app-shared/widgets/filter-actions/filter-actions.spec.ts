import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterActions } from './filter-actions';

describe('FilterActions', () => {
  let component: FilterActions;
  let fixture: ComponentFixture<FilterActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
