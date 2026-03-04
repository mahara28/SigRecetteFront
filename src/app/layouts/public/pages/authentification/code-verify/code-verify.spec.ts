import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeVerify } from './code-verify';

describe('CodeVerify', () => {
  let component: CodeVerify;
  let fixture: ComponentFixture<CodeVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeVerify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeVerify);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
