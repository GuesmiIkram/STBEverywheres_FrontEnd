import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeMesCartesComponent } from './recharge-mes-cartes.component';

describe('RechargeMesCartesComponent', () => {
  let component: RechargeMesCartesComponent;
  let fixture: ComponentFixture<RechargeMesCartesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechargeMesCartesComponent]
    });
    fixture = TestBed.createComponent(RechargeMesCartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
