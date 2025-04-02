import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackStudentComponent } from './pack-student.component';

describe('PackStudentComponent', () => {
  let component: PackStudentComponent;
  let fixture: ComponentFixture<PackStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackStudentComponent]
    });
    fixture = TestBed.createComponent(PackStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
