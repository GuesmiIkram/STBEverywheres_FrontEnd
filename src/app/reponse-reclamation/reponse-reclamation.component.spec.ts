import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseReclamationComponent } from './reponse-reclamation.component';

describe('ReponseReclamationComponent', () => {
  let component: ReponseReclamationComponent;
  let fixture: ComponentFixture<ReponseReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReponseReclamationComponent]
    });
    fixture = TestBed.createComponent(ReponseReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
