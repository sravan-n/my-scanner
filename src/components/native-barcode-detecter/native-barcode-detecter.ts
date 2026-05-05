import { Component } from '@angular/core';

@Component({
  selector: 'app-native-barcode-detecter',
  standalone: true,
  imports: [],
  templateUrl: './native-barcode-detecter.html',
  styleUrl: './native-barcode-detecter.scss'
})
export class NativeBarcodeDetecter {
  public output: string = 'No output yet';

  constructor() {}

}
