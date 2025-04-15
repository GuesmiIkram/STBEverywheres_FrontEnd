import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeCarteComponent } from './demande-carte.component';

describe('DemandeCarteComponent', () => {
  let component: DemandeCarteComponent;
  let fixture: ComponentFixture<DemandeCarteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeCarteComponent]
    });
    fixture = TestBed.createComponent(DemandeCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
