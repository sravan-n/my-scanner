import { Injectable } from '@angular/core';

type DetectedBarcode = {
  rawValue: string;
};

type NativeBarcodeDetector = {
  detect(source: HTMLVideoElement): Promise<DetectedBarcode[]>;
};

type NativeBarcodeDetectorConstructor = {
  new (options?: { formats?: string[] }): NativeBarcodeDetector;
  getSupportedFormats?: () => Promise<string[]>;
};

type WindowWithBarcodeDetector = Window & {
  BarcodeDetector?: NativeBarcodeDetectorConstructor;
};

@Injectable({
  providedIn: 'root',
})
export class NativeBarcodeScanner {
  private readonly barcodeFormats = [
    'code_128',
    'code_39',
    'ean_13',
    'ean_8',
    'itf',
    'upc_a',
    'upc_e',
  ];

  private detector?: NativeBarcodeDetector;
  private scanFrameId?: number;
  private scanTimeoutId?: ReturnType<typeof setTimeout>;
  private stream?: MediaStream;

  public async scanNativeBarcode(video: HTMLVideoElement): Promise<string> {
    const BarcodeDetector = (window as WindowWithBarcodeDetector).BarcodeDetector;

    if (!BarcodeDetector) {
      throw new Error('Barcode Detector API is not supported in this browser');
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera access is not supported in this browser');
    }

    this.stopScanning(video);

    try {
      this.detector = new BarcodeDetector({
        formats: await this.getSupportedFormats(BarcodeDetector),
      });
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
        audio: false,
      });

      video.srcObject = this.stream;
      await video.play();

      return await new Promise((resolve, reject) => {
        this.scanTimeoutId = setTimeout(() => {
          this.stopScanning(video);
          reject(new Error('No barcode detected'));
        }, 30000);

        this.detectBarcode(video, resolve);
      });
    } catch (error) {
      this.stopScanning(video);
      throw error;
    }
  }

  public stopScanning(video?: HTMLVideoElement): void {
    if (this.scanFrameId) {
      cancelAnimationFrame(this.scanFrameId);
      this.scanFrameId = undefined;
    }

    if (this.scanTimeoutId) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = undefined;
    }

    if (video) {
      video.pause();
      video.srcObject = null;
    }

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = undefined;
    this.detector = undefined;
  }

  private async getSupportedFormats(
    BarcodeDetector: NativeBarcodeDetectorConstructor,
  ): Promise<string[]> {
    if (!BarcodeDetector.getSupportedFormats) {
      return this.barcodeFormats;
    }

    const supportedFormats = await BarcodeDetector.getSupportedFormats();
    const imeiFormats = this.barcodeFormats.filter((format) => supportedFormats.includes(format));

    return imeiFormats.length ? imeiFormats : supportedFormats;
  }

  private detectBarcode(video: HTMLVideoElement, resolve: (imei: string) => void): void {
    if (!this.detector) {
      return;
    }

    this.scanFrameId = requestAnimationFrame(async () => {
      try {
        const barcodes = await this.detector?.detect(video);
        const rawValue = barcodes?.find((barcode) => barcode.rawValue)?.rawValue;
        const imei = rawValue ? this.getImeiFromBarcode(rawValue) : '';

        if (imei) {
          this.stopScanning(video);
          resolve(imei);
          return;
        }
      } catch {
        // Some frames can fail while the camera warms up; keep scanning.
      }

      this.detectBarcode(video, resolve);
    });
  }

  private getImeiFromBarcode(rawValue: string): string {
    return rawValue.replace(/\D/g, '').slice(0, 15);
  }
}
