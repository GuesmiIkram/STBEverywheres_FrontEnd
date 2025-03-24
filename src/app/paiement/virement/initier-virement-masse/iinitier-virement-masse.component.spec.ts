import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitierVirementMasseComponent } from './initier-virement-masse.component';

describe('InitierVirementComponent', () => {
  let component: InitierVirementMasseComponent;
  let fixture: ComponentFixture<InitierVirementMasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitierVirementMasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitierVirementMasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
