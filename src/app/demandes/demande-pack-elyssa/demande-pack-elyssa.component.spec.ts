import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePackElyssaComponent } from './demande-pack-elyssa.component';

describe('DemandePackElyssaComponent', () => {
  let component: DemandePackElyssaComponent;
  let fixture: ComponentFixture<DemandePackElyssaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandePackElyssaComponent]
    });
    fixture = TestBed.createComponent(DemandePackElyssaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
