import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateLayoutSidebar } from './private-layout-sidebar';

describe('PrivateLayoutSidebar', () => {
  let component: PrivateLayoutSidebar;
  let fixture: ComponentFixture<PrivateLayoutSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateLayoutSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateLayoutSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
