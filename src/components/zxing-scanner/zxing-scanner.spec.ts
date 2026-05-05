import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZxingScanner } from './zxing-scanner';

describe('ZxingScanner', () => {
  let component: ZxingScanner;
  let fixture: ComponentFixture<ZxingScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZxingScanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZxingScanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
