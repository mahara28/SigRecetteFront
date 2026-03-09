import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatMenuList } from './flat-menu-list';

describe('FlatMenuList', () => {
  let component: FlatMenuList;
  let fixture: ComponentFixture<FlatMenuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatMenuList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatMenuList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
