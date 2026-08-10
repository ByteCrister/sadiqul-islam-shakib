import { Inter, Space_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  // Used as a substitute for FrameGothic
});

export const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-space-mono',
  // Used as a substitute for NeueMachinaInktrap
});
