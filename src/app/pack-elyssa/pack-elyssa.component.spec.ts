import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackElyssaComponent } from './pack-elyssa.component';

describe('PackElyssaComponent', () => {
  let component: PackElyssaComponent;
  let fixture: ComponentFixture<PackElyssaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackElyssaComponent]
    });
    fixture = TestBed.createComponent(PackElyssaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
