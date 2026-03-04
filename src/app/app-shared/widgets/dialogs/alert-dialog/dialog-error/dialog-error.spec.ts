import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogError } from './dialog-error';

describe('DialogError', () => {
  let component: DialogError;
  let fixture: ComponentFixture<DialogError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
