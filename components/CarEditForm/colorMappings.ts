import { CSSProperties } from 'react';

import { CarColor } from '../../services/car.service';

export const colorMappings: { [value in CarColor]: CSSProperties } = {
  black: { backgroundColor: '#000000' },
  gray: { backgroundColor: '#838383' },
  silver: {
    backgroundColor: '#f1f2f6',
    backgroundImage: 'linear-gradient(315deg, #f1f2f6 0%, #c9c6c6 74%)',
  },
  white: { backgroundColor: '#ffffff', border: '1px solid #aaa' },
  red: { backgroundColor: '#a30606' },
  blue: { backgroundColor: '#173fa3' },
  gold: {
    background:
      'radial-gradient(ellipse farthest-corner at left top, #FFFFAC 0%, #D1B464 25%, #5d4a1f 100%',
  },
  brown: { backgroundColor: '#854c26' },
  purple: { backgroundColor: '#581958' },
  beige: { backgroundColor: '#eccf9e' },
  green: { backgroundColor: '#146914' },
  orange: { backgroundColor: '#f2922c' },
};
