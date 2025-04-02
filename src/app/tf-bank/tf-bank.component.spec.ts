import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TFBankComponent } from './tf-bank.component';

describe('TFBankComponent', () => {
  let component: TFBankComponent;
  let fixture: ComponentFixture<TFBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TFBankComponent]
    });
    fixture = TestBed.createComponent(TFBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
