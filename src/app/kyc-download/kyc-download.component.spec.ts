import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDownloadComponent } from './kyc-download.component';

describe('KycDownloadComponent', () => {
  let component: KycDownloadComponent;
  let fixture: ComponentFixture<KycDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KycDownloadComponent]
    });
    fixture = TestBed.createComponent(KycDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
