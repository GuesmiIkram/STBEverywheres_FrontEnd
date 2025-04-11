import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequiersComponent } from './chequiers.component';

describe('ChequiersComponent', () => {
  let component: ChequiersComponent;
  let fixture: ComponentFixture<ChequiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequiersComponent]
    });
    fixture = TestBed.createComponent(ChequiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
