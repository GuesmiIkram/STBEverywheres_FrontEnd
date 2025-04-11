import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListechequiersComponent } from './liste-chequiers.component';

describe('ListeDemandechequiersComponent', () => {
  let component: ListechequiersComponent;
  let fixture: ComponentFixture<ListechequiersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListechequiersComponent]
    });
    fixture = TestBed.createComponent(ListechequiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
