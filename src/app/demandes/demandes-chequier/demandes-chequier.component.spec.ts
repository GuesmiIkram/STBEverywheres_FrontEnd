import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesChequierComponent } from './demandes-chequier.component';

describe('DemandesChequierComponent', () => {
  let component: DemandesChequierComponent;
  let fixture: ComponentFixture<DemandesChequierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandesChequierComponent]
    });
    fixture = TestBed.createComponent(DemandesChequierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
