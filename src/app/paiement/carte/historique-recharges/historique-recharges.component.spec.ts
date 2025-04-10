import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueRechargesComponent } from './historique-recharges.component';

describe('HistoriqueRechargesComponent', () => {
  let component: HistoriqueRechargesComponent;
  let fixture: ComponentFixture<HistoriqueRechargesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueRechargesComponent]
    });
    fixture = TestBed.createComponent(HistoriqueRechargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
