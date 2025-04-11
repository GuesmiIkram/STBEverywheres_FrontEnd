import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviDemandechequiersComponent } from './suivi-demandechequiers.component';

describe('SuiviDemandechequiersComponent', () => {
  let component: SuiviDemandechequiersComponent;
  let fixture: ComponentFixture<SuiviDemandechequiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuiviDemandechequiersComponent]
    });
    fixture = TestBed.createComponent(SuiviDemandechequiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
