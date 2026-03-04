import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogLogout } from './confirm-dialog-logout';

describe('ConfirmDialogLogout', () => {
  let component: ConfirmDialogLogout;
  let fixture: ComponentFixture<ConfirmDialogLogout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogLogout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogLogout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
