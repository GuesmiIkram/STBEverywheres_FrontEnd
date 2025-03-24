import { ComponentFixture, TestBed } from '@angular/core/testing';

import {InitierVirementUnitaireAutreBenefComponent } from './initier-virement-unitaire-autre-benef.component';

describe('InitierVirementComponent', () => {
  let component: InitierVirementUnitaireAutreBenefComponent;
  let fixture: ComponentFixture<InitierVirementUnitaireAutreBenefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitierVirementUnitaireAutreBenefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitierVirementUnitaireAutreBenefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
