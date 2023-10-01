import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressDialogComponent } from './adress-dialog.component';

describe('AdressDialogComponent', () => {
  let component: AdressDialogComponent;
  let fixture: ComponentFixture<AdressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
