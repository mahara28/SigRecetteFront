import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateLayoutFooter } from './private-layout-footer';

describe('PrivateLayoutFooter', () => {
  let component: PrivateLayoutFooter;
  let fixture: ComponentFixture<PrivateLayoutFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateLayoutFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateLayoutFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
