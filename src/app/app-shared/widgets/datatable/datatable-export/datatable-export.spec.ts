import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableExport } from './datatable-export';

describe('DatatableExport', () => {
  let component: DatatableExport;
  let fixture: ComponentFixture<DatatableExport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatatableExport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatatableExport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
