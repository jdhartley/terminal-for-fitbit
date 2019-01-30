import { FitFont } from 'fitfont';

// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function createFontFit(id) {
  return new FitFont({ id, font: 'Source_Code_Pro_22' });
}
