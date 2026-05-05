import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-native-barcode-detecter',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './native-barcode-detecter.html',
  styleUrl: './native-barcode-detecter.scss'
})
export class NativeBarcodeDetecter {
  public imei = '';
  public output: string = 'No output yet';

  constructor() {}

  public scan(): void {
    this.output = this.imei ? `Scanning IMEI: ${this.imei}` : 'No IMEI entered';
  }

  public updateImei(value: string): void {
    this.imei = value.replace(/\D/g, '').slice(0, 15);
  }

  public allowOnlyImeiDigits(event: Event): void {
    const inputEvent = event as InputEvent;

    if (inputEvent.data && /\D/.test(inputEvent.data)) {
      event.preventDefault();
    }
  }
}
