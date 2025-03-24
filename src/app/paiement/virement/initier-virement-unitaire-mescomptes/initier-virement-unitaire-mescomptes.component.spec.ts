import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitierVirementUnitaireMesComptesComponent } from './initier-virement-unitaire-mesComptes.component';

describe('InitierVirementUnitaireMesComptesComponent', () => {
  let component: InitierVirementUnitaireMesComptesComponent;
  let fixture: ComponentFixture<InitierVirementUnitaireMesComptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitierVirementUnitaireMesComptesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitierVirementUnitaireMesComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
