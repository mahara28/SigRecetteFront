import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAppLanguage } from './select-app-language';

describe('SelectAppLanguage', () => {
  let component: SelectAppLanguage;
  let fixture: ComponentFixture<SelectAppLanguage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAppLanguage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAppLanguage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
