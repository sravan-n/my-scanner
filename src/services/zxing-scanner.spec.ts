import { TestBed } from '@angular/core/testing';

import { ZxingScanner } from './zxing-scanner';

describe('ZxingScanner', () => {
  let service: ZxingScanner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZxingScanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
