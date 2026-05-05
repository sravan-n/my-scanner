import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeBarcodeDetecter } from './native-barcode-detecter';

describe('NativeBarcodeDetecter', () => {
  let component: NativeBarcodeDetecter;
  let fixture: ComponentFixture<NativeBarcodeDetecter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NativeBarcodeDetecter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NativeBarcodeDetecter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
