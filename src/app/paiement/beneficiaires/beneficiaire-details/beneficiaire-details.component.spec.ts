import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaireDetailsComponent } from './beneficiaire-details.component';

describe('BeneficiaireDetailsComponent', () => {
  let component: BeneficiaireDetailsComponent;
  let fixture: ComponentFixture<BeneficiaireDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaireDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaireDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
