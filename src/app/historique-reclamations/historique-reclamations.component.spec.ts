import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueReclamationsComponent } from './historique-reclamations.component';

describe('HistoriqueReclamationsComponent', () => {
  let component: HistoriqueReclamationsComponent;
  let fixture: ComponentFixture<HistoriqueReclamationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueReclamationsComponent]
    });
    fixture = TestBed.createComponent(HistoriqueReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
