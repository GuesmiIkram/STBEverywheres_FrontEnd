import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandePlafondComponent } from './demande-plafond.component';

describe('DemandePlafondComponent', () => {
  let component: DemandePlafondComponent;
  let fixture: ComponentFixture<DemandePlafondComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandePlafondComponent]
    });
    fixture = TestBed.createComponent(DemandePlafondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
