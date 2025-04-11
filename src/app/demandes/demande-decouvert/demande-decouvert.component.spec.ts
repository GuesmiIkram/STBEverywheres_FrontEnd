import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeDecouvertComponent } from './demande-decouvert.component';

describe('DemandeDecouvertComponent', () => {
  let component: DemandeDecouvertComponent;
  let fixture: ComponentFixture<DemandeDecouvertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeDecouvertComponent]
    });
    fixture = TestBed.createComponent(DemandeDecouvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
