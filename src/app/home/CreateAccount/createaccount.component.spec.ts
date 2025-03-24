import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateaccountComponent  } from './createaccount.component';

describe('DashboardComponent', () => {
  let component: CreateaccountComponent ;
  let fixture: ComponentFixture<CreateaccountComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateaccountComponent  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateaccountComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
