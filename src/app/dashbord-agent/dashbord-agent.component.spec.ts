import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordAgentComponent } from './dashbord-agent.component';

describe('DashbordAgentComponent', () => {
  let component: DashbordAgentComponent;
  let fixture: ComponentFixture<DashbordAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashbordAgentComponent]
    });
    fixture = TestBed.createComponent(DashbordAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
