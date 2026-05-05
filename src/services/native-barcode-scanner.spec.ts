import { TestBed } from '@angular/core/testing';

import { NativeBarcodeScanner } from './native-barcode-scanner';

describe('NativeBarcodeScanner', () => {
  let service: NativeBarcodeScanner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeBarcodeScanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
