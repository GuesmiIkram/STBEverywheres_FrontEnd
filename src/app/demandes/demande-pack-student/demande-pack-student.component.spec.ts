import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePackStudentComponent } from './demande-pack-student.component';

describe('DemandePackStudentComponent', () => {
  let component: DemandePackStudentComponent;
  let fixture: ComponentFixture<DemandePackStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandePackStudentComponent]
    });
    fixture = TestBed.createComponent(DemandePackStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
