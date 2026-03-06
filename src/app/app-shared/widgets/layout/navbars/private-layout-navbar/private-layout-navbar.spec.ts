import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateLayoutNavbar } from './private-layout-navbar';

describe('PrivateLayoutNavbar', () => {
  let component: PrivateLayoutNavbar;
  let fixture: ComponentFixture<PrivateLayoutNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateLayoutNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateLayoutNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
