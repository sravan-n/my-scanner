import { Component, signal } from '@angular/core';
import { NativeBarcodeDetecter, ZxingScanner } from '../components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NativeBarcodeDetecter, ZxingScanner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-scanner');
}
