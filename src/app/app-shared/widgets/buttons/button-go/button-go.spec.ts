import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGo } from './button-go';

describe('ButtonGo', () => {
  let component: ButtonGo;
  let fixture: ComponentFixture<ButtonGo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
