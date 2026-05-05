import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ZxingScanner as ZxingScannerService } from '../../services/zxing-scanner';

@Component({
  selector: 'app-zxing-scanner',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, ZXingScannerModule],
  templateUrl: './zxing-scanner.html',
  styleUrl: './zxing-scanner.scss',
})
export class ZxingScanner implements OnDestroy {
  public imei = '';
  public output: string = 'No output yet';
  public isScanning = false;

  constructor(
    private readonly scanner: ZxingScannerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public get barcodeFormats() {
    return this.scanner.barcodeFormats;
  }

  public scan(): void {
    if (this.isScanning) {
      return;
    }

    this.isScanning = true;
    this.output = 'Scanning...';
  }

  public ngOnDestroy(): void {
    this.isScanning = false;
  }

  public updateImei(value: string): void {
    this.imei = value.replace(/\D/g, '').slice(0, 15);
  }

  public clear(): void {
    this.isScanning = false;
    this.imei = '';
    this.output = 'No output yet';
    this.changeDetectorRef.detectChanges();
  }

  public onScanSuccess(result: string): void {
    this.updateImei(this.scanner.getImeiFromBarcode(result));
    this.output = this.imei || 'Scanned barcode does not contain an IMEI';
    this.isScanning = false;
    this.changeDetectorRef.detectChanges();
  }

  public onScanError(error: Error): void {
    this.output = this.scanner.getScanErrorMessage(error);
    this.isScanning = false;
    this.changeDetectorRef.detectChanges();
  }

  public onCamerasNotFound(): void {
    this.output = this.scanner.getCamerasNotFoundMessage();
    this.isScanning = false;
    this.changeDetectorRef.detectChanges();
  }

  public onPermissionResponse(hasPermission: boolean): void {
    if (!hasPermission) {
      this.output = this.scanner.getPermissionDeniedMessage();
      this.isScanning = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  public allowOnlyImeiDigits(event: Event): void {
    const inputEvent = event as InputEvent;

    if (inputEvent.data && /\D/.test(inputEvent.data)) {
      event.preventDefault();
    }
  }
}
