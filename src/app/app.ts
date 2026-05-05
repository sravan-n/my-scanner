import { Component, signal } from '@angular/core';

import NativeBarcodeDetecter from '../components/native-barcode-detecter/native-barcode-detecter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NativeBarcodeDetecter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-scanner');
}
