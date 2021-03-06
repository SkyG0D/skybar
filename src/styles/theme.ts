import { extendTheme } from '@chakra-ui/react';
import { GlobalStyleProps, mode } from '@chakra-ui/theme-tools';

import { Button } from './components/button';

export const theme = extendTheme({
  components: {
    Button,
  },
  colors: {
    brand: {
      '900': '#4C0070',
      '800': '#4C0070',
      '700': '#4C0070',
      '600': '#4C0070',
      '500': '#79018C',
      '400': '#79018C',
      '300': '#79018C',
      '200': '#79018C',
      '100': '#9A0680',
    },
    grayAlpha: {
      '900': 'rgba(31, 32, 41, 0.9)',
      '800': 'rgba(31, 32, 41, 0.8)',
      '700': 'rgba(31, 32, 41, 0.7)',
      '600': 'rgba(31, 32, 41, 0.6)',
      '500': 'rgba(31, 32, 41, 0.5)',
      '400': 'rgba(31, 32, 41, 0.4)',
      '300': 'rgba(31, 32, 41, 0.3)',
      '200': 'rgba(31, 32, 41, 0.2)',
      '100': 'rgba(31, 32, 41, 0.1)',
    },
    gray: {
      '900': '#181b23',
      '800': '#1f2029',
      '700': '#353646',
      '600': '#4b4d63',
      '500': '#616480',
      '400': '#797d9a',
      '300': '#9699b0',
      '200': '#b3b5c6',
      '100': '#d1d2dc',
      '50': '#eeeef2',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.900', 'gray.50')(props),
      },
    }),
  },
});
