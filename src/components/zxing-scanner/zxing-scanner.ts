import { Component } from '@angular/core';

@Component({
  selector: 'app-zxing-scanner',
  standalone: true,
  imports: [],
  templateUrl: './zxing-scanner.html',
  styleUrl: './zxing-scanner.scss',
})
export class ZxingScanner {
  public output: string = 'No output yet';

  constructor() {}

}
