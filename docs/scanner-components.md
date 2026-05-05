# Scanner Components

This app has two scanner implementations for reading IMEI barcodes:

- `NativeBarcodeDetecter` uses the browser-native Barcode Detection API.
- `ZxingScanner` uses the `@zxing/ngx-scanner` Angular library.

Both components share the same user-facing behavior:

- The IMEI input accepts only numbers.
- The IMEI input is capped at 15 digits.
- Clicking `Scan` starts camera scanning.
- A successful scan writes the detected IMEI into the input and the Output section.
- Clicking `Clear` resets the input and output.

## Native Barcode Detector

Files:

- `src/components/native-barcode-detecter/native-barcode-detecter.ts`
- `src/components/native-barcode-detecter/native-barcode-detecter.html`
- `src/services/native-barcode-scanner.ts`

### Component Role

`NativeBarcodeDetecter` owns the UI state:

- `imei` stores the form value.
- `output` stores the text shown in the Output section.
- `isScanning` controls whether the preview video is visible.
- `scan()` starts scanning.
- `clear()` stops scanning and resets the UI.

The Scan button does not use a direct click handler. It submits the form:

```html
<form class="scan-section" (ngSubmit)="scan()">
```

The component gets the preview video with:

```ts
@ViewChild('preview') private preview?: ElementRef<HTMLVideoElement>;
```

When scanning starts, the component passes that video element to `NativeBarcodeScanner`.

### Service Role

`NativeBarcodeScanner` owns the browser and camera logic:

- Checks whether `window.BarcodeDetector` exists.
- Checks whether `navigator.mediaDevices.getUserMedia` exists.
- Requests the rear camera with `facingMode: 'environment'`.
- Attaches the camera stream to the preview video.
- Creates a `BarcodeDetector`.
- Runs detection frame-by-frame with `requestAnimationFrame`.
- Extracts digits from the barcode value and limits them to 15 digits.
- Stops camera tracks and clears timers after success, error, timeout, or clear.

Main method:

```ts
scanNativeBarcode(video: HTMLVideoElement): Promise<string>
```

The promise resolves with the detected IMEI string.

Cleanup method:

```ts
stopScanning(video?: HTMLVideoElement): void
```

This stops the animation frame, timeout, video preview, and camera stream.

### Native API Explanation

The browser Barcode Detection API is exposed as:

```ts
window.BarcodeDetector
```

The service creates it with supported barcode formats:

```ts
new BarcodeDetector({ formats })
```

Then it calls:

```ts
detector.detect(video)
```

This returns detected barcode objects. The app reads `rawValue`, keeps only digits, and stores the first 15 digits as the IMEI.

Native Barcode Detection is browser-dependent. If the browser does not support it, the component shows:

```text
Barcode Detector API is not supported in this browser
```

Camera access also requires a secure context, such as `localhost` or HTTPS.

## ZXing Scanner

Files:

- `src/components/zxing-scanner/zxing-scanner.ts`
- `src/components/zxing-scanner/zxing-scanner.html`
- `src/services/zxing-scanner.ts`

### Component Role

`ZxingScanner` owns the UI state:

- `imei` stores the form value.
- `output` stores the text shown in the Output section.
- `isScanning` controls whether the ZXing scanner is rendered.
- `scan()` turns scanning on.
- `clear()` turns scanning off and resets the UI.
- `onScanSuccess()` handles successful barcode reads.
- `onScanError()`, `onCamerasNotFound()`, and `onPermissionResponse()` handle scanner errors.

The Scan button also submits the form:

```html
<form class="scan-section" (ngSubmit)="scan()">
```

The ZXing scanner element is rendered only while `isScanning` is true:

```html
@if (isScanning) {
  <zxing-scanner ...></zxing-scanner>
}
```

This matters because `@zxing/ngx-scanner` defaults to autostarting when the scanner component is rendered. Delaying render prevents the camera from opening before the user clicks `Scan`.

### Service Role

`ZxingScanner` service owns ZXing-specific helpers:

- Provides the supported ZXing barcode formats.
- Converts a scanned barcode value into a 15-digit IMEI.
- Provides user-facing error/status messages.

Supported formats:

```ts
BarcodeFormat.CODE_128
BarcodeFormat.CODE_39
BarcodeFormat.EAN_13
BarcodeFormat.EAN_8
BarcodeFormat.ITF
BarcodeFormat.UPC_A
BarcodeFormat.UPC_E
```

IMEI extraction:

```ts
getImeiFromBarcode(rawValue: string): string
```

This strips non-numeric characters and limits the result to 15 digits.

### ZXing API Explanation

The app imports:

```ts
ZXingScannerModule
```

The template uses the library component:

```html
<zxing-scanner
  [autostart]="true"
  [enable]="true"
  [formats]="barcodeFormats"
  [tryHarder]="true"
  [timeBetweenScans]="250"
  [delayBetweenScanSuccess]="500"
  previewFitMode="cover"
  (scanSuccess)="onScanSuccess($event)"
  (scanError)="onScanError($event)"
  (camerasNotFound)="onCamerasNotFound()"
  (permissionResponse)="onPermissionResponse($event)"
></zxing-scanner>
```

Important bindings:

- `[formats]` tells ZXing which barcode types to detect.
- `[tryHarder]="true"` asks ZXing to spend more effort decoding.
- `[enable]="true"` enables scanner operation while the component is rendered.
- `(scanSuccess)` emits the decoded barcode text.
- `(scanError)` emits scanner errors.
- `(camerasNotFound)` emits when no camera is available.
- `(permissionResponse)` reports camera permission status.

On success, `onScanSuccess()` receives the raw decoded barcode string, asks the service to extract the IMEI, closes the scanner preview, and updates the Output section.

## Input Validation

Both components validate the IMEI field in the same way:

- `maxlength="15"` limits the input length.
- `inputmode="numeric"` shows a numeric keyboard on supported devices.
- `allowOnlyImeiDigits()` blocks non-digit typed input.
- `updateImei()` sanitizes the bound value as a fallback.

The sanitizer is:

```ts
value.replace(/\D/g, '').slice(0, 15)
```

This means pasted text such as `IMEI: 12345-67890-12345` becomes `123456789012345`.

## Cleanup Behavior

Native scanner cleanup is explicit because the app owns the camera stream. `NativeBarcodeScanner.stopScanning()` stops:

- the animation frame loop
- the timeout
- the preview video
- all camera tracks

ZXing cleanup is controlled by Angular rendering. When `isScanning` becomes false, `<zxing-scanner>` is removed from the DOM, and the library releases its scanner resources.

## Current Architecture

The components are intentionally thin:

- Components handle UI state and template events.
- Services handle scanner-specific API logic.

This keeps native browser scanning and ZXing library scanning separate, which makes future changes easier. For example, adding more barcode formats or changing scanner timeout behavior can happen inside the related service without rewriting the component UI.
