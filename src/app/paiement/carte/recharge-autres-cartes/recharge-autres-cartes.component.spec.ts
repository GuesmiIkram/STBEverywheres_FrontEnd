import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeAutresCartesComponent } from './recharge-autres-cartes.component';

describe('RechargeAutresCartesComponent', () => {
  let component: RechargeAutresCartesComponent;
  let fixture: ComponentFixture<RechargeAutresCartesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RechargeAutresCartesComponent]
    });
    fixture = TestBed.createComponent(RechargeAutresCartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
