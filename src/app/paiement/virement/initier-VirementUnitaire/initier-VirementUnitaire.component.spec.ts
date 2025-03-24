import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitierVirementUnitaireComponent } from './initier-VirementUnitaire.component';

describe('InitierVirementComponent', () => {
  let component: InitierVirementUnitaireComponent;
  let fixture: ComponentFixture<InitierVirementUnitaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitierVirementUnitaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitierVirementUnitaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
