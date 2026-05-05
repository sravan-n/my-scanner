import { Injectable } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

@Injectable({
  providedIn: 'root',
})
export class ZxingScanner {
  public readonly barcodeFormats = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.ITF,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ];

  public getImeiFromBarcode(rawValue: string): string {
    return rawValue.replace(/\D/g, '').slice(0, 15);
  }

  public getScanErrorMessage(error: Error): string {
    return error.message || 'Unable to scan barcode';
  }

  public getCamerasNotFoundMessage(): string {
    return 'No camera found';
  }

  public getPermissionDeniedMessage(): string {
    return 'Camera permission was denied';
  }
}
