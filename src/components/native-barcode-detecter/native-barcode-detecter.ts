import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NativeBarcodeScanner } from '../../services/native-barcode-scanner';

@Component({
  selector: 'app-native-barcode-detecter',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './native-barcode-detecter.html',
  styleUrl: './native-barcode-detecter.scss'
})
export class NativeBarcodeDetecter implements OnDestroy {
  @ViewChild('preview') private preview?: ElementRef<HTMLVideoElement>;

  public imei = '';
  public output: string = 'No output yet';
  public isScanning = false;

  constructor(
    private readonly scannerService: NativeBarcodeScanner,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngOnDestroy(): void {
    this.scannerService.stopScanning(this.preview?.nativeElement);
  }

  public async scan(): Promise<void> {
    if (this.isScanning) {
      return;
    }

    const video = this.preview?.nativeElement;

    if (!video) {
      this.output = 'Scanner preview is not available';
      return;
    }

    try {
      this.isScanning = true;
      this.output = 'Scanning...';
      this.changeDetectorRef.detectChanges();

      const imei = await this.scannerService.scanNativeBarcode(video);
      this.updateImei(imei);
      this.output = imei;
    } catch (error) {
      this.output = error instanceof Error ? error.message : 'Unable to start barcode scanner';
    } finally {
      this.isScanning = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  public updateImei(value: string): void {
    this.imei = value.replace(/\D/g, '').slice(0, 15);
  }

  public clear(): void {
    this.scannerService.stopScanning(this.preview?.nativeElement);
    this.imei = '';
    this.output = 'No output yet';
    this.isScanning = false;
    this.changeDetectorRef.detectChanges();
  }

  public allowOnlyImeiDigits(event: Event): void {
    const inputEvent = event as InputEvent;

    if (inputEvent.data && /\D/.test(inputEvent.data)) {
      event.preventDefault();
    }
  }
}
