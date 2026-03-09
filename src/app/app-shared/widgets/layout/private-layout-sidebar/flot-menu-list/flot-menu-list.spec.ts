import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotMenuList } from './flot-menu-list';

describe('FlotMenuList', () => {
  let component: FlotMenuList;
  let fixture: ComponentFixture<FlotMenuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlotMenuList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlotMenuList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
