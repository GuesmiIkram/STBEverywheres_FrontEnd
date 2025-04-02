import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecouvertComponent } from './decouvert.component';

describe('DecouvertComponent', () => {
  let component: DecouvertComponent;
  let fixture: ComponentFixture<DecouvertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecouvertComponent]
    });
    fixture = TestBed.createComponent(DecouvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
